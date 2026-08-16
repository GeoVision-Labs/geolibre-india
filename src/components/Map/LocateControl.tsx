import * as maplibregl from "maplibre-gl";
import locate from "/locate.svg";

class LocateControl implements
maplibregl.IControl {
        private map!: maplibregl.Map;
        private marker?: maplibregl.Marker;

        onAdd(map:maplibregl.Map) {
                this.map = map;

                const container = document.createElement("div");
                container.className = "maplibregl-ctrl maplibregl-ctrl-group";

                const icon = document.createElement("img");
		icon.src = locate;
		icon.alt = "Icon";
		icon.style.width = "20px";

                const button = document.createElement("button");
                button.type = "button";
                button.title = "Locate me";
                button.setAttribute("aria-label", "Locate me");
                button.appendChild(icon);

                button.onclick = () => {
                        if (!this.map) return;

                        if (!navigator.geolocation) {
                                console.error("Geolocation is not supported by this browser.");
                                return;
                        }
                        button.disabled = true;

                        navigator.geolocation.getCurrentPosition(
                                (position) => {
                                        const {latitude, longitude} = position.coords;
                                        if (this.marker) {
                                                this.marker.remove();
                                        }
                                        this.marker = new maplibregl.Marker()
                                        .setLngLat([longitude, latitude])
                                        .addTo(this.map);

                                        this.map!.flyTo({
                                                center: [longitude, latitude],
                                                 zoom: 15,
                                                duration: 1000,
                                        });
                                        button.disabled = false;
                                },
                                (error) => {
                                        console.error("Unable to get current location", error);
                                        button.disabled = false;
                                },
                                {
                                        enableHighAccuracy: true,
                                        timeout: 10000,
                                        maximumAge: 0,
                                }
                        );
                };
                container.appendChild(button);
                return container;
        }
        onRemove() {
                this.marker?.remove();
                this.marker = undefined;
        }
}

export default LocateControl;