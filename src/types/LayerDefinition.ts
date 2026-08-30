import type { LayerStyle } from "./LayerStyle";

export type LayerGeometryType = 
    | "Point"
    | "LineString"
    | "Polygon"
    | "MultiPoint"
    | "MultiLineString"
    | "MultiPolygon"
    | "GeometryCollection";

export type LayerDefinition = {
    id: string;
    name: string;
    sourceId: string;
    geometryType: LayerGeometryType;
    visible: boolean;
    style: LayerStyle;
}