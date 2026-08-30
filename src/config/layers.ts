import type { LayerDefinition } from "../types/LayerDefinition";

export const utilityLayers: LayerDefinition[] = [
    {
        id: "utility-points",
        name: "Utility Points",
        sourceId: "utility-network",
        geometryType: "Point",
        visible: true,
        style: {
            type: "circle",
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
        }
    },
    {
        id: "power-lines",
        name: "Power Lines",
        sourceId: "utility-network",
        geometryType: "LineString",
        visible: true,
        style: {
            type: "line",
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
        }
    },
    {
        id: "service-areas",
        name: "Service Areas",
        sourceId: "utility-network",
        geometryType: "Polygon",
        visible: true,
        style: {
            type: "fill",
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
        }
    },
];
