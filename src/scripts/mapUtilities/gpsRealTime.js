/* eslint-disable no-undef */
export function initGPS(map) {
  L.control
    .locate({
      position: 'bottomright',
      clickBehavior: {
        inView: 'setView',
        inViewNotFollowing: 'setView',
        outOfView: 'setView',
      },
      keepCurrentZoomLevel: true,
      showPopup: false,
      markerStyle: {
        className: 'leaflet-control-locate-marker',
        color: '#fff',
        fillColor: '#2A93EE',
        fillOpacity: 1,
        weight: 3,
        opacity: 1,
        radius: 11,
      },
      compassStyle: {
        fillColor: '#2A93EE',
        fillOpacity: 1,
        weight: 0,
        color: '#fff',
        opacity: 1,
        radius: 13, // How far is the arrow from the center of the marker
        width: 12, // Width of the arrow
        depth: 12, // Length of the arrow
      },
    })
    .addTo(map);

  let lat;
  let lon;

  function update(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    window.currentLat = lat;
    window.currentLng = lon;
  }

  // eslint-disable-next-line no-unused-vars
  const watchId = navigator.geolocation.watchPosition(
    update,
    (err) => console.log('Geolocation error:', err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000,
    },
  );
}
