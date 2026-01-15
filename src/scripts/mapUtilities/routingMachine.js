/* eslint-disable new-cap */
/* eslint-disable no-undef */
import 'leaflet-routing-machine';
import { playAudioDirection } from './audioInstructions';

import icon from '../../img/map-ui/user-marker.png';

let routeInterval = null;
let lastLat = null;
let lastLng = null;

export function drawRoute(map, destinationLat, destinationLng, fitToWindow) {
  // Must have GPS ready
  if (window.currentLat == null || window.currentLng == null) {
    alert('GPSを取得中です...');
    return;
  }

  if (window.routingControl?.router?._abortRequests) {
    window.routingControl.router._abortRequests();
  }

  const markerIcon = L.divIcon({
    html: `<img src='${icon}' style='width: 40px; height: 40px; filter: hue-rotate(130deg)'>`,
    className: 'destination-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const root = document.querySelector(':root');
  root.style.setProperty('--map-height', '79svh');

  const collapseBtn = document.createElement('span');
  collapseBtn.className = 'leaflet-routing-collapse-btn';
  root.appendChild(collapseBtn);

  collapseBtn.addEventListener('click', (e) => {
    // stop auto updates
    if (routeInterval) {
      clearInterval(routeInterval);
      routeInterval = null;
    }

    map.removeControl(window.routingControl);
    document.querySelector('.destination-marker')?.remove();

    root.style.setProperty('--map-height', '100svh');

    e.target.remove();
  });

  new L.marker([destinationLat, destinationLng], {
    keyboard: false,
    icon: markerIcon,
  }).addTo(map);

  const allDirections = [];
  let lastStepDistance = 0;

  const osrmBikeRouter = L.Routing.osrmv1({
    // USE ONLY FOR DEMO VIDEO OUTSIDE
    // serviceUrl: 'https://routing.openstreetmap.de/routed-bike/route/v1',
    serviceUrl: 'http://localhost:5000/route/v1',
    profile: 'bike',
    stepToText(step) {
      const currentStep = {
        type: step.maneuver.type,
        modifier: step.maneuver.modifier,
        distance: lastStepDistance,
        location: step.maneuver.location,
      };
      allDirections.push(currentStep);
      lastStepDistance = step.distance;

      const m = step.maneuver || {};
      const name = step.name ? ` (${step.name}) ` : '';

      switch (m.type) {
        case 'depart':
          return `出発${name}`;

        case 'arrive':
          return 'まもなく到着';

        default:
          return `${modifierToJa(m.modifier)}${name}`;
      }
    },
  });

  function modifierToJa(mod) {
    switch (mod) {
      case 'left':
        return '↖ 左折';
      case 'right':
        return '↗ 右折';
      case 'slight left':
        return '↖ やや左へ';
      case 'slight right':
        return '↗ やや右へ';
      case 'sharp left':
        return '↖ 急左折';
      case 'sharp right':
        return '↗ 急右折';
      case 'straight':
        return '⇈ 進む';
      default:
        return '⇈ 進む';
    }
  }

  // remove old route / duplicate UI elements
  if (window.routingControl) {
    if (document.querySelectorAll('.destination-marker').length > 1)
      document.querySelector('.destination-marker').remove();

    if (document.querySelectorAll('.leaflet-routing-collapse-btn').length > 1)
      document.querySelector('.leaflet-routing-collapse-btn').remove();

    map.removeControl(window.routingControl);
  }

  // create new route
  window.routingControl = L.Routing.control({
    router: osrmBikeRouter,
    addWayPoints: false,
    draggableWaypoints: false,
    routeWhileDragging: false,
    collapsible: false,
    lineOptions: {
      styles: [{ color: 'var(--yellow)', opacity: 1, weight: 8 }],
    },
    waypoints: [
      L.latLng(window.currentLat, window.currentLng),
      // L.latLng(34.98493616431302, 135.75248977767515),
      L.latLng(destinationLat, destinationLng),
    ],
    createMarker: () => null,
  }).addTo(map);

  if (fitToWindow) {
    map.fitBounds(
      [
        [destinationLat, destinationLng],
        [window.currentLat, window.currentLng],
      ],
      {
        paddingTopLeft: [50, 100],
        paddingBottomRight: [100, 250],
      },
    );
  }

  window.routingControl.on('routesfound', () => {
    setTimeout(() => {
      fixDistances();
      playAudioDirection(allDirections);
    }, 1);
  });

  if (routeInterval) clearInterval(routeInterval);
  routeInterval = setInterval(() => {
    if (
      window.currentLat.toFixed(4) === lastLat &&
      window.currentLng.toFixed(4) === lastLng
    )
      return;
    lastLat = window.currentLat.toFixed(4);
    lastLng = window.currentLng.toFixed(4);
    console.log(lastLng);
    console.log(lastLat);

    drawRoute(map, destinationLat, destinationLng, false);
  }, 10000);
}

function fixDistances() {
  const tRows = document.querySelectorAll(
    '.leaflet-routing-container tbody tr td:last-child',
  );

  let lastDistance = '0 m';
  let nextDistance;

  tRows.forEach((row) => {
    nextDistance = row.textContent;
    row.textContent = lastDistance;
    lastDistance = nextDistance;
  });
}
