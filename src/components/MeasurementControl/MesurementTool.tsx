import * as maplibregl from 'maplibre-gl';
import { distance } from "@turf/distance";

export default class MesurementTool
        implements maplibregl.IControl {

                private container?: HTMLDivElement;
                private distanceElement?: HTMLDivElement;
                private map?: maplibregl.Map;
                private cursorPoint?: [number, number];
                private measuring = false;
                private points: [number, number][] = [];
                private markers: maplibregl.Marker[] = [];

                private handleMapClick = (event: maplibregl.MapMouseEvent) => {
                        if (!this.measuring) return;

                        const point: [number, number] = [
                                event.lngLat.lng,
                                event.lngLat.lat,
                        ]
                        this.points.push(point);

                        this.updateMeasurementLine();

                        const totalDistance = this.calculateTotalDistance();
                        if(this.distanceElement) {
                                this.distanceElement.textContent = 
                                        `Distance: ${totalDistance.toFixed(3)} km`;
                        }

                        const marker = new maplibregl.Marker()
                                .setLngLat(point)
                                .addTo(this.map!);
                        this.markers.push(marker);
                }

                private handleMouseMove = (event: maplibregl.MapMouseEvent) => {
                        if (!this.measuring || this.points.length === 0) {
                                return;
                        }

                        this.cursorPoint = [
                                event.lngLat.lng,
                                event.lngLat.lat,
                        ];

                        this.updateMeasurementLine();
                }

                private updateMeasurementLine() {
                        if(!this.map || !this.points.length) {
                                return;
                        }

                        const coordinates = [...this.points];

                        if(this.cursorPoint) {
                                coordinates.push(this.cursorPoint);
                        }

                        const source = this.map.getSource(
                                "measurement-line"
                        ) as maplibregl.GeoJSONSource | undefined;

                        if(!source) return;

                        source.setData({
                                type: "Feature",
                                geometry: {
                                        type: "LineString",
                                        coordinates,
                                },
                                properties: {},
                        });
                }

                private addMeasurementLayer() {
                        if(!this.map) return;

                        if(!this.map.isStyleLoaded()) {
                                return;
                        }

                        if (!this.map.getSource("measurement-line")) {
                                this.map.addSource("measurement-line", {
                                        type: "geojson",
                                        data: {
                                                type: "Feature",
                                                geometry: {
                                                        type: "LineString",
                                                        coordinates: [],
                                                },
                                                properties: {},
                                        },
                                });
                        }

                        if (!this.map.getLayer("measurement-line")) {
                                this.map.addLayer({
                                        id: "measurement-line",
                                        type: "line",
                                        source: "measurement-line",
                                        paint: {
                                                "line-width": 3,
                                        },
                                });
                        }
                }

                private calculateTotalDistance(): number {
                        if(this.points.length < 2) {
                                return 0;
                        }

                        let total = 0;

                        for (let i = 1; i < this.points.length; i++) {
                                total += distance(
                                        this.points[i - 1],
                                        this.points[i],
                                        {units: "kilometers"}
                                );
                        }

                        return total;
                }

                private clearMeasurement() {
                        this.points = [];

                        if (!this.map) return;

                        const source = this.map.getSource(
                                "measurement-line"
                        ) as maplibregl.GeoJSONSource | undefined;

                        if(!source) return;

                        source.setData({
                                type: "Feature",
                                geometry: {
                                        type: "LineString",
                                        coordinates: [],
                                },
                                properties: {},
                        });

                        this.markers.forEach((marker) => {
                                marker.remove();
                        });

                        this.markers = [];
                }

                onAdd( map: maplibregl.Map) {
                        this.map = map;

                        if (map.isStyleLoaded()) {
                                this.addMeasurementLayer();
                        } else {
                                map.once("load", () => {
                                        this.addMeasurementLayer();
                                });
                        }

                        const container = document.createElement("div");
                        container.className = "maplibregl-ctrl maplibregl-ctrl-group";
                        const button = document.createElement("button");
                        button.type = "button";
                        button.title = "Measure distance";
                        button.setAttribute("aria-label", "Measure distance");
                        button.textContent = "M";
                        button.onclick = () => {
                                this.measuring = !this.measuring;
                                if (this.measuring) {
                                        this.points = [];
                                        button.textContent = "X"
                                        this.map?.getCanvas().style.setProperty(
                                                "cursor",
                                                "crosshair",
                                        );
                                        this.map?.on("click", this.handleMapClick);
                                        this.map?.on("mousemove", this.handleMouseMove);
                                } else {
                                        this.map?.getCanvas().style.setProperty(
                                                "cursor",
                                                "",
                                        );
                                        button.textContent = "M";
                                        this.map?.off("click", this.handleMapClick);
                                        this.clearMeasurement();
                                        
                                        if(this.distanceElement) {
                                                this.distanceElement.textContent = "Distance: 0.000 km";
                                        }
                                        this.map?.off("mousemove", this.handleMouseMove);
                                        this.cursorPoint = undefined;
                                }
                        }
                        
                        const distanceElement = document.createElement("div");

                        distanceElement.style.background = "white";
                        distanceElement.style.padding = "6px 10px";
                        distanceElement.style.marginTop = "5px";
                        distanceElement.style.borderRadius = "4px";
                        distanceElement.style.fontSize = "13px";
                        distanceElement.textContent = "Distance: 0.000 km";

                        this.distanceElement = distanceElement;

                        container.appendChild(button);
                        container.appendChild(distanceElement);

                        this.container = container;

                        return container
                }

                onRemove() {
                        if (this.map) {
                                this.map.off("click", this.handleMapClick);
                        
                                // remove measurement-line layer
                                if(this.map.getLayer("measurement-line")) {
                                        this.map.removeLayer("measurement-line");
                                }
                                if(this.map.getSource("measurement-line")) {
                                        this.map.removeSource("measurement-line");
                                }
                                this.map.getCanvas().style.setProperty(
                                        "cursor",
                                        "",
                                );
                        }
                        this.container?.remove();

                        this.container = undefined;
                        this.map = undefined;
                        this.points = [];
                        this.measuring = false;
                }
        }