import icon from '../../img/map-ui/user-marker.png';
import { addRoutingBtn } from './routingButton';

export function addUserMarker(map) {
    const markerIcon = L.divIcon({
        html: `<img src="${icon}" style="width: 40px; height: 40px;">`,
        className: 'user-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    // map.on("contextmenu", addMarker);
    map.on("click", addMarker);

    function addMarker(e) {
        const latStr = JSON.stringify(e.latlng.lat);
        const lngStr = JSON.stringify(e.latlng.lng);

        const userMarkerPopup = document.createElement('div');
        const userMarkerLink = document.createElement('a');
        const closeBtn = document.createElement('button');

        userMarkerLink.href = `https://www.google.com/maps/place/${latStr},${lngStr}`;
        userMarkerLink.target = "_blank";
        userMarkerLink.textContent = "Google Mapsで開く";
        
        closeBtn.textContent = 'X';
        closeBtn.className = 'close-btn';

        userMarkerPopup.appendChild(userMarkerLink);
        userMarkerPopup.appendChild(closeBtn);
        userMarkerPopup.appendChild(addRoutingBtn(map, e.latlng.lat, e.latlng.lng));
        userMarkerPopup.className = 'user-marker-popup';

        const marker = new L.marker(e.latlng, {
            keyboard: false,
            icon: markerIcon,
        }).addTo(map);
        document.querySelector('body').appendChild(userMarkerPopup);

        // Removes marker if there are more than 1, or if close button is pressed
        const markers = document.querySelectorAll('.user-marker');
        if (markers.length > 1) removeMarker();
        closeBtn.addEventListener('click', () => {removeMarker()});
    }

    function removeMarker() {
        document.querySelector('.user-marker').remove();
        document.querySelector('.user-marker-popup').remove();
    }
}