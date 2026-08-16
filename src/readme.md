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