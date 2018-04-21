// origin and destination need to change when the user puts in addresses/destinations
// this is the current location
let originInput = document.getElementById('originInput')
let userLocation = originInput.value

//for now, this is the destination
let destinationInput = document.getElementById('destinationInput')
let userDestination = 'Chicago';

// let's have a button that triggers the routing
let goButton = document.getElementById('goButton');

// do something when the text input is updated
goButton.addEventListener('click', printme);

function printme(){console.log(originInput.value)}

// placeholder for origin coordinates
let origin = ""

// placeholder for destination coordinates
let destination = ""

// my mapbox API key
let APIkey = 'pk.eyJ1IjoiYWxpY2lhc2Vjb3JkIiwiYSI6ImNqOTY4ZG5kdjAxcXkzM282NG4wbmZibGQifQ.8pihI3EzBLwngeG2k6T26g';

// create the url to get the origin coordinates
if (originInput)
  {let originURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + originInput.value + '.json?access_token=' + APIkey;}

// create the url to get the destination coordinates
let destinationURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + userDestination + '.json?access_token=' + APIkey;

// don't run until the userLocation and userDestination are set
function mapboxQueries (){
  // fetch origin location data
  fetch(originURL)
    .then(response => {return response.json()})
    .then(data => {getOriginLocation(data)})
    .then;

  // function returns origin as lat, lang
  function getOriginLocation(data) {
    let originLat = data.features[0].center[0];
    let originLong = data.features[0].center[1];
    let origin = (originLat + '%2C' + originLong);

    // inside of origin function
    // fetch destination location data
    fetch(destinationURL)
    .then(response => {return response.json()})
    .then(data => {getDestinationLocation(data)})
    .then;

    // function returns destination as lat, lang
    function getDestinationLocation(data) {
      let destinationLat = data.features[0].center[0];
      let destinationLong = data.features[0].center[1];
      let destination = (destinationLat + '%2C' + destinationLong);

      // inside of destination function
      // create the url for directions from origin and destination coordinates
      let directionsURL = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + origin + '%3B' + destination + '.json?access_token=' + APIkey;

      // fetch the directions from origin to destination
      fetch(directionsURL)
        .then(response => {return response.json()})
        .then(data => getDuration(data));

      // function returns the duration of the trip in minutes or hours and minutes
      function getDuration(data){
      let duration = data.routes[0].legs[0].duration;
      let hours = Math.floor(duration/3600)
      let min = Math.round((duration/3600 - hours)*60);
      if (!hours)
        {console.log(min + " minutes")}
      else
        {console.log(hours  + " hours and " + min + " minutes")}
      }
    }
  }

}
