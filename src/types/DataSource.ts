export type DataSourceType = 
    | "geojson"
    | "rest"
    | "ogc-api-features"
    | "wfs"
    | "arcgis-feature-service"
    | "vector-tile"
    | "raster";

export type DataSourceCapabilities = {
    load?: boolean;
    query?: boolean;
    identify?: boolean;
    search?: boolean;
    spatialFilter?: boolean;
    edit?: boolean;
}

export type DataSourceConfig = {
    url?: string;
    data?: unknown;
}

export type DataSource = {
    id: string;
    type: DataSourceType;
    capabilities: DataSourceCapabilities;
    config: DataSourceConfig;
}