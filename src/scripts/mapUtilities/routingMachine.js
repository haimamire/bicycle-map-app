import icon from '../../img/map-ui/user-marker.png';
import 'leaflet-routing-machine';

let routeInterval = null;
let lastLat = null;
let lastLng = null;

export function drawRoute(map, destinationLat, destinationLng, fitToWindow) {
  // Must have GPS ready
  // if (window.currentLat == null || window.currentLng == null) {
  //   alert('GPSを取得中です...');
  //   return;
  // }

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
  root.style.setProperty('--map-height', '74svh');

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

  const osrmBikeRouter = L.Routing.osrmv1({
    serviceUrl: 'http://localhost:5000/route/v1',
    // USE ONLY FOR DEMO VIDEO OUTSIDE
    // serviceUrl: 'https://router.project-osrm.org/route/v1',
    profile: 'bike',

    stepToText(step) {
      const m = step.maneuver || {};
      const name = step.name ? `（${step.name}）` : '';

      switch (m.type) {
        case 'depart':
          return `出発${name}`;

        case 'turn':
          return `${modifierToJa(m.modifier)}${name}`;

        case 'continue':
          return `⇈ 直進${name}`;

        case 'roundabout':
          return `ロータリーに入り、出口へ進む${name}`;

        case 'arrive':
          return '目的地に到着';

        default:
          return `⇈ 進む`;
      }
    },
  });

  function modifierToJa(mod) {
    switch (mod) {
      case 'left':
        return '↰ 左折';
      case 'right':
        return '↱ 右折';
      case 'slight left':
        return '↰ やや左へ';
      case 'slight right':
        return '↱ やや右へ';
      case 'sharp left':
        return '↰ 急左折';
      case 'sharp right':
        return '↱ 急右折';
      case 'uturn':
        return '↶ Uターン';
      case 'straight':
        return '⇈ 直進';
      default:
        return '⇈ 進行';
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
      // L.latLng(window.currentLat, window.currentLng),
      L.latLng(34.98493616431302, 135.75248977767515),
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
      }
    );
  }

  if (routeInterval) clearInterval(routeInterval);
  routeInterval = setInterval(() => {
    if (window.currentLat === lastLat && window.currentLng === lastLng) return;
    lastLat = window.currentLat;
    lastLng = window.currentLng;

    drawRoute(map, destinationLat, destinationLng, false);
  }, 10000);
}
