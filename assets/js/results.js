let hintereisferner = {
    lat: 46.80054779339542,
    lng: 10.75644886803035,
    zoom: 14.49
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
    "Summer": eGrundkarteTirol.sommer,
    "Winter": eGrundkarteTirol.winter,
    "Satellite": eGrundkarteTirol.ortho,
    "Surface": L.tileLayer.provider("BasemapAT.surface"),
    "Terrain": L.tileLayer.provider("BasemapAT.terrain"),
    "Satellite with names": L.layerGroup([
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
async function loadPoly(url, name) {
    let response = await fetch(url);
    let geojson = await response.json();

    // Add to overlay
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, name);
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
loadPoly("data/20160929_RF.geojson", "2016 - 09");
loadPoly("data/20170822_RF.geojson", "2017 - 08");
loadPoly("data/20180731_RF.geojson", "2018 - 10");
loadPoly("data/20190914_RF.geojson", "2019 - 09");

// TODO: Legende
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<i class="icon" style="background-image: url(icons\ice_legend.png);background-repeat: no-repeat;"></i><span>Ice</span><br>';
  div.innerHTML += '<i class="icon" style="background-image: url(icons\snow_legend.png);background-repeat: no-repeat;"></i><span>Snow</span><br>';

  

  return div;
};

legend.addTo(map);