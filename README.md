# GeoLibre India
 
> Open-source geospatial platform for building reusable GIS applications across India.

## Overview
 
GeoLibre India is a modern open-source geospatial application framework being developed with React, TypeScript, MapLibre GL JS, and GeoJSON.
 
The project is designed to establish a reusable GIS foundation that can support multiple domains instead of creating a separate GIS application for every use case.
 
Potential domains include:
 
- Utility GIS
- Urban infrastructure
- Transportation
- Natural resources
- Environmental monitoring
- Disaster management
- Land and cadastral GIS
- Water resources
- GeoAI and Earth observation
 
The current prototype uses a synthetic utility network around Visakhapatnam, Andhra Pradesh, as the initial demonstration domain.
 
---
 
# Current Status
 
🚧 Active Development
 
The project is currently in **Phase 1 - GIS Web Foundation**.
 
The initial map application is functional and provides a reusable foundation for map navigation, layer management, feature selection, feature identification, search, and feature information.
 
---
 
# Phase 1 - GIS Web Foundation
 
## Map Foundation
 
- MapLibre GL JS web map
- Interactive map navigation
- Zoom in/out
- Compass and rotation
- Fullscreen control
- Home / full extent control
- Scale control
- Locate user control
- Mouse coordinate display
- Basemap switching
 
## Layer Management
 
- Utility data source management
- Point layer
- Line layer
- Polygon layer
- Layer visibility control
- Basemap control
 
## Feature Interaction
 
- Point feature selection
- Line feature selection
- Polygon feature selection
- Feature highlighting using MapLibre feature state
- Previous selection clearing
- Selection clearing from empty map clicks
- Feature information panel
- Dynamic display of feature attributes
- Feature ID
- Geometry type
- Layer information
 
## Feature Actions
 
- Zoom to selected feature
- Point feature zoom using `flyTo`
- Line and polygon zoom using `fitBounds`
- Copy Feature ID
 
## Search
 
The current search workflow supports:2
 
```text
Search
   ↓
Find feature
   ↓
Highlight feature
   ↓
Zoom to feature
   ↓
Feature Information

```

The current prototype searches utility asset identifiers.

## Data

The prototype currently uses GeoJSON data representing a synthetic utility network.
The prototype contains multiple geometry types and realistic domain attributes for demonstrating GIS workflows.
### Example feature types include:
- Substations
- Distribution transformers
- Poles
- Switches
- Smart meters
- Power lines
- Feeders
- Service areas

The data is synthetic and intended only for application development and demonstration.

## Current Architecture

                       GeoLibre India
                              |
                              v
                     React + TypeScript
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
       MapComponent       Search         LayerControl
             |
             v
        MapLibre GL JS
             |
             v
       GeoJSON Data Source
             |
       +-----+-----+ 
       |           |
       v           v
    Point       Line / Polygon
       |           |
       +-----+-----+
             |
             v
      Feature Selection
             |
             v
       IdentifyResult
             |
     +-------+--------+
     |                |
     v                v
Feature Information   Feature Actions
                      |
               +------+------+
               |             |
               v             v
            Zoom To      Copy ID
 
## Identify Model

Feature Identification is represented through a reusable IdentifyResult structure.

Conceptually:
{
  id,
  geometryType,
  layerId,
  properties
}

This separates the application's feature identification model from the domain-specific attributes.

The goal is to allow the same feature interaction framework to work with different GIS domains.

## Technology Stack
- React
- TypeScript
- MapLibre GL JS
- Vite
- Turf.js
- GeoJSON
- HTML
- CSS
- Git
- GitHub

## Repository Structure
geolibre-india/
|
|-- src/
|   |
|   |-- components/
|   |   |
|   |   |-- Map/
|   |   |-- Search/
|   |   |-- LayerControl/
|   |   |-- BasemapControl/
|   |   |-- FeatureInfo/
|   |
|   |-- data/
|   |   |-- utility-network.json
|   |
|   |-- types/
|   |   |-- IdentifyResult.ts
|   |
|   |-- App.tsx
|   |-- main.tsx
|   |-- global.css
|
|-- public/
|
|-- package.json
|-- vite.config.ts
|-- tsconfig.json
|-- README.md

# Development Roadmap

## Phase 1 - GIS Web Foundation
Current phase

Completed

- MapLibre web map
- Basemap switching
- Navigation Controls
- Fullscreen
- Home/Full extent
- Locate user
- Scale
- Coordinates
- Layer visibility
- Point/line/polygon visualization
- Feature selection
- Feature highlighting
- Selection clearing
- Dynamic Feature Information
- IdentifyResult model
- Zoom to feature
- Copy Feature ID
- Attribute-based search

### Remaining foundation work
- Reduce domain-specific configuration inside the map core
- Establish reusable layer/data configuration
- Improve separation between GIS core and domain configuration
- Establish reusable feature interaction interfaces

## Phase 2 - Advanced GIS Interaction
### Planned capabilities include:
- Multi-feature identity results
- Spatial query and filtering
- Attribute table
- Advanced search
- Measurement tools
- Drawing and editing
- Bookmarks
- Spatial selection
- Related feature workflows
- Reusable GIS tools and widgets
- Vector tiles
- PMTiles
- Offline mapping

## Phase 3 - Backend GIS
### Planned backend capabilities:
- FastAPI
- PostGIS
- GeoServer
- OGC APIs
- Spatial queries
- Authentication
- Server-side geoprocessing
- Scalable spatial data services

## Phase 4 - Domain Applications
The reusable foundation can be extended into domain-specific workflows such as:
- Utility network and asset management
- Transportation and road infrastructure
- Urban Infrastructure
- Land and cadastral GIS
- Disaster management
- Environmental monitoring
- Natural resources
- Water resources

## Phase 5 - GeoAI and Earth Observation
### Planned capabilities:

- Satellite data processing
- Raster processing
- Cloud Optimized GeoTIFFs
- STAC
- GeoPandas
- GDAL
- Machine Learning
- GeoAI
- Spatial Intelligence
- WebGL/WebGPU acceleration

## Scalable Geospatial Platform
### Long term goals include:

- Web GIS
- Mobile GIS
- Spatial APIs
- Spatial databases
- Reusable plugins
- Domain workflows
- GeoAI
- Authentication
- Testing
- CI/CD
- Docker
- Performance optimization
- Enterprise and government-scale deployment

# Project Vision
GeoLibre India aims to provide a reusable geospatial foundation where common GIS capabilities can be developed once and reused across multiple domains

#### Instead of:
- Utility GIS application
- Transportation GIS application
- Environmental GIS application
- Cadastral GIS application

#### Long-term direction is:
                    GeoLibre Core
                         |
        +----------------+----------------+
        |                |                |
      Utility       Transportation    Environment
        |                |                |
        +----------------+----------------+
                         |
                  Shared GIS Tools
 

# Getting Started

Clone the repository:
```bash
git clone https://github.com/GeoVision-Labs/geolibre-india.git
```
Navigate into the project:
``` bash
cd geolibre-india
```
Install dependencies:
```bash
npm install
```
Start the development server:
```
npm run dev
```
Build the project:
```bash
npm run build
```

## Current Demonstration Use Case

The current prototype demonstrates a utility GIS application using a synthetic utility network around Visakhapatnam, Andhra pradesh.

The deomonstration focuses on common GIS interaction rather than representing a production utility management system.

The current workflow is:
Map
 ↓
Search / Map Click
 ↓
Feature Selection
 ↓
Highlight
 ↓
Feature Information
 ↓
Zoom to Feature / Copy ID
 
### Important Develpment Principle

GeoLibre should remain domain-aware but not domain-dependent.

The utility network is currently used to demonstrate the platform, but the reusable GIS components should progressively avoid hardcoding utility-specific assumption.

Future domain application should be able to provide their own:
- Data sources
- Layer definitions
- Attribute schemas
- Symbology
- Search fields
- Domain workflows
- Feature actions
while reusing the common GeoLibre GIS foundations.