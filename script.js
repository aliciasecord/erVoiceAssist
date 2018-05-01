let APIkey = 'pk.eyJ1IjoiYWxpY2lhc2Vjb3JkIiwiYSI6ImNqZ2Q0cW5oeDNybjgyd241cTR1eGMyenYifQ.IyZgMzeCKNb6tyglxHWU8w';

mapboxgl.accessToken = APIkey;
// This adds the map to your page
let map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/mapbox/light-v9',
  // initial position in [lon, lat] format
  center: [-83, 42],
  // initial zoom
  zoom: 6
});

let ERurl = 'https://data.medicare.gov/resource/3z8n-wcgr.geojson?$limit=5000&measure_id=OP_20';

map.on('load', function(e) {
  // Add the data to your map as a layer
  map.addLayer({
    id: 'locations',
    type: 'symbol',
    // Add hospitals GeoJSON source.
    source: {
      type: 'geojson',
      data: ERurl
    },
    layout: {
      'icon-image': 'hospital-15',
      'icon-allow-overlap': true
    }
  });

  fetch(ERurl)
    .then(response => {return response.json()})
    .then(data => {buildLocationList(data)})
});

function buildLocationList(data) {
  let heading = document.getElementById('heading');
  heading.innerHTML = '<h1>Emergency Room Locations</h1>';
  // Iterate through the list of hospitals
  for (let i = 0; i < data.features.length; i++) {
    let currentFeature = data.features[i];
    // Shorten data.feature[i].properties to just `prop` so we're not
    // writing this long form over and over again.
    let prop = currentFeature.properties;
    // Select the listing container in the HTML and append a div
    // with the class 'item' for each hospital
    let listings = document.getElementById('listings');
    let listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = 'listing-' + i;

    // Create a new link with the class 'title' for each hospital
    // and fill it with the hospital name
    let link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.hospital_name;

    // Create a new div with the class 'details' for each store
    // and fill it with the city and phone number
    let details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.location_address + ', ' + prop.location_city + ', ' + prop.location_state + ' ' + prop.zip_code + '<br>' + prop.phone_number + '<br> Average wait time: ' + prop.score + ' minutes';
  }
}

// function flyToStore(currentFeature) {
//   map.flyTo({
//     center: currentFeature.geometry.coordinates,
//     zoom: 15
//   });
// }

// function createPopUp(currentFeature) {
//   var popUps = document.getElementsByClassName('mapboxgl-popup');
//   // Check if there is already a popup on the map and if so, remove it
//   if (popUps[0]) popUps[0].remove();

//   var popup = new mapboxgl.Popup({ closeOnClick: false })
//     .setLngLat(currentFeature.geometry.coordinates)
//     .setHTML('<h3>' + currentFeature.properties.hospital_name + '</h3>' +
//       '<h4>' + currentFeature.properties.location_address + '</h4>')
//     .addTo(map);
// }

// // Add an event listener for the links in the sidebar listing
// link.addEventListener('click', function(e) {
//   // Update the currentFeature to the store associated with the clicked link
//   var clickedListing = data.features[this.dataPosition];
//   // 1. Fly to the point associated with the clicked link
//   flyToStore(clickedListing);
//   // 2. Close all other popups and display popup for clicked store
//   createPopUp(clickedListing);
//   // 3. Highlight listing in sidebar (and remove highlight for all other listings)
//   var activeItem = document.getElementsByClassName('active');
//   if (activeItem[0]) {
//     activeItem[0].classList.remove('active');
//   }
//   this.parentNode.classList.add('active');
// });

// map.on('click', function(e) {
//   // Query all the rendered points in the view
//   var features = map.queryRenderedFeatures(e.point, { layers: ['locations'] });
//   if (features.length) {
//     var clickedPoint = features[0];
//     // 1. Fly to the point
//     flyToStore(clickedPoint);
//     // 2. Close all other popups and display popup for clicked hospital
//     createPopUp(clickedPoint);
//     // 3. Highlight listing in sidebar (and remove highlight for all other listings)
//     var activeItem = document.getElementsByClassName('active');
//     if (activeItem[0]) {
//       activeItem[0].classList.remove('active');
//     }
//     // Find the index of the data.features that corresponds to the clickedPoint that fired the event listener
//     var selectedFeature = clickedPoint.properties.location_address;

//     for (var i = 0; i < data.features.length; i++) {
//       if (data.features[i].properties.location_address === selectedFeature) {
//         selectedFeatureIndex = i;
//       }
//     }
//     // Select the correct list item using the found index and add the active class
//     var listing = document.getElementById('listing-' + selectedFeatureIndex);
//     listing.classList.add('active');
//   }
// });
