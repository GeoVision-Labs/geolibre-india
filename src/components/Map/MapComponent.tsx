import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
 
function MapComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
 
  useEffect(() => {
    if (!mapContainer.current) return;
 
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [83.2185, 17.6868], // Visakhapatnam
      zoom: 10
    });
 
    return () => map.remove();
  }, []);
 
  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh"
      }}
    />
  );
}
 
export default MapComponent;