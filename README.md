> Geolibre India

# Open-source geospatial platform for building scalable GIS applications across India.

## Overview

Geolibre India is a modern GIS platform developed using React, TypeScript, and MapLibre GL. It provides a reusable foundation for building geospatial applications across utilities, infrastructure, environment, disaster management, natural resources, and GeoAI.

## Current Features
- Interactive web mapping
- Point, line, and polygon visualization
- Feature selection and highlighting
- Feature information panel
- Layer visibility control
- Attribute-based search
- GeoJSON data support

## Technology Stack
- React
- TypeScript
- MapLibre GL JS
- Vite
- GeoJSON
- HTML/CSS
- Git & GitHub

## Architecture

React + TypeScript
        |
   MapLibre GL
        |
   GeoJSON Data
        |
+-------+-------+
|       |       |
Point  Line  Polygon
        |
Feature Selection
        |
Feature Information


# Roadmap
## Phase 1: GIS Foundation
- Web GIS application
- GeoJSON layers
- Search and layer controls

## Phase 2: Advanced GIS
- Vector Tiles & PMTiles
- Drawing and editing tools
- Measurement and offline mapping

## Phase 3: Backend GIS
- FastAPI
- PostGIS
- GeoServer
- OGC APIs

## Phase 4: Domain Solutions
- Utility GIS
- Urban Infrastructure
- Disaster Management
- Land & Asset Management

## Phase 5: GeoAI & Scalability
- Satellite data processing
- GeoAI and Machine Learning
- Docker and CI/CD

## Vision

Build a reusable open-source geospatial foundation that supports multiple GIS domains instead of creating separate applications for each use case.

## Status

🚧 Active Development

The project is currently in the GIS Web Foundation stage and is evolving toward a full-scale open geospatial platform for India.

# Getting Started
Clone the repository and install the required dependencies:
git clone 

cd geolibre-india

npm install

## Run the application

Start the development server:
npm run dev

The application will be available at the local development URL provided by vite.

## Current Use case
The current application demonstrates an interactive utility GIS workflow using a sample utility network around Visakhapatnam, Andhrapradesh.
The application currently visualises utility points, power lines, and service areas, with capabilities for layer control, feature selection, feature highlighting, feature information, and attribute-based asset search.

## Repository structure

geolibra-india/
|____src/
|     |___components/
|     |   |___Map/
|     |   |___Search/
|     |   |___LayerControl/
|     |   |___FeatureInfo/
|     |
|     |___data/
|     |___App.tsx
|     |___main.tsx
|
|___public/
|___package.json
|___vite.config.ts
|___tsconfig.json
|___README.md


## Future Applications

Planned application and capabilities include:
- Utility netowrk and asset management
- Natural resources management
- Waterbody and enviroment monitoring
- Disaster management and emergency response
- Land and cadastral GIS
- Satellite and Earth observation analysis
- GeoAI-powered spatial intelligence

