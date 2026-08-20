import { useEffect, useState, useRef } from "react";
import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import utilityNetwork from '../../data/utility-network.json';
import { bbox } from "@turf/bbox";
import home from "/home.png";
import LocateControl from "./LocateControl";
import type { IdentifyResult } from "../../types/IdentifyResult";

maplibregl.setWorkerUrl(workerUrl);

type MapComponentProps = {
	onFeatureSelect: (feature: IdentifyResult | null) => void;
	onMapReady?: (map: maplibregl.Map) => void;
	searchValue?: string;
	onClearSelection?: (clearFn: () => void) => void;
	onZoomToFeature?: (zoomFn: () => void) => void;
	onIdentifyResults?: (results: IdentifyResult[]) => void;
	hoveredFeature?: IdentifyResult | null;
	onSelectFeature?: (selectFn: (feature: IdentifyResult) => void) => void;
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

function MapComponent({ onFeatureSelect, onMapReady, 
	searchValue, onClearSelection, onZoomToFeature, 
	onIdentifyResults, hoveredFeature, onSelectFeature
 }: MapComponentProps) {

	const utilityNetworkGeoJSON = utilityNetwork as unknown as GeoJSON.FeatureCollection;
	const selectedFeatureId = useRef<string | number>(null);
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const hoveredFeatureId = useRef<string | number | undefined>(undefined);

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

		const properties = feature.properties as Record<string, unknown>;
		const identifyResult: IdentifyResult = {
			id: feature.id,
			geometryType: feature.geometry?.type,
			layerId: feature.layer?.id ?? "",
			properties,
		};

		onFeatureSelect?.(identifyResult);
	}

	const zoomToFeature = (
		map: maplibregl.Map,
		feature: any
	) => {
		if(!feature) {
			return;
		}
		
		const geometry = feature.geometry;

		if(geometry.type === "Point") {
			const coordinates = geometry.coordinates as [number, number];
			map.flyTo({
				center: coordinates,
				zoom: 16,
				duration: 1000,
			});
			return;
		} else {
			const bounds = bbox(feature as any) as [number, number, number, number];

			map.fitBounds(
				[
					[bounds[0], bounds[1]],
					[bounds[2], bounds[3]]
				],
				{
					padding: 100,
					duration: 1000,
					maxZoom: 17,
				}
			);
		}
	}

	const zoomToSelectedFeature = () => {
		const map = mapRef.current;

		if (!map || selectedFeatureId.current === null) {return;}
		const feature = utilityNetwork.features.find(
			(item) => item.properties?.assetId === selectedFeatureId.current
		);
		if (!feature) {return;}
		zoomToFeature(map, feature);
	};

	const clearSelection = (map: maplibregl.Map) => {
		if (selectedFeatureId.current !== null) {
			map.setFeatureState(
				{
					source: "utility-network",
					id: selectedFeatureId.current,
				},
				{
					selected: false,
				}
			);
		}
		selectedFeatureId.current = null;
		onFeatureSelect?.(null);
	}

	useEffect(() => {
		const map = mapRef.current;

		if(!map) {
			return;
		}

		if(hoveredFeatureId.current !== undefined) {
			map.setFeatureState(
				{
					source: "utility-network",
					id: hoveredFeatureId.current,
				},
				{
					hovered: false,
				}
			);
			hoveredFeatureId.current = undefined;
		}

		if (!hoveredFeature || hoveredFeature.id === undefined) {
			return;
		}

		map.setFeatureState(
			{
				source: "utility-network",
				id: hoveredFeature.id,
			},
			{
				hovered: true,
			}
		);
		hoveredFeatureId.current = hoveredFeature.id;
	}, [hoveredFeature]);

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
							["boolean", ["feature-state", "hovered"], false],
							"#ffff00",
							["boolean", ["feature-state", "selected"], false],
							"#ffa000",
							"#ff6600",
						],
						"line-width": [
							"case",
							["boolean", ["feature-state", "hovered"], false],
							8,
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
							["boolean", ["feature-state", "hovered"], false],
							"#ffff00",
							["boolean", ["feature-state", "selected"], false],
							"#ffa000",
							"#3388ff",
						],
						"fill-opacity": [
							"case",
							["boolean", ["feature-state", "hovered"], false],
							0.4,
							["boolean", ["feature-state", "selected"], false],
							0.45,
							0.2,
						],
						"fill-outline-color": [
							"case",
							["boolean", ["feature-state", "hovered"], false],
							"#ffff00",
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
						"circle-radius": [
							"case",
							["boolean", ["feature-state", "hovered"], false],
							10,
							7,
						],
						"circle-color": [
							"case", 
							["boolean", ["feature-state", "hovered"], false], 
							"#ffff00",
							["boolean", ["feature-state", "selected"], false], 
							"#ffa000", 
							"#00ff00",
						],
						"circle-stroke-color": "#ffffff",
						"circle-stroke-width": 2,
					},
				});
			}
		};

		map.on("load", () => {

			onMapReady?.(map);
			onSelectFeature?.((feature: IdentifyResult) => {
				const sourceFeature = utilityNetwork.features.find(
					(item) => item.properties?.assetId === feature.id
				);
				if (!sourceFeature) {return;}

				selectFeature(map, sourceFeature);
			});
			map.on("click", (event) => {
				const features = map.queryRenderedFeatures(event.point, {
					layers: [
					"utility-points",
					"power-lines",
					"service-areas",
					],
				});
				
				if (features.length === 0) {
					clearSelection(map);
					return;
				}
				
				const identifyResults: IdentifyResult[] = features
					.filter((feature) => feature.id != null)
					.map((feature) => ({
					id: feature.id,
					geometryType: feature.geometry?.type ?? "",
					layerId: feature.layer?.id ?? "",
					properties: feature.properties as Record<string, unknown>,
					}));
				
				if (identifyResults.length === 0) {
					clearSelection(map);
					return;
				}
				
				if (identifyResults.length === 1) {
					selectFeature(map, features[0]);
					return;
				}
				clearSelection(map);
				onIdentifyResults?.(identifyResults);
				});

		});

		map.on("style.load", () => {addUtilityLayers();});

		return () => {
			map.remove();
		}
	}, []);

	//Search UseEffect
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
		selectFeature(map, feature);
		zoomToSelectedFeature();

	}, [searchValue, onFeatureSelect]);
	
	useEffect(() => {
		onZoomToFeature?.(zoomToSelectedFeature);
	}, [onZoomToFeature]);

	
	

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