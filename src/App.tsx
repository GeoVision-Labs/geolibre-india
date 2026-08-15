import MapComponent from "./components/Map/MapComponent";
import { useState } from "react";
import FeatureInfo from "./components/FeatureInfo/FeatureInfo";
import LayerControl from "./components/LayerControl/LayerControl";
import type maplibregl from "maplibre-gl";
import Search from "./components/Search/Search";

function App() {
        const [selectedFeature, setSelectedFeature] = useState<{
                assetType?: string;
                assetId?: string;
                status?: string
        } | null>(null);

        const [map, setMap] = useState<maplibregl.Map | null>(null);
        const [searchValue, setSearchValue] = useState("");

        const handleSearch = (value: string) => {
                console.log("Searching for: ", value);
                setSearchValue(value);
        }

        return (
                <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
                        <MapComponent onFeatureSelect={setSelectedFeature} onMapReady={setMap} searchValue={searchValue} />
                        {selectedFeature && (<FeatureInfo feature={selectedFeature} />)}
                        <LayerControl map={map} />
                        <Search onSearch={handleSearch} />
                </div>
        )
}

export default App;