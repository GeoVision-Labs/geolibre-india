export type IdentifyResult = {
        id: string | number | undefined;
        geometryType: "Point" | "LineString" | "Polygon" |"MultiPoint" | "MultiPolygon" | "GeometryCollection" | "MultiLineString";
        layerId: string;
        properties: Record<string, unknown>;
}