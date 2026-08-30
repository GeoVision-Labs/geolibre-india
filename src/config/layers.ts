import type { LayerDefinition } from "../types/LayerDefinition";

export const utilityLayers: LayerDefinition[] = [
    {
        id: "utility-points",
        name: "Utility Points",
        sourceId: "utility-network",
        geometryType: "Point",
        visible: true,
    },
    {
        id: "power-lines",
        name: "Power Lines",
        sourceId: "utility-network",
        geometryType: "LineString",
        visible:true,
    },
    {
        id: "service-areas",
        name: "Service Areas",
        sourceId: "utility-network",
        geometryType: "Polygon",
        visible: true,
    },
];
