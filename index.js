var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://traveldiscuss-dc79d.firebaseio.com"
});

var db = admin.database();


var statsRef = db.ref("totalCountries");
statsRef.set({
  "world": 0,
  "europe": 0,
  "asia": 0,
  "northamerica": 0,
  "southamerica": 0,
  "etc": 0,
});



// Read country json list for import
var countries = require("./countries.json");
countries.forEach((country) => {
  // Place into region
  placeCountryIntoRegion(country);

  // Place into countries
  placeCountryIntoCountries(country);

  // Append to number of countries around world
  statsRef.child("world").transaction(currentCount => {
    return currentCount + 1;
  });
});


function placeCountryIntoRegion(country){
  var allRegionsRef = db.ref("regions");

  let regionName = !country.region? "Antartica" : country.region
  let regionRef = allRegionsRef.child(regionName);
  // Set Region Name within Region Record
  regionRef.update({name: regionName});
  // Push country under that region
  regionRef.child("countries").push(country);
}


function placeCountryIntoCountries(country){
  var allCountriesRef = db.ref("countries");
  allCountriesRef.push(country);
}