import { useEffect, useRef } from "react";
import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import utilityNetwork from '../../data/utility-network.json';

maplibregl.setWorkerUrl(workerUrl);

type MapComponentProps = {
	onFeatureSelect: (feature: unknown) => void;
	onMapReady?: (map: maplibregl.Map) => void;
	searchValue?: string;
};

function MapComponent({ onFeatureSelect, onMapReady, searchValue }: MapComponentProps) {

	const selectedFeatureId = useRef<string | number>(null);
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);

	const selectFeature = (map: maplibregl.Map, feature: any) => {
		if (!feature) return;

		if (selectedFeatureId.current !== null) {
			map.setFeatureState({
				source: "utility-network",
				id: selectedFeatureId.current,
			},
			{
				selected: false
			});
		}

		selectedFeatureId.current = feature.properties?.assetId;

		map.setFeatureState(
			{
				source: "utility-network",
				id: selectedFeatureId.current,
			},
			{
				selected: true,
			}
		);

		const properties = feature.properties;

		console.log("selected Feature: ", feature);

		onFeatureSelect?.({
					assetType: properties?.assetType,
					assetId: properties?.assetId,
					status: properties?.status,
				});
	}

	
	const clearSelection = (map: maplibregl.Map) => {
		if (selectedFeatureId.current === null) {
			return;
		}

		map.setFeatureState(
			{
				source: "utility-network",
				id: selectedFeatureId.current,
			},
			{
				selected: false
			}
		);
		selectedFeatureId.current = null;

		onFeatureSelect?.(null);
	}

	useEffect(() => {
		
		if (!mapContainer.current) return;

		const map = new maplibregl.Map({
			container: mapContainer.current,
			style: "https://demotiles.maplibre.org/style.json",
			center: [83.2185, 17.6868],
			zoom: 10,
		})

		mapRef.current = map;
		map.on("error", (e) => { console.error("Map error:", e); });
		map.addControl(new maplibregl.NavigationControl(), "top-right");

		map.on("load", () => {

			onMapReady?.(map);

			map.addSource("utility-network", {
				type: "geojson",
				data: utilityNetwork,
				promoteId: "assetId",
			});

			map.addLayer({
				id: 'power-lines',
				type: 'line',
				source: "utility-network",
				filter: ["==", ["geometry-type"], "LineString"],
				paint: {
					"line-color": "#ff6600",
					"line-width": 4,
				},
			});

			map.addLayer({
				id: 'service-areas',
				type: "fill",
				source: 'utility-network',
				filter: ["==", ["geometry-type"], "Polygon"],
				paint: {
					"fill-color": "#3388ff",
					"fill-opacity": 0.2,
					"fill-outline-color": "#3388ff",
				},
			});

			map.addLayer({
				id: 'utility-points',
				type: "circle",
				source: "utility-network",
				filter: ["==", ["geometry-type"], "Point"],
				paint: {
					"circle-radius": 7,
					"circle-color": [
						"case",
						["boolean", ["feature-state", "selected"], false],
						"#ffa000",
						"#00ff00",
					],
					"circle-stroke-color": "#ffffff",
					"circle-stroke-width": 2,
				}
			});

			map.on("click", (event) => {
				const features = map.queryRenderedFeatures(event.point, {
					layers: ["utility-points"],
				});

				if (features.length === 0) {
					clearSelection(map);
					return;
				}

				const feature = features[0];

				if (feature.id == null) {
					return;
				}

				selectFeature(map, feature);
			});
			
		});

		return () => {
			map.remove();
		}
	}, []);

	useEffect(() => {
		if (!searchValue?.trim()) return;

		const map = mapRef.current;

		if (!map) return;

		const search = searchValue.trim().toLowerCase();

		const feature = utilityNetwork.features.find((f) => {
			const assetId = f.properties?.assetId;
			console.log(assetId)

			return (
				typeof assetId === "string" && assetId.toLowerCase() === search
			);
		});

		if (!feature) {
			console.log("Feature not found: ", searchValue);
			return
		}

		console.log("Search Result: ", feature);

		const geometry = feature.geometry;

		if(geometry.type !== "Point") {
			console.log("Search result is not a point: ", geometry.type);
			return;
		}

		const coordinates = geometry.coordinates as [number, number];

		map.flyTo({
			center: coordinates,
			zoom: 16,
			duration: 1000,
		});

		selectFeature(map, feature);

	}, [searchValue, onFeatureSelect]);

	return (
		<div style={{ position: "relative", width: "100%", height: "100vh" }} >
			<div ref={mapContainer} style={{width: "100%", height: "100%"}} />
		</div>
	)
}

export default MapComponent;