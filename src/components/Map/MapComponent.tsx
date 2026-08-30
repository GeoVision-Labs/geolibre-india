import { useEffect, useState, useRef } from "react";
import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
// import utilityNetwork from '../../data/utility-network.json';
import { GeoJSONDataSource } from "../../services/dataSources/GeoJSONDataSource";
import { bbox } from "@turf/bbox";
import home from "/home.png";
import LocateControl from "./LocateControl";
import type { IdentifyResult } from "../../types/IdentifyResult";
import MeasurementTool from '../MeasurementControl/MesurementTool';
import { utilityLayers } from "../../config/layers";

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

const utilityNetworkDataSource = new GeoJSONDataSource(
			"utility-network",
		);

const utilityNetwork = utilityNetworkDataSource.getData();

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
			if (!this.map) return;
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

	// const utilityNetworkGeoJSON = utilityNetwork as unknown as GeoJSON.FeatureCollection;
	const selectedFeatureId = useRef<string | number>(null);
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const hoveredFeatureId = useRef<string | number | undefined>(undefined);

	const [coordinates, setCoordinates] = useState<{
		lng: number; lat: number
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
		if (!feature) {
			return;
		}

		const geometry = feature.geometry;

		if (geometry.type === "Point") {
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

		if (!map || selectedFeatureId.current === null) { return; }
		const feature = utilityNetworkDataSource.getData().features.find(
			(item) => item.properties?.assetId === selectedFeatureId.current
		);
		if (!feature) { return; }
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

		if (!map) {
			return;
		}

		if (hoveredFeatureId.current !== undefined) {
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

	//Map initialization useEffect
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
		map.addControl(new MeasurementTool(), "top-right");

		// const addUtilityLayers = () => {
		// 	const pointLayer = utilityLayers.find(
		// 		(layer) => layer.id === "utility-points",
		// 	);
		// 	const lineLayer = utilityLayers.find(
		// 		(layer) => layer.id === "power-lines",
		// 	);
		// 	const polygonLayer = utilityLayers.find(
		// 		(layer) => layer.id === "service-areas",
		// 	);

		// 	if (!pointLayer || !lineLayer || !polygonLayer) {
		// 		throw new Error("Utility layer configuration is incomplete")
		// 	}

		// 	if(!map.getSource("utility-network")) {
		// 		map.addSource("utility-network", {
		// 			type: "geojson",
		// 			data: utilityNetworkGeoJSON,
		// 			promoteId: "assetId",
		// 		});
		// 	}
		// 	if (!map.getLayer("power-lines")) {
		// 		if (!lineLayer.style?.type !== "line") {
		// 			throw new Error("Power line layer must use line style");
		// 		}
		// 		map.addLayer({
		// 			id: lineLayer.id,
		// 			type: "line",
		// 			source: lineLayer.sourceId,
		// 			filter: ["==", ["geometry-type"], "LineString"],
		// 			paint: lineLayer.style.paint,
		// 			layout: {
		// 				...lineLayer.style.layout,
		// 				visibility: lineLayer.visible ? "visible" : "none",
		// 			},
		// 		});
		// 	}
		// 	if (!map.getLayer("service-areas")) {
		// 		map.addLayer({
		// 			id: polygonLayer.id,
		// 			type: "fill",
		// 			source: polygonLayer.sourceId,
		// 			filter: ["==", ["geometry-type"], "Polygon"],
		// 			paint: polygonLayer.style.paint,
		// 			layout: {
		// 				...polygonLayer.style.layout,
		// 				visibility: polygonLayer.visible ? "visible" : "none",
		// 			},
		// 		});
		// 	}
		// 	if (!map.getLayer("utility-points")) {
		// 		map.addLayer({
		// 			id: pointLayer.id,
		// 			type: "circle",
		// 			source: pointLayer.sourceId,
		// 			filter: ["==", ["geometry-type"], "Point"],
		// 			paint: pointLayer.style.paint,
		// 			layout: {
		// 				...pointLayer.style.layout,
		// 				visibility: pointLayer.visible ? "visible" : "none",
		// 			},
		// 		});
		// 	}
		// };

		const addUtilityLayers = () => {

			if (!map.getSource("utility-network")) {
				map.addSource("utility-network", {
					type: "geojson",
					data: utilityNetworkDataSource.getData(),
					promoteId: "assetId",
				});
			}

			const addConfiguredLayer = (
				layer: (typeof utilityLayers)[number]
			) => {

				if (map.getLayer(layer.id)) {
					return;
				}

				switch (layer.style.type) {

					case "circle":
						map.addLayer({
							id: layer.id,
							type: "circle",
							source: layer.sourceId,
							filter: ["==", ["geometry-type"], "Point"],
							paint: layer.style.paint,
							layout: {
								...layer.style.layout,
								visibility: layer.visible
									? "visible"
									: "none",
							},
						});
						break;

					case "line":
						map.addLayer({
							id: layer.id,
							type: "line",
							source: layer.sourceId,
							filter: ["==", ["geometry-type"], "LineString"],
							paint: layer.style.paint,
							layout: {
								...layer.style.layout,
								visibility: layer.visible
									? "visible"
									: "none",
							},
						});
						break;

					case "fill":
						map.addLayer({
							id: layer.id,
							type: "fill",
							source: layer.sourceId,
							filter: ["==", ["geometry-type"], "Polygon"],
							paint: layer.style.paint,
							layout: {
								...layer.style.layout,
								visibility: layer.visible
									? "visible"
									: "none",
							},
						});
						break;
				}
			};

			utilityLayers.forEach(addConfiguredLayer);
		};


		map.on("load", () => {

			onMapReady?.(map);
			onSelectFeature?.((feature: IdentifyResult) => {
				const sourceFeature = utilityNetwork.features.find(
					(item) => item.properties?.assetId === feature.id
				);
				if (!sourceFeature) { return; }

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

		map.on("style.load", () => { addUtilityLayers(); });

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

		const feature = utilityNetworkDataSource.getData().features.find((f) => {
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
			<div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
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