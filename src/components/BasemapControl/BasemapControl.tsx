import type * as maplibregl from "maplibre-gl";

type BasemapControlProps = {
        map: maplibregl.Map | null;
};

const basemaps = {
        Liberty: "https://tiles.openfreemap.org/styles/liberty",
        Positron: "https://tiles.openfreemap.org/styles/positron",
        Dark: "https://tiles.openfreemap.org/styles/dark",
        Light: "https://tiles.openfreemap.org/styles/light",
};

function BasemapControl({map}: BasemapControlProps) {
        
        const changeBasemap = (styleUrl: string) => {
                if (!map) return;
                map.setStyle(styleUrl);
        };

        return (
                <div style={{
                        position: "absolute",
                        top: "150px",
                        left: "10px",
                        zIndex: 10,
                        background: "white",
                        padding: "10px",
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgbz(0,0,0,0.25)",
                        fontFamily: "Arial",
                }}>
                        <strong>Select Basemap</strong>
                        {Object.entries(basemaps).map(([name, url]) => (
                                <button key={name} onClick={() => {
                                        changeBasemap(url)
                                }} style={{
                                        display: "block",
                                        width: "100%",
                                        marginTop: "6px",
                                        padding: "5px 8px",
                                        cursor: "pointer",
                                }}>
                                        {name}
                                </button>
                        ))}
                </div>
        )
}

export default BasemapControl;