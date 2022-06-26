/* Bike Trail Tirol Beispiel */

let hintereisferner = {
    lat: 46.7956981,
    lng: 10.7411067,
    zoom: 15
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
    "Sommer": startLayer,
    "Winter": eGrundkarteTirol.winter,
    "Orthofoto": eGrundkarteTirol.ortho,
    "Oberfächenmodel": L.tileLayer.provider("BasemapAT.surface"),
    "Geländemodel": L.tileLayer.provider("BasemapAT.terrain"),
    "Orthofoto mit Beschriftung": L.layerGroup([
        eGrundkarteTirol.ortho,
        eGrundkarteTirol.nomenklatur,
    ])
}, {
    "GPX Track der Etappe": overlays.gpx,
}).addTo(map);

/*L.LayerGroup.EnvironmentalLayers({
    // simpleLayerControl: true,
    addLayersToMap: true,
    include: ['odorreport', 'clouds', 'eonetFiresLayer', 'Unearthing', 'PLpeople'], // display only these layers
    // exclude: ['mapknitter', 'clouds'], // layers to exclude (cannot be used at same time as 'include'
    // display: ['eonetFiresLayer'], // which layers are actually shown as opposed to just being in the menu
    hash: true,
    embed: true,
    // hostname: 'domain name goes here'
  }).addTo(map);*/

// Maßstab hinzu
L.control.scale({
    imperial: false
}).addTo(map);

// Fullscreen control
L.control.fullscreen().addTo(map);


// Mini-Map
let miniMap = new L.Control.MiniMap(
    L.tileLayer.provider("BasemapAT"), {
        toggleDisplay: true
    }
).addTo(map);

// GPX Track Layer beim Laden anzeigen
overlays.gpx.addTo(map);

// GPX Track Layer implementieren
let gpxTrack = new L.GPX("./data/route_1.gpx", {
async: true,
marker_options:{
    startIconUrl:'icons/start.png',
    endIconUrl:'icons/mountain.png',
    shadowUrl: null,
    iconSize: [32, 37],
    iconAnchor: [16, 37],
},
polyline_options:{
    color:"black",
    dashArray:[5,4],
}

}).addTo(overlays.gpx);

gpxTrack.on("loaded", function (evt){
    //console.log ("loaded gpx event: ", evt);
    map.fitBounds(evt.target.getBounds())


let gpxLayer = evt.target;
map.fitBounds(gpxLayer.getBounds());



let popup = `
<h1> Aussichtsstandort mit aktuellem Webcam-Foto am Zielort: </h1>
<ul>
<img src="https://www.foto-webcam.eu/webcam/hintereisferner1/current/180.jpg" href="https://www.foto-webcam.eu/webcam/hintereisferner1/" style="width:170px; border:2px solid silver;" alt="Webcam">
    <h3> Trekkingroute Hard-Facts: </h3>
    <li>Streckenlänge ${gpxLayer.get_distance().toFixed()/1000} Kilometer </li>
    <li>Höchster Punkt: ${gpxLayer.get_elevation_max().toFixed()} m. ü. NN.</li>
    <li>Niedrigster Punkt: ${gpxLayer.get_elevation_min().toFixed()} m. ü. NN.</li>
    <br>
    <li>Höhenmeter Bergauf: ${gpxLayer.get_elevation_gain().toFixed()} Höhenmeter </li>
    <li>Höhenmeter Bergab: ${gpxLayer.get_elevation_loss().toFixed()} Höhenmeter </li>

</ul>
`;

// Print
L.control.bigImage({position: 'bottomleft'}).addTo(map);



// Rainviewer
L.control.rainviewer({
    position: 'topleft',
    nextButtonText: '>',
    playStopButtonText: 'Play/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Hour:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
}).addTo(map);

gpxLayer.bindPopup(popup);
});

let elevationControl = L.control.elevation({
    time:false,
    theme: "trekking",
    elevationDIV: "#profile",
    height: 300,
    downloadLink: 'link',

    

}).addTo(map);



gpxTrack.on("addline", function(evt) {

    elevationControl.addData(evt.line);
});


  const labels = [
    'Primary Street',
    'Secondary Street',
    'Living Street',
    'Footway',
    'Path',
    'AlpinePath',
  ];

  const data = {
    labels: labels,
    height: 300,
    datasets: [{
      label: 'Path-Classification',
      backgroundColor: 'white',
      borderColor: 'black',
      data: [0, 10, 5, 2, 20, 30, 35],
    }]
  };

  const config = {
    type: 'doughnut',
    data: data,
  };
 
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );



