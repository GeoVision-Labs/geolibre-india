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
                private segmentLabels: maplibregl.Marker[] = [];

                private handleMapClick = (event: maplibregl.MapMouseEvent) => {
                        if (!this.measuring) return;

                        const point: [number, number] = [
                                event.lngLat.lng,
                                event.lngLat.lat,
                        ]
                        this.points.push(point);

                        this.updateMeasurementLine();
                        this.udpateSegmentLabels();

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
                                                "line-color": "#ff0000",
                                                "line-width": 4,
                                        },
                                });
                        }
                }

                private handleStyleLoad = () => {
                        if (!this.map) return;

                        this.map.once("idle", () => {
                                if (!this.map) return;

                                this.addMeasurementLayer();
                                const measurementLayer = this.map.getLayer("measurement-line");

                                if (measurementLayer) {
                                        this.map.moveLayer("measurement-line");
                                }

                                if (this.measuring && this.points.length >= 1) {
                                        this.updateMeasurementLine();
                                        this.udpateSegmentLabels();
                                }
                                })
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

                private udpateSegmentLabels() {
                        if(!this.map || this.points.length < 2){
                                return;
                        }

                        this.segmentLabels.forEach((label) => {
                                label.remove();
                        });

                        this.segmentLabels = [];

                        for (let i = 1; i < this.points.length; i++) {
                                const start = this.points[i -1];
                                const end = this.points[i];

                                const segmentDistance = distance(
                                        start,
                                        end,
                                        {units: "kilometers"}
                                );

                                const midLng = start[0] + (end[0] - start[0]) / 2;
                                const midLat = start[1] + (end[1] - start[1]) / 2
                                const midPoint: [number, number] = [
                                        midLng,
                                        midLat,
                                ];

                                if (
                                        !Number.isFinite(midPoint[0]) ||
                                        !Number.isFinite(midPoint[1]) ||
                                        midPoint[0] < -180 ||
                                        midPoint[0] > 180 ||
                                        midPoint[1] < -90 ||
                                        midPoint[1] > 90
                                ) {
                                        console.warn("Invalid measurement midpoint", {
                                                start,
                                                end,
                                                midPoint,
                                        });
                                        continue;
                                }

                                const element = document.createElement("div");

                                element.textContent = `${segmentDistance.toFixed(3)} km`;

                                element.style.background = "white";
                                element.style.padding = "3px 6px";
                                element.style.borderRadius = "3px";
                                element.style.fontSize = "11px";
                                element.style.whiteSpace = "nowrap";
                                element.style.pointerEvents = "none";

                                const label = new maplibregl.Marker({
                                        element,
                                        anchor: "bottom",
                                }).setLngLat(midPoint).addTo(this.map);

                                this.segmentLabels.push(label);
                        }
                }

                private clearMeasurement() {
                        this.points = [];
                        this.cursorPoint = undefined;

                        this.markers.forEach((marker) => {
                                marker.remove();
                        });

                        this.markers = [];
                        
                        if (!this.map) return;
                        
                        const source = this.map.getSource(
                                "measurement-line"
                        ) as maplibregl.GeoJSONSource | undefined;

                        if (source) { 
                                source.setData({
                                        type: "Feature",
                                        geometry: {
                                                type: "LineString",
                                                coordinates: [],
                                        },
                                        properties: {},
                                });
                        }

                        this.segmentLabels.forEach((label) => {
                                label.remove();
                        })

                        this.segmentLabels = [];

                        if (this.distanceElement) {
                                this.distanceElement.textContent = "Distance: 0.000 km";
                        }
                }

                onAdd(map: maplibregl.Map) {
                        this.map = map;
                
                        map.on("style.load", this.handleStyleLoad);
                
                        if (map.isStyleLoaded()) {
                                this.addMeasurementLayer();
                        } else {
                                map.once("load", () => {
                                        this.addMeasurementLayer();
                                });
                        }
                
                        // Main control container
                        const container = document.createElement("div");
                        container.className = "maplibregl-ctrl";
                
                        container.style.position = "relative";
                
                        // Main measurement button
                        const button = document.createElement("button");
                
                        button.type = "button";
                        button.title = "Measurement";
                        button.setAttribute("aria-label", "Measurement");
                
                        button.style.width = "30px";
                        button.style.height = "30px";
                        button.style.display = "flex";
                        button.style.alignItems = "center";
                        button.style.justifyContent = "center";
                        button.style.cursor = "pointer";
                
                        // Simple ruler SVG icon
                        button.innerHTML = `
                                <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                >
                                        <path d="M3 21L21 3" />
                                        <path d="M7 17l2 2" />
                                        <path d="M10 14l2 2" />
                                        <path d="M13 11l2 2" />
                                        <path d="M16 8l2 2" />
                                </svg>
                        `;
                
                        // Measurement menu
                        const menu = document.createElement("div");
                
                        menu.style.display = "none";
                        menu.style.position = "absolute";
                        menu.style.right = "0";
                        menu.style.top = "36px";
                        menu.style.background = "white";
                        menu.style.borderRadius = "6px";
                        menu.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
                        menu.style.padding = "6px";
                        menu.style.minWidth = "150px";
                        menu.style.zIndex = "1000";
                
                        // Menu title
                        const title = document.createElement("div");
                
                        title.textContent = "Measurement";
                
                        title.style.fontSize = "12px";
                        title.style.fontWeight = "600";
                        title.style.padding = "6px 8px";
                        title.style.color = "#555";
                
                        // Distance button
                        const distanceButton = document.createElement("button");
                
                        distanceButton.type = "button";
                        distanceButton.textContent = "📏  Distance";
                
                        distanceButton.style.display = "block";
                        distanceButton.style.width = "100%";
                        distanceButton.style.padding = "8px";
                        distanceButton.style.border = "none";
                        distanceButton.style.background = "transparent";
                        distanceButton.style.textAlign = "left";
                        distanceButton.style.cursor = "pointer";
                        distanceButton.style.borderRadius = "4px";
                
                        distanceButton.onmouseenter = () => {
                                distanceButton.style.background = "#f2f2f2";
                        };
                
                        distanceButton.onmouseleave = () => {
                                distanceButton.style.background = "transparent";
                        };
                
                        // Future area button
                        const areaButton = document.createElement("button");
                
                        areaButton.type = "button";
                        areaButton.textContent = "⬡  Area";
                
                        areaButton.disabled = true;
                
                        areaButton.style.display = "block";
                        areaButton.style.width = "100%";
                        areaButton.style.padding = "8px";
                        areaButton.style.border = "none";
                        areaButton.style.background = "transparent";
                        areaButton.style.textAlign = "left";
                        areaButton.style.color = "#999";
                        areaButton.style.cursor = "not-allowed";

                        // Clear button
                        const clearButton = document.createElement("button");
                        clearButton.textContent = "Clear";
                        clearButton.type = "button";

                        //Close button
                        const closeButton = document.createElement("button");
                        closeButton.textContent = "Close";
                        closeButton.type = "button";

                        menu.appendChild(clearButton);
                        menu.appendChild(closeButton);

                        clearButton.onclick = () => {
                                this.clearMeasurement();

                                this.points = [];
                                this.cursorPoint = undefined;

                                menu.style.display = "none";

                                distanceElement.style.display = "block";

                                if(this.measuring) {
                                        this.map?.getCanvas().style.setProperty(
                                                "cursor",
                                                "crosshair"
                                        );
                                }
                        };

                        closeButton.onclick = () => {
                                this.measuring = false;

                                this.clearMeasurement();

                                this.points = [];
                                this.cursorPoint = undefined;

                                this.map?.off("click", 
                                        this.handleMapClick
                                );

                                this.map?.off("mousemove",
                                        this.handleMouseMove
                                );

                                this.map?.getCanvas().style.setProperty("cursor", "");

                                menu.style.display = "nonw";

                                distanceElement.style.display = "block";
                        }
                
                        // Distance display
                        const distanceElement = document.createElement("div");
                
                        distanceElement.style.display = "none";
                        distanceElement.style.background = "white";
                        distanceElement.style.padding = "6px 10px";
                        distanceElement.style.marginTop = "5px";
                        distanceElement.style.borderRadius = "4px";
                        distanceElement.style.fontSize = "13px";
                        distanceElement.style.whiteSpace = "nowrap";
                
                        distanceElement.textContent = "Distance: 0.000 km";
                
                        this.distanceElement = distanceElement;
                
                        // Open / close measurement menu
                        button.onclick = () => {
                                menu.style.display =
                                        menu.style.display === "none"
                                                ? "block"
                                                : "none";
                        };
                
                        // Start distance measurement
                        distanceButton.onclick = () => {
                                this.measuring = true;
                                this.points = [];
                                this.cursorPoint = undefined;

                                this.clearMeasurement();
                
                                menu.style.display = "none";
                
                                distanceElement.style.display = "block";
                
                                this.map?.getCanvas().style.setProperty(
                                        "cursor",
                                        "crosshair",
                                );
                
                                this.map?.on("click", this.handleMapClick);
                                this.map?.on("mousemove", this.handleMouseMove);
                        };
                
                        // Build menu
                        menu.appendChild(title);
                        menu.appendChild(distanceButton);
                        menu.appendChild(areaButton);
                
                        container.appendChild(button);
                        container.appendChild(menu);
                        container.appendChild(distanceElement);
                
                        this.container = container;
                
                        return container;
                }


                // onAdd( map: maplibregl.Map) {
                //         this.map = map;

                //         map.on("style.load", this.handleStyleLoad);

                //         if (map.isStyleLoaded()) {
                //                 this.addMeasurementLayer();
                //         } else {
                //                 map.once("load", () => {
                //                         this.addMeasurementLayer();
                //                 });
                //         }

                //         const container = document.createElement("div");
                //         container.className = "maplibregl-ctrl maplibregl-ctrl-group";
                //         const button = document.createElement("button");
                //         button.type = "button";
                //         button.title = "Measure distance";
                //         button.setAttribute("aria-label", "Measure distance");
                //         button.textContent = "M";
                //         button.onclick = () => {
                //                 this.measuring = !this.measuring;
                //                 if (this.measuring) {
                //                         this.points = [];
                //                         button.textContent = "X"
                //                         this.map?.getCanvas().style.setProperty(
                //                                 "cursor",
                //                                 "crosshair",
                //                         );
                //                         this.map?.on("click", this.handleMapClick);
                //                         this.map?.on("mousemove", this.handleMouseMove);
                //                 } else {
                //                         this.map?.getCanvas().style.setProperty(
                //                                 "cursor",
                //                                 "",
                //                         );
                //                         button.textContent = "M";
                //                         this.map?.off("click", this.handleMapClick);
                //                         this.clearMeasurement();
                                        
                //                         if(this.distanceElement) {
                //                                 this.distanceElement.textContent = "Distance: 0.000 km";
                //                         }
                //                         this.map?.off("mousemove", this.handleMouseMove);
                //                         this.cursorPoint = undefined;
                //                 }
                //         }
                        
                //         const distanceElement = document.createElement("div");

                //         distanceElement.style.background = "white";
                //         distanceElement.style.padding = "6px 10px";
                //         distanceElement.style.marginTop = "5px";
                //         distanceElement.style.borderRadius = "4px";
                //         distanceElement.style.fontSize = "13px";
                //         distanceElement.textContent = "Distance: 0.000 km";

                //         this.distanceElement = distanceElement;

                //         container.appendChild(button);
                //         container.appendChild(distanceElement);

                //         this.container = container;

                //         return container
                // }

                onRemove() {
                        if (this.map) {
                                this.map.off("style.load", this.handleStyleLoad);
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