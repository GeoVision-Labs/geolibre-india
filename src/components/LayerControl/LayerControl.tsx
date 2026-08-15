import { useState } from "react";
import type maplibregl from 'maplibre-gl';

interface LayerControlProps {
        map:maplibregl.Map | null;
}

function LayerControl({map}: LayerControlProps) {
        const [layers, setLayers] = useState({
                points: true,
                lines: true,
                polygons: true,
        });

        const toggleLayer = (
                layerId: string,
                key: "points" | "lines" | "polygons",
        ) => {
                if (!map) return;

                const newVisibility = layers[key] ? "none": "visible";

                map.setLayoutProperty(
                        layerId,
                        "visibility",
                        newVisibility
                );
                setLayers((previous) => ({
                        ...previous,
                        [key]: !previous[key],
                }));
        };

        return (
                <div
                        style={{
                                position: "absolute",
                                top: "10px",
                                left: "10px",
                                zIndex: 10,
                                background: "white",
                                padding: "12px",
                                borderRadius: "6px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                                fontFamily: "Arial",
                        }}
                >
                        <strong>Layers</strong>

                        <label 
                                style={{
                                        display: "block",
                                        marginTop: "10px",
                                }}
                        >
                                <input 
                                        type="checkbox"
                                        checked={layers.points}
                                        onChange={()=>toggleLayer("utility-points", "points")}
                                />
                                {" "} Utility Points
                        </label>
                        <label 
                                style={{
                                        display: "block",
                                        marginTop: "10px",
                                }}
                        >
                                <input 
                                        type="checkbox"
                                        checked={layers.lines}
                                        onChange={()=>toggleLayer("power-lines", "lines")}
                                />
                                {" "}Utility Lines
                        </label>
                        <label style={{
                                display: "block",
                                marginTop: "8px"
                        }}>
                                <input 
                                        type="checkbox"
                                        checked={layers.polygons}
                                        onChange={()=>toggleLayer("service-areas", "polygons")}
                                />
                                {" "}Service Areas
                        </label>
                </div>
        )

};

export default LayerControl;