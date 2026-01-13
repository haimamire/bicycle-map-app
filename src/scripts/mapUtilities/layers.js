import defaultViewImg from "../../img/map-ui/default-view.png";
import satelliteViewImg from "../../img/map-ui/satellite-view.jpeg";

export function addLayers(MAP) {
  const OpenStreetMap_CAT = L.tileLayer(
    "https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png",
    {
      maxZoom: 25,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      detectRetina: true,
    }
  );

  const CartoDB_VoyagerNoLabels = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }
  );

  const bikeLanesLayer = L.tileLayer(
    "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm-lite/{z}/{x}/{y}.png",
    {
      maxZoom: 25,
      detectRetina: true,
      className: "bike-lanes-layer",
    }
  );

  const satelliteLayer = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    {
      maxZoom: 25,
      attribution: "Google Maps",
      detectRetina: true,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );
  MAP.addLayer(CartoDB_VoyagerNoLabels);
  // MAP.addLayer(OpenStreetMap_CAT);
  MAP.addLayer(bikeLanesLayer);

  // Layer control
  const baseMaps = {
    [`<img class="layer-control-image" src="${defaultViewImg}" width="200px" draggable="false">`]:
      // OpenStreetMap_CAT,
      CartoDB_VoyagerNoLabels,
    [`<img class="layer-control-image" src="${satelliteViewImg}" width="200px" draggable="false">`]:
      satelliteLayer,
  };
  const overlayMaps = {
    lanes: bikeLanesLayer,
  };

  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
      position: "bottomright",
    })
    .addTo(MAP);
}
