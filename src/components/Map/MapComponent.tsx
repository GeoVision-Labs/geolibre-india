import { useEffect, useState, useRef } from "react";
import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import utilityNetwork from '../../data/utility-network.json';
import { bbox } from "@turf/bbox";
import home from "/home.png";
import LocateControl from "./LocateControl";

maplibregl.setWorkerUrl(workerUrl);

type MapComponentProps = {
	onFeatureSelect: (feature: Record<string, unknown> | null) => void;
	onMapReady?: (map: maplibregl.Map) => void;
	searchValue?: string;
	onClearSelection?: (clearFn: () => void) => void;
};

class HomeControl implements
maplibregl.IControl {
	private map?: maplibregl.Map; 
	onAdd(map: maplibregl.Map) {
		this.map = map;
		const container = document.createElement("div");
		container.className = "maplibregl-ctrl maplibregl-ctrl-group";

		const icon = document.createElement("img");
		icon.src = home;
		icon.alt = "Icon";
		icon.style.width = "30px";

		const button = document.createElement("button");
		button.type = "button";
		button.title = "Zoom to full extent";
		button.setAttribute("aria-label", "Zoom to full extent");
		button.appendChild(icon);

		button.onclick = () => {
			if(!this.map) return;
			const bounds = bbox(utilityNetwork as any) as [
				number,
				number,
				number,
				number
			];
			this.map.fitBounds(
				[
					[bounds[0], bounds[1]],
					[bounds[2], bounds[3]],
				],
				{
					padding: 60,
					duration: 800,
				}
			);
		};
		container.appendChild(button);
		return container;
	}

	onRemove() {
		this.map = undefined;
	}
}

function MapComponent({ onFeatureSelect, onMapReady, searchValue, onClearSelection }: MapComponentProps) {

	const utilityNetworkGeoJSON = utilityNetwork as unknown as GeoJSON.FeatureCollection;
	const selectedFeatureId = useRef<string | number>(null);
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);

	const [coordinates, setCoordinates] = useState<{
		lng: number;lat:number
	} | null>(null);

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
		const previousSelectedId = selectedFeatureId.current;
		if (previousSelectedId !== null) {
			map.setFeatureState(
				{
					source: "utility-network",
					id: previousSelectedId,
				},
				{
					selected: false,
				}
			);
		}

		selectedFeatureId.current = feature.properties?.assetId;
		if (selectedFeatureId.current !== null) {
			map.setFeatureState(
				{
					source: "utility-network",
					id: selectedFeatureId.current,
				},
				{
					selected: true,
				}
			);	
		}

		const properties = feature.properties as Record<string, unknown> | undefined;

		onFeatureSelect?.(properties ?? null);
	}

	const clearSelection = (map: maplibregl.Map) => {
		if (selectedFeatureId.current === null) {
			return;
		} else {
			map.setFeatureState(
			{
				source: "utility-network",
				id: selectedFeatureId.current,
			},
			{
				selected: false
			}
		);
		}
		
		selectedFeatureId.current = null;

		onFeatureSelect?.(null);
	}

	useEffect(() => {
		onClearSelection?.(() => {
			const map = mapRef.current;
			if (map) {
				clearSelection(map);
			}
		});
	}, [onClearSelection]);

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
		
		map.on("mousemove", (event) => {
			setCoordinates({
				lng: event.lngLat.lng,
				lat: event.lngLat.lat,
			});
		});

		map.addControl(new maplibregl.FullscreenControl(), "top-right");
		map.addControl(new maplibregl.NavigationControl(), "top-right");
		map.addControl(new maplibregl.ScaleControl({
			maxWidth: 100,
			unit: "metric",
		}));
		map.addControl(new HomeControl(), "top-right");
		map.addControl(new LocateControl, "top-right");

		const addUtilityLayers = () => {
			if(!map.getSource("utility-network")) {
				map.addSource("utility-network", {
					type: "geojson",
					data: utilityNetworkGeoJSON,
					promoteId: "assetId",
				});
			}
			if (!map.getLayer("power-lines")) {
				map.addLayer({
					id: "power-lines",
					type: "line",
					source: "utility-network",
					filter: ["==", ["geometry-type"], "LineString"],
					paint: {
						"line-color": [
							"case",
							["boolean", ["feature-state", "selected"], false],
							"#ffa000",
							"#ff6600",
						],
						"line-width": [
							"case",
							["boolean", ["feature-state", "selected"], false],
							7,
							4,
						],
					},
				});
			}
			if (!map.getLayer("service-areas")) {
				map.addLayer({
					id: "service-areas",
					type: "fill",
					source: "utility-network",
					filter: ["==", ["geometry-type"], "Polygon"],
					paint: {
						"fill-color": [
							"case",
							["boolean", ["feature-state", "selected"], false],
							"#ffa000",
							"#3388ff",
						],
						"fill-opacity": [
							"case",
							["boolean", ["feature-state", "selected"], false],
							0.45,
							0.2,
						],
						"fill-outline-color": [
							"case",
							["boolean", ["feature-state", "selected"], false],
							"#ffa000",
							"#3388ff",
						],
					},
				});
			}
			if (!map.getLayer("utility-points")) {
				map.addLayer({
					id: "utility-points",
					type: "circle",
					source: "utility-network",
					filter: ["==", ["geometry-type"], "Point"],
					paint: {
						"circle-radius": 7,
						"circle-color": [
							"case", ["boolean", ["feature-state", "selected"], false], "#ffa000", "#00ff00"
						],
						"circle-stroke-color": "#ffffff",
						"circle-stroke-width": 2,
					},
				});
			}
		};

		map.on("load", () => {

			onMapReady?.(map);

			map.on("click", (event) => {
				const pointFeatures = map.queryRenderedFeatures(event.point, {
					layers: ["utility-points"],
				});
				if (pointFeatures.length > 0) {
					const feature = pointFeatures[0];
					if (feature.id != null) {
						selectFeature(map, feature);
						return;
					}
				}

				const lineFeatures = map.queryRenderedFeatures(event.point, {
					layers: ["power-lines"],
				});
				if (lineFeatures.length > 0) {
					const feature = lineFeatures[0];
					if (feature.id != null) {
						selectFeature(map, feature);
						return;
					}
				}

				const polygonFeatures = map.queryRenderedFeatures(event.point, {
					layers: ["service-areas"],
				});
				if (polygonFeatures.length > 0) {
					const feature = polygonFeatures[0];
					if (feature.id != null) {
						selectFeature(map, feature);
						return;
					}
				}

				clearSelection(map);
			});
			
		});

		map.on("style.load", () => {addUtilityLayers();});

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

			return (
				typeof assetId === "string" && assetId.toLowerCase().includes(search)
			);
		});

		if (!feature) {
			return
		}

		const geometry = feature.geometry;

		if(geometry.type !== "Point") {
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
		<div style={{ position: "fixed", inset: 0, width: "100%", height: "100dvh", overflow: "hidden" }} >
			<div ref={mapContainer} style={{width: "100%", height: "100%"}} />
			{coordinates && (
				<div
					style={{
						position: "absolute",
						bottom: "10px",
						left: "10px",
						background: "white",
						padding: "6px 10px",
						borderRadius: "4px",
						fontSize: "12px",
						zIndex: 10,
					}}>
						Lat: {coordinates.lat.toFixed(5)}
						{" | "}
						Lon: {coordinates.lng.toFixed(5)}
				</div>
			)}
		</div>
	)
}

export default MapComponent;