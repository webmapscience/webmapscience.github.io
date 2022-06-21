let hintereisferner = {
    lat: 47.267222,
    lng: 11.392778,
    zoom: 13
};



// // WMTS Hintergrundlayer der eGrundkarte Tirol definieren
// const eGrundkarteTirol = {
//     sommer: L.tileLayer(
//         "http://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
//             attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
//         }
//     ),
//     winter: L.tileLayer(
//         "http://wmts.kartetirol.at/gdi_winter/{z}/{x}/{y}.png", {
//             attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
//         }
//     ),
//     ortho: L.tileLayer(
//         "http://wmts.kartetirol.at/gdi_ortho/{z}/{x}/{y}.png", {
//             attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
//         }
//     ),
//     nomenklatur: L.tileLayer(
//         "http://wmts.kartetirol.at/gdi_nomenklatur/{z}/{x}/{y}.png", {
//             attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`,
//             pane: "overlayPane",
//         }
//     )
// }

// eGrundkarte Tirol Sommer als Startlayer
let startLayer = L.tileLayer.provider("BasemapAT.grau")

// Karte initialisieren
let map = L.map("map", {
    center: [hintereisferner.lat, hintereisferner.lng],
    zoom: hintereisferner.zoom,
    layers: [
        startLayer
    ],
});