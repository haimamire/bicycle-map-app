import icon from '../../img/map-ui/user-marker.png';

let routeInterval = null;
let lastLat = null;
let lastLng = null;

export function drawRoute(map, destinationLat, destinationLng, fitToWindow){
    // Must have GPS ready
    if(window.currentLat == null || window.currentLng == null){
        alert("GPSを取得中です...");
        return;
    }

    if (window.routingControl?.router?._abortRequests) {
        window.routingControl.router._abortRequests();
    }

    const markerIcon = L.divIcon({
        html: `<img src="${icon}" style="width: 40px; height: 40px; filter: hue-rotate(130deg)">`,
        className: 'destination-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    const root = document.querySelector(':root');
    root.style.setProperty('--map-height', '70svh');

    const collapseBtn = document.createElement('span');
    collapseBtn.className = 'leaflet-routing-collapse-btn';
    root.appendChild(collapseBtn);

    collapseBtn.addEventListener(
        'click', (e) => {
            // stop auto updates
            if (routeInterval) {
                clearInterval(routeInterval);
                routeInterval = null;
            }

            map.removeControl(window.routingControl);
            document.querySelector('.destination-marker')?.remove();

            root.style.setProperty('--map-height', '100svh');

            e.target.remove();
        }
    );
    
    new L.marker([destinationLat, destinationLng], {
        keyboard: false,
        icon: markerIcon,
    }).addTo(map);

    const osrmBikeRouter = L.Routing.osrmv1({
        serviceUrl: 'http://10.40.163.191:5000/route/v1',
        profile: 'bike',
    })

    // remove old route / duplicate UI elements
    if(window.routingControl) {
        if (document.querySelectorAll('.destination-marker').length > 1)
            document.querySelector('.destination-marker').remove();

        if (document.querySelectorAll('.leaflet-routing-collapse-btn').length > 1)
            document.querySelector('.leaflet-routing-collapse-btn').remove();

        map.removeControl(window.routingControl);
    };

    //create new route
    window.routingControl = L.Routing.control({
        router: osrmBikeRouter,
        addWayPoints: false,
        draggableWaypoints: false,
        routeWhileDragging: false,
        collapsible: false,
        lineOptions: {
            styles: [{ color: "var(--yellow)", opacity: 1, weight: 8 }],
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
                [window.currentLat, window.currentLng]
            ],
            {
                paddingTopLeft: [50, 100],
                paddingBottomRight: [100, 250],
            }
        );
    }

    if(routeInterval) clearInterval(routeInterval);
    routeInterval = setInterval(() => {
        if (window.currentLat === lastLat && window.currentLng === lastLng) return;
        lastLat = window.currentLat;
        lastLng = window.currentLng;

        drawRoute(map, destinationLat, destinationLng, false);
    }, 10000);
}
