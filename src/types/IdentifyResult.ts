export type IdentifyResult = {
        id: string | number;
        geometryType: "Point" | "LineString" | "Polygon";
        layerId: string;
        properties: Record<string, unknown>;
}