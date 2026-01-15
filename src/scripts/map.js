/* eslint-disable no-undef */
import '../styles/styles.css';
import '../styles/map.css';
import '../styles/mapstyles.css';
import '../styles/map_elements/MarkerCluster.css';
import '../styles/map_elements/MarkerCluster.Default.css';

import { addLayers } from './mapUtilities/layers';
import { addMarkers } from './mapUtilities/points';
import { addUserMarker } from './mapUtilities/userMarker';
import { initGPS } from './mapUtilities/gpsRealTime';
import { getSearch } from './mapUtilities/search';

document.addEventListener('DOMContentLoaded', () => {
  const config = {
    minZoom: 2,
    maxZoom: 19,
    zoomControl: false,
    zoomSnap: 0.5,
    doubleClickZoom: false,
  };

  const lat = 34.98493616431302;
  const lng = 135.75248977767515;
  const initialZoom = 15;

  const map = L.map('map', config).setView([lat, lng], initialZoom);

  // This adds all of the lines we are gonna use for the routes and cycle lanes
  addLayers(map);
  addMarkers(map);
  addUserMarker(map);
  initGPS(map);
  getSearch(map);

  // This removes the context menu for all the images
  document.querySelectorAll('img').forEach((img) => {
    img.style.userSelect = 'none';
    img.style.webkitTouchCallout = 'none';
    img.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
      return false;
    });
  });
});
