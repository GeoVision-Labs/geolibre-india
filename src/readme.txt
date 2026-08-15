# Geolibre India

> Open-source geospatial platform for building scalable GIS applications across India.

Geolibre India is the flagship geospatial application of GeoVisionLabs, designed as a reusable foundation for modern GIS solutions across utilities, natural resources, water resources, urban infrastructure, disaster management, environmental monitoring, and GeoAI.

## Vision
Build a reusable, open-source geospatial technology foundation that can support multiple Indian GIS domain rather than creating isolated applications for each use case.

## Current project
Geolibre India currently provides a web-based application built with React, Typescript, and Maplibre GL. The application supports interactive map visualization, geospatial feature selection, feature information panel, layer controls, and attribute-based feature search.

## Core capapbilities
- Interactive web mapping
- Point, line and polygon visualization
- Feature selection and highlighting
- Feature information panel
- Attribute-based feature search
- Map navigation and controls
- Layer visibility control
- GeoJSON-based geospatial data

## Technology stack
- React
- Typescript
- Maplibre GL
- Vite
- GeoJSON
- HTML and CSS
- Git and GitHub

## Project Direction
Geolibre India is being developed as a long-term geospatial platform rather than a single-domain GIS application. The platform will progressively expand from the current utility GIS foundation into reusable solutions for utilities, natural resources, water resources, urban GIS, disaster management, environmental monitoring and other Indian geospatial applications.

## GIS Domains
The platform is designed to support multiple geospatial domains, including:
- Utility GIS
- Natural resource management
- Urban infrastructure
- Disaster management
- Environmental monitoring
- Land and cadastral GIS
- GeoAI and satellite-based analysis

## Architecture
The application follows a modular React architecture where the map, search, layer control, feaure information, and geospatial data are separated is designed to that local GeoJSON data can later be replaced with APIs, spatial databases, vector tiles, and other geospatial data services without redesigning the entire application.

## Long-Term technology direction
The platform is planned to progressively integrate PostGIS, FastAPI, Geoserver, OGC APIs, vector tiles, PMTiles, Cloud Optimized GeoTIFFs, STAC, GDAL, Geopandas, raster processing, WebGL/WebGPU, and GeoAI technologies as the application evolves.

## Development Roadmap
### Phase 1 - GIS Web Foundation
- React and Typescript
- Maplibre GIS application
- GeoJSON layers
- Layer Controls
- Feature selection
- Feature information
- Attribute-based search

### Phase 2 - Advanced Web GIS
- Vector tiles
- PMTiles
- Drawing and editing
- Measurement tools
- Offline mapping
- Reusable GIS components

### Phase 3 - Backend GIS
- FastAPI
- PostGIS 
- GeoServer
- OGC APIs
- Spatial queries
- Authentication

### Phase 4 - Government GIS Solutions
- Utility GIS
- Disaster management
- Land and cadastral workflows
- Road and infrastructure asset management
- Mobile GIS workflows

### Phase 5 - GeoAI and scalability
- Satellite data
- Raster processing
- Geopandas and GDAL
- Machine learning and GeoAI
- Docker
- CI/CD
- Performance optimization

### Phase 6 - Government-scale geospatial platform
- Web GIS
- Spatial APIs
- Spatial databases
- Mobile platform
- GeoAI
- Authentication
- Testing
- Documentation
- Deployment

## Current status
Active Development
The project is currently in the GIS web foundation stage. The initial utility GIS application is functional, and development is continuing toward a reusable, scalable geospatial platform.

## Current architecture
           Geolibre India
                   |
                   v
             React + vite
                   |
+------------------+------------------+
|                  |                  |
LayerControl  MapComponent          Search
                   |
                   v
            Maplibre GL JS
                   | 
                   v
            Utility network
                   |
                   v
            +------+-------+
            |      |       |
          Point   Line   Polygon
            |
            v
      Feature Selection
            |
            v
      Feature Information

## Target architecture
                      Geolibre India
                            |
                 +----------------------+
                 |                      |
                 v                      v
           Web GIS Client           Mobile GIS
                 |
                 v
          React + Typescript
                 |
                 v
          Maplibre GL JS
                 |
        +-----------------+
        |                 |
        v                 v
    Vector Data      Raster/EO data
        |                 |
        v                 v
    FastAPI            COG/STAC
        |
+-------+------+
|              |
v              v
PostGIS     Goeserver
|
v
Spatial Analysis
|
v
GeoAI/ML

## Project Scope
Geolibre India is intended to grow from a focused GIS web application into a broader geospatial open platform. Individual domain applications will be developed as reusable capabilities within the same foundation, allowing common mapping, spatial analysis, data, API, and GeoAI components to be shared across different use cases.

## Indian GIS focus
The project prioritizes Indian locations, datasets, infrastructure, and real-world geospatial challenges wherever suitable. the long-term goal is to demonstrate how modern open-source GIS technologies cna be applied to practical requirements across Indian government, public infrastructure, environmental, and enterprise domains.

