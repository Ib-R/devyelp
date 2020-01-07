let lat, lng, street, city, state, country;

async function getMapKey() {
    const res = await fetch(`//${window.location.host}/api/v1/mapquest`);
    const data = await res.json();
    return data;
}

const initMap = async () => {
    const key = await getMapKey();
    L.mapquest.key = key;

    const popup = L.popup();

    // 'map' refers to a <div> element with the ID map
    const map = L.mapquest.map('map', {
        center: [27.955591, 27.905273],
        layers: L.mapquest.tileLayer('map'),
        zoom: 5
    });
    map.addControl(L.mapquest.control());

    map.on('click', function (e) {
        popup.setLatLng(e.latlng).openOn(this);
        L.mapquest.geocoding().reverse(e.latlng, generatePopupContent);
    });

    function generatePopupContent(error, response) {
        const location = response.results[0].locations[0];
        console.log(location);

        lat = location.latLng.lat;
        lng = location.latLng.lng;
        street = location.street;
        city = location.adminArea5;
        state = location.adminArea3;
        country = location.adminArea1;
        popup.setContent(`${street} ${city}, ${state} <br> ${lat}, ${lng}`);
    }
};
initMap();