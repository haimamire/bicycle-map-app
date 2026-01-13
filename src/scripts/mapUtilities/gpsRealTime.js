export function initGPS(map) {
  const location = L.control
    .locate({
      position: "bottomright",
      clickBehavior: {
        inView: "setView",
        inViewNotFollowing: "setView",
        outOfView: "setView",
      },
      keepCurrentZoomLevel: true,
      showPopup: false,
    })
    .addTo(map);

  location.start();

  let lat;
  let lon;

  function update(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    window.currentLat = lat;
    window.currentLng = lon;
  }

  const watchId = navigator.geolocation.watchPosition(
    update,
    (err) => console.log("Geolocation error:", err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000,
    }
  );
}
