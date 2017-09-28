var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://traveldiscuss-dc79d.firebaseio.com"
});

var db = admin.database();


// Read country json list for import
var countries = require("./countries.json");
countries.forEach((country) => {
  // Create unique country key before placing duplicates
  let countryKey = db.ref("/").push(undefined).key;

  // Place into region
  placeCountryIntoRegion(countryKey, country);

  // Append to number of countries around world
  incrementRegionCounter("World");
});


function placeCountryIntoRegion(countryKey, country){
  var allRegionsRef = db.ref("regions");

  let regionName = !country.region? "Antartica" : country.region
  let regionRef = allRegionsRef.child(regionName);
  // Set Region Name within Region Record
  regionRef.update({name: regionName});
  // Increment country count for that region
  incrementRegionCounter(regionName);
  // Push country under that region
  regionRef.child(`countries/${countryKey}`).set(country);
}

function incrementRegionCounter(regionName){
  var statsRef = db.ref(`regions/${regionName}/totalCountries`);

  statsRef.transaction(currentCount => {
    if(!currentCount) currentCount = 0;
    return currentCount + 1;
  });
}