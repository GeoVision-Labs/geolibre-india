import type {
    CircleLayerSpecification,
    FillLayerSpecification,
    LineLayerSpecification,
} from 'maplibre-gl';

export type LayerStyle =
    | Pick<CircleLayerSpecification, "type" | "paint" | "layout" >
    | Pick<LineLayerSpecification, "type" | "paint" | "layout" >
    | Pick<FillLayerSpecification, "type" | "paint" | "layout" >;