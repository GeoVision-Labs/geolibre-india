import MapComponent from "./components/Map/MapComponent";
import { useState } from "react";
import FeatureInfo from "./components/FeatureInfo/FeatureInfo";
import LayerControl from "./components/LayerControl/LayerControl";
import type * as maplibregl from "maplibre-gl";
import Search from "./components/Search/Search";
import BasemapControl from "./components/BasemapControl/BasemapControl";
import type { IdentifyResult } from "./types/IdentifyResult";

function App() {
        const [selectedFeature, setSelectedFeature] = useState<IdentifyResult | null>(null);

        const [map, setMap] = useState<maplibregl.Map | null>(null);
        const [searchValue, setSearchValue] = useState("");
        const [clearMapSelection, setClearMapSelection] = useState<(() => void) | null>(null);
        const [zoomToFeature, setZoomToFeature] = useState<(() => void) | null>(null);

        const handleSearch = (value: string) => {
                console.log("Searching for: ", value);
                setSearchValue(value);
        }

        return (
                <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
                        <MapComponent 
                        onFeatureSelect={setSelectedFeature} 
                        onMapReady={setMap} 
                        searchValue={searchValue} 
                        onClearSelection={(clearFn) => setClearMapSelection(() => clearFn)}
                        onZoomToFeature={(zoomFn) => setZoomToFeature(() => zoomFn)}
                 />
                        {selectedFeature && (<FeatureInfo feature={selectedFeature} onClose={
                                () => {
                                        clearMapSelection?.();
                                        setSelectedFeature(null);
                                }
                        } onZoomToFeature={() => {
                                zoomToFeature?.();
                        }} />)}
                        <LayerControl map={map} />
                        <Search onSearch={handleSearch} />
                        <BasemapControl map={map} />
                </div>
        )
}

export default App;