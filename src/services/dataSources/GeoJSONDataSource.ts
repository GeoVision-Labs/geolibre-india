import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import type { DataSource, DataSourceCapabilities } from "../../types/DataSource";

export class GeoJSONDataSource {
    private readonly definition: DataSource;

    constructor(
        id: string,
        data: FeatureCollection<Geometry, GeoJsonProperties>,
    ) {
        const capabilities: DataSourceCapabilities = {
            load: true,
            query: true,
            identify: true,
            search: true,
            spatialFilter: true,
            edit: true,
        };

        this.definition = {
            id,
            type: "geojson",
            capabilities,
            config: {
                data,
            },
        };
    }

    getDefinition(): DataSource {
        return this.definition;
    }

    getData(): FeatureCollection<Geometry, GeoJsonProperties> {
        return this.definition.config.data as FeatureCollection<Geometry, GeoJsonProperties>;
    }
}