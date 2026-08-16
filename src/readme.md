# GeoLibre India — Current Development Notes
 
## Overview
 
GeoLibre India is a web-based GIS application built with React, TypeScript, MapLibre GL JS, Vite, and GeoJSON.
 
The current prototype uses a synthetic utility network dataset to demonstrate common GIS mapping and feature interaction capabilities.
 
---
 
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
 
---
 
## Current Map Capabilities
 
The application currently provides:
 
- Interactive MapLibre map
- Basemap switching
- Zoom in / zoom out
- Map rotation
- Compass control
- Fullscreen control
- Home / full extent control
- Locate user control
- Scale display
- Coordinate display
 
---
 
## Current Layer Capabilities
 
The application currently supports:
 
- GeoJSON data source
- Point features
- Line features
- Polygon features
- Layer visibility control
- Basemap control
 
The current demonstration data is a synthetic utility network.
 
---
 
## Feature Selection
 
Features can be selected directly from the map.
 
Supported geometry types:
 
- Point
- LineString
- Polygon
 
When a feature is selected:
 
1. The selected feature is highlighted.
2. The previous selection is cleared.
3. The Feature Information panel is displayed.
4. The selected feature information is shown.
 
Feature highlighting uses MapLibre feature state.
 
---
 
## Selection Behaviour
 
The current selection behaviour is:
 
```text
Click Feature A
      ↓
Feature A highlighted
      ↓
Click Feature B
      ↓
Feature A highlight removed
      ↓
Feature B highlighted
      ↓
Feature Information updated
```

## Feature Information
 
The Feature Information panel dynamically displays information for the selected feature.
 
The panel currently provides:
 
- Feature ID
- Geometry type
- Layer ID
- Feature attributes
 
Attributes are generated dynamically from the selected feature properties rather than being limited to a fixed number of fields.
 
---
 
## IdentifyResult
 
The application uses an `IdentifyResult` type to represent the selected feature.
 
Current structure:
 
```ts
{
  id,
  geometryType,
  layerId,
  properties
}
```

The model separates feature metadata from the feature's domain attributes.

## Feature Actions
The Feature Information panel currently provides the following actions.

### Zoom to Feature

The application supports zooming to the selected feature.

The behaviour depends on the geometry type:

```text 
Point
  ↓
MapLibre flyTo()
 
LineString / Polygon
  ↓
Calculate bounding box
  ↓
MapLibre fitBounds()
```

Copy Feature ID
The Feature Information panel provides a Copy ID action.
The selected feature ID is copied to the system clipboard.

## Search
 
The application currently provides feature search using the utility dataset.
 
The current search workflow is:
 
```text
Search
   ↓
Find Feature
   ↓
Highlight Feature
   ↓
Zoom to Feature
   ↓
Feature Information
```

Search results are presented as feature IDs.


### Current Utility Dataset
The current prototype uses a synthetic utility network dataset.
The dataset contains multiple geometry types:
```text
Point
LineString
Polygon
```

The prototype contains realistic-style attributes for demonstrating GIS feature interaction.
Example feature categories include:
- Substations
- Distribution transformers
- Poles
- Switches
- Smart meters
- Power lines
- Feeders
- Service areas

The dataset is synthetic and is intended for application development and demonstration.

## Current Application Workflow
 
The current feature interaction workflow is:
 
```text
Map
  ↓
Search or Map Click
  ↓
Feature Selection
  ↓
Feature Highlight
  ↓
IdentifyResult
  ↓
Feature Information
  ↓
+-------------------+
|                   |
v                   v
Zoom to Feature   Copy Feature ID
```
The application supports the same feature information workflow for:
Point features
Line features
Polygon features

## Current Component Structure
 
```text
src/
|
|-- components/
|   |
|   |-- BasemapControl/
|   |   |-- BasemapControl.tsx
|   |
|   |-- FeatureInfo/
|   |   |-- FeatureInfo.tsx
|   |
|   |-- LayerControl/
|   |   |-- LayerControl.tsx
|   |
|   |-- Map/
|   |   |-- MapComponent.tsx
|   |   |-- LocateControl.tsx
|   |
|   |-- Search/
|       |-- Search.tsx
|
|-- data/
|   |-- utility-network.json
|
|-- types/
|   |-- IdentifyResult.ts
|
|-- App.tsx
|-- main.tsx
|-- global.css
```
## Current Architecture
```text
                         GeoLibre India
                               |
                               v
                       React + TypeScript
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
        MapComponent        Search        LayerControl
              |
              v
        MapLibre GL JS
              |
              v
       GeoJSON Data Source
              |
       +------+------+
       |             |
     Point         Line / Polygon
       |             |
       +------+------+
              |
              v
      Feature Selection
              |
              v
       IdentifyResult
              |
       +------+------+
       |             |
       v             v
Feature Information  Feature Actions
                     |
                +----+----+
                |         |
                v         v
             Zoom To   Copy ID
```

## Current Development Status

### Phase 1 — GIS Web Foundation

The current implementation provides a functional GIS web application with:
- Interactive MapLibre map
- Basemap switching
- Map navigation
- Fullscreen control
- Home / full extent control
- Locate control
- Scale display
- Coordinate display
- Layer visibility control
- Point, line, and polygon visualization
- Feature selection
- Feature highlighting
- Selection clearing
- Dynamic Feature Information
- Feature ID, geometry type, and layer information
- Dynamic feature attributes
- IdentifyResult model
- Feature search
- Zoom to feature
- Copy Feature ID

This document describes the current implemented state of the application.