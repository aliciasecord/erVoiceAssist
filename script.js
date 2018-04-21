let APIkey = 'pk.eyJ1IjoiYWxpY2lhc2Vjb3JkIiwiYSI6ImNqOTY4ZG5kdjAxcXkzM282NG4wbmZibGQifQ.8pihI3EzBLwngeG2k6T26g'

mapboxgl.accessToken = APIkey

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-96, 37.8],
  zoom: 4
});

// set up geojson object
let geojson = {
	type: 'FeatureCollection',
  features: []
}

let i = 0;
let limit = 400;
let offset = (limit * i)

// Medicare options include GET request and headers including APP token
let medicareDataOptions = {
  method: 'GET',
  headers: {
    // this is our APP token
    'X-App-Token': 'rqCqfMJxp9wRbLXkPISaVzZF2',
    'Host': 'data.medicare.gov',
    'Accept': 'application/json'
  }
};

// dataset of US hospitals
for (i=0; i < 13; i++)
  {
  hospitalsURL = 'https://data.medicare.gov/resource/3z8n-wcgr.json?$limit=' + limit + '&$offset=' + offset + '&measure_id=OP_20'

// fetch hospital data
fetch(hospitalsURL, medicareDataOptions)
  .then(response => {return response.json()})
  .then (data => {hospitalLocations (data)})
  // after everything is compiled, add markers
}

function hospitalLocations (data){
	for (hospital in data){
	  hospitalLocation = String(data[hospital].location_address + ', ' + data[hospital].location_city + ', ' + data[hospital].location_state);
		hospitalName = String(data[hospital].hospital_name);
    hospitalWait = String(data[hospital].score);

	// create the url to get the destination coordinates for each hospital
	let destinationURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + hospitalLocation + '.json?access_token=' + APIkey;

  // fetch the mapbox data to get the coordinates of each address
	fetch (destinationURL)
		.then(response => {return response.json()})
		.then(data => {getAddress(data)});
	}
}

// parse the coordinates for each address
function getAddress(data){
	let destinationLat = data.features[0].center[0];
	let destinationLong = data.features[0].center[1];
	let destination = [destinationLat, destinationLong];

  // push the coordinates for each hospital to the geojson object
	geojson.features.push(
         {
           type: 'Feature',
           geometry: {
             type: 'Point',
             coordinates: destination
           },
           properties: {
             title: hospitalName,
             description: hospitalLocation,
             wait: 'Wait: ' + hospitalWait + ' minutes'
           }
         }
       )
  if (geojson.features.length == 4806){
    addMarkers()
  }
}

function addMarkers(){
  console.log(geojson.features.length)
  // add markers to map
  geojson.features.forEach(function(marker) {

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p><p>' + marker.properties.wait + '</p>'))
    .addTo(map);
  });
}
