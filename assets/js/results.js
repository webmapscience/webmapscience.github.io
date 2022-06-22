let hintereisferner = {
    lat: 46.79836,
    lng: 10.76857,
    zoom: 14
};

// WMTS Hintergrundlayer der eGrundkarte Tirol definieren
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

// eGrundkarte Tirol Sommer als Startlayer
let startLayer = eGrundkarteTirol.ortho;

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
    "Sommer": eGrundkarteTirol.sommer,
    "Winter": eGrundkarteTirol.winter,
    "Orthofoto": eGrundkarteTirol.ortho,
    "Oberfächenmodel": L.tileLayer.provider("BasemapAT.surface"),
    "Geländemodel": L.tileLayer.provider("BasemapAT.terrain"),
    "Orthofoto mit Beschriftung": L.layerGroup([
        eGrundkarteTirol.ortho,
        eGrundkarteTirol.nomenklatur,
    ])
}).addTo(map);

// Maßstab control
L.control.scale({
    imperial: false
}).addTo(map);

// Fullscreen control
L.control.fullscreen().addTo(map);

// Load Classified geojason data and style by property gridcode = class label
async function loadPoly(url) {
    let response = await fetch(url);
    let geojson = await response.json();

    // Add to overlay
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Gletscherstand 2017");
    overlay.addTo(map);

    L.geoJSON(geojson, {
        style: function(feature) {
            console.log(feature.properties.gridcode);
            switch (feature.properties.gridcode) {
                case 0: return {color: "#001f3f"};
                case 1: return {color: "#0074D9"};
            }
        }
    }).addTo(overlay);
}
loadPoly("data/prediction_RF_01.geojson");

// TODO: Legende