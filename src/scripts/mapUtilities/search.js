import icon from '../../img/map-ui/user-marker.png';
import { addRoutingBtn } from './routingButton';

export function getSearch(map) {
    new Autocomplete("search", {
        delay: 1000,
        selectFirst: true,
        howManyCharacters: 2,

        onSearch: function ({ currentValue }) {
            const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&accept-language=ja&q=${encodeURI(
                currentValue
            )}`;
            
            return new Promise((resolve) => {
                fetch(api)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.features);
                })
                .catch((error) => {
                    console.error(error);
                });
            });
        },

        onResults: ({ currentValue, matches, template }) => {
            const regex = new RegExp(currentValue, "i");
            return matches === 0
                ? template
                : matches
                    .map((element) => {
                    return `
                    <li class="loupe" role="option">
                        ${element.properties.display_name.replace(
                        regex,
                        (str) => `<b>${str}</b>`
                        )}
                    </li> `;
                    })
                    .join("");
        },

        onSubmit: ({ object }) => {
            const cord = object.geometry.coordinates;

            const markerIcon = L.divIcon({
                html: `<img src="${icon}" style="width: 40px; height: 40px;">`,
                className: 'user-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
            });

            const latStr = JSON.stringify(cord[1]);
            const lngStr = JSON.stringify(cord[0]);

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
            userMarkerPopup.appendChild(addRoutingBtn(map, cord[1], cord[0]));
            userMarkerPopup.className = 'user-marker-popup';

            const marker = new L.marker([cord[1], cord[0]], {
                keyboard: false,
                icon: markerIcon,
            }).addTo(map);
            document.querySelector('body').appendChild(userMarkerPopup);

            map.setView([cord[1], cord[0]], 15);

            const markers = document.querySelectorAll('.user-marker');
            if (markers.length > 1) {
                document.querySelector('.user-marker').remove();
                document.querySelector('.user-marker-popup').remove();
            }
            closeBtn.addEventListener('click', () => {
                document.querySelector('.user-marker').remove();
                document.querySelector('.user-marker-popup').remove();
            });
        },

        // onSelectedItem: ({ index, element, object }) => {
        //     console.log("onSelectedItem:", index, element, object);
        // },

        noResults: ({ currentValue, template }) =>
        template(`<li>検索結果が見つかりませんでした。</li>`),
    });
}