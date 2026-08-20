import MapComponent from "./components/Map/MapComponent";
import { useState } from "react";
import FeatureInfo from "./components/FeatureInfo/FeatureInfo";
import LayerControl from "./components/LayerControl/LayerControl";
import type * as maplibregl from "maplibre-gl";
import Search from "./components/Search/Search";
import BasemapControl from "./components/BasemapControl/BasemapControl";
import type { IdentifyResult } from "./types/IdentifyResult";
import IdentifyResults from "./components/IdentifyResults/IdentifyResult";

function App() {

        const [selectedFeature, setSelectedFeature] = useState<IdentifyResult | null>(null);
        const [map, setMap] = useState<maplibregl.Map | null>(null);
        const [searchValue, setSearchValue] = useState("");
        const [clearMapSelection, setClearMapSelection] = useState<(() => void) | null>(null);
        const [zoomToFeature, setZoomToFeature] = useState<(() => void) | null>(null);
        const [ selectMapFeature, setSelectMapFeature ] = useState<((feature: IdentifyResult) => void) | null>(null);
        const [identifyResults, setIdentifyResults] = useState<IdentifyResult[]>([]);
        const [hoveredFeature, setHoveredFeature] = useState<IdentifyResult | null>(null);

        const handleSearch = (value: string) => {
                console.log("Searching for: ", value);
                setSearchValue(value);
        }

        const copyFeatureId = async () => {
                if(!selectedFeature) return;

                try {
                        await
                        navigator.clipboard.writeText(String(selectedFeature.id));
                        console.log("Feature ID copied: ", selectedFeature.id);
                } catch (error) {
                        console.error("Failed to copy feature ID: ", error);
                }
        }

        return (
                <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
                        <MapComponent 
                                onFeatureSelect={(feature) => {
                                        setSelectedFeature(feature);
                                        setIdentifyResults([]);
                                        setHoveredFeature(null);
                                }}
                                onMapReady={setMap} 
                                searchValue={searchValue} 
                                onClearSelection={(clearFn) => setClearMapSelection(() => clearFn)}
                                onZoomToFeature={(zoomFn) => setZoomToFeature(() => zoomFn)}
                                onIdentifyResults={setIdentifyResults}
                                hoveredFeature={hoveredFeature}
                                onSelectFeature={(selectFn) => 
                                        setSelectMapFeature(() => selectFn)
                                }
                        />
                        {identifyResults.length > 1 && (
                                <IdentifyResults 
                                        results={identifyResults}
                                        onSelect={(feature) =>{
                                                selectMapFeature?.(feature);
                                                setIdentifyResults([]);
                                                setHoveredFeature(null);
                                        }}
                                        onHover={(feature) => {
                                                setHoveredFeature(feature);
                                        }}
                                        onHoverEnd={() => {
                                                setHoveredFeature(null);
                                        }}
                                        onClose={() => {
                                                setIdentifyResults([]);
                                                setHoveredFeature(null);
                                        }}
                                />
                        )}
                        {selectedFeature && (
                                <FeatureInfo feature={selectedFeature} onClose={
                                        () => {
                                                clearMapSelection?.();
                                                setSelectedFeature(null);
                                        }
                                        } onZoomToFeature={() => {
                                                zoomToFeature?.();
                                        }} onCopyfeatureId={copyFeatureId}
                                        />)
                        }
                        <LayerControl map={map} />
                        <Search onSearch={handleSearch} />
                        <BasemapControl map={map} />
                </div>
        )
}

export default App;