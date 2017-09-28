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

var countriesRef = db.ref("countries");

// Read country json list and import each country
var countries = require("./countries.json");
countries.forEach((country) => {
  countriesRef.push(country);

  // Append to number of countries around world
  statsRef.child("world").transaction(currentCount => {
    return currentCount + 1;
  });
});