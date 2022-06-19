let hintereisferner = {
    lat: 46.7956981,
    lng: 10.7411067,
    zoom: 13
};



// WMTS Hintergrundlayer
const eGrundkarteTirol = {
    sommer: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
        }
    ),
    winter: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_winter/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
        }
    ),
    ortho: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_ortho/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
        }
    ),
    nomenklatur: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_nomenklatur/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`,
            pane: "overlayPane",
        }
    )
}

// orthophoto als Startlayer
let startLayer = eGrundkarteTirol.ortho;

// Overlays Objekt für den GPX Track Layer
let overlays = {
    gpx: L.featureGroup()
};

// Karte initialisieren
let map = L.map("map", {
    center: [hintereisferner.lat, hintereisferner.lng],
    zoom: hintereisferner.zoom,
    layers: [
        startLayer
    ],
});


// Layer control mit WMTS Hintergründen und Overlay
let layerControl = L.control.layers({
    "eGrundkarte Tirol Sommer": startLayer,
    "eGrundkarte Tirol Winter": eGrundkarteTirol.winter,
    "eGrundkarte Tirol Orthofoto": eGrundkarteTirol.ortho,
    "eGrundkarte Tirol Orthofoto mit Beschriftung": L.layerGroup([
        eGrundkarteTirol.ortho,
        eGrundkarteTirol.nomenklatur,
    ])
}, {
    "GPX Track der Route": overlays.gpx,
}).addTo(map);

// Maßstab control
L.control.scale({
    imperial: false
}).addTo(map);

// Fullscreen control
L.control.fullscreen().addTo(map);

// GPX Track Layer beim Laden anzeigen
overlays.gpx.addTo(map);


// GPX Track Layer implementieren
let gpxTrack = new L.GPX("", {
    async: true,
    marker_options: {
        startIconUrl: 'icons/start.png',
        endIconUrl: 'icons/mountain.png',
        shadowUrl: null,
        iconSize: [32, 37],
        iconAnchor: [16, 37],
    },
    polyline_options: {
        color: "black",
        dashArray: [5, 4],
    }

}).addTo(overlays.gpx);

gpxTrack.on("loaded", function (evt) {
    //console.log ("loaded gpx event: ", evt);
    map.fitBounds(evt.target.getBounds())


    let gpxLayer = evt.target;
    map.fitBounds(gpxLayer.getBounds());

    let popup = `
<h3> ${gpxLayer.get_name()}</h3>
<ul>
<img src="https://www.foto-webcam.eu/webcam/hintereisferner1/current/180.jpg" style="width:170px; border:2px solid silver;" alt="Webcam">
    <li>Streckenlänge ${gpxLayer.get_distance()/1000} m </li>
    <li>Höchster Punkt: ${gpxLayer.get_elevation_max()} m</li>
    <li>Niedrigster Punkt: ${gpxLayer.get_elevation_min()} m</li>
    <li>Höhenmeter Bergauf: ${gpxLayer.get_elevation_gain().toFixed()} m</li>
    <li>Höhenmeter Bergab: ${gpxLayer.get_elevation_loss().toFixed()} m</li>

</ul>
`;
    gpxLayer.bindPopup(popup);
});

let elevationControl = L.control.elevation({
    time: false,
    theme: 'bike-tirol',
    elevationDIV: "#profile",
    height: 200

}).addTo(map);

gpxTrack.on("addline", function (evt) {

    elevationControl.addData(evt.line);
});