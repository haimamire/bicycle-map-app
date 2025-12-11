export function getSearch(map) {
    new Autocomplete("search", {
        delay: 1000,
        selectFirst: true,
        howManyCharacters: 2,

        onSearch: function ({ currentValue }) {
            const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
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
            const { display_name } = object.properties;
            const cord = object.geometry.coordinates;
            const customId = Math.random();

            const marker = L.marker([cord[1], cord[0]], {
                title: display_name,
                id: customId,
            });

            marker.addTo(map).bindPopup(display_name);

            map.setView([cord[1], cord[0]], 8);

            map.eachLayer(function (layer) {
                if (layer.options && layer.options.pane === "markerPane") {
                if (layer.options.id !== customId) {
                    map.removeLayer(layer);
                }
                }
            });
            },

            onSelectedItem: ({ index, element, object }) => {
            console.log("onSelectedItem:", index, element, object);
            },

            noResults: ({ currentValue, template }) =>
            template(`<li>No results found: "${currentValue}"</li>`),
        });
}