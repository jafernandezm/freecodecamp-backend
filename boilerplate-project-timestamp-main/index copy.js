// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api/:date", function (req, res) {
  let dateString = req.params.date;
  if(parseInt(dateString) > 10000){
    let dateInt = new Date(parseInt(dateString));
    res.json({unix: dateInt.getTime(), utc: dateInt.toUTCString()});
  }
  else{
    //DATE =2022-11-01
    let dateObj = new Date(dateString);
    console.log(dateObj);
    if (dateObj.getTime() !== dateObj.getTime()) {
      console.log("aqui 2"+resDate);
      res.json({ error: "Invalid Date" });
    } 
    if (dateObj.toString() === "Invalid Date") {
      console.log(dateObj);
      res.json({ error: "Invaid Date" });
    }else
    {
      res.json({ unix: dateObj.getTime(), utc: dateObj.toUTCString()});
    }
  }
 

});
app.get("/api", function (req, res) {
  //DATE =2022-11-01
  let dateObj = new Date();
  res.json({unix: dateObj.getTime(), utc: dateObj.toUTCString()});
});  



/*
// your first API endpoint... 
app.get("/api/:date", function (req, res) {
  let dateString = req.params.date_string;

  //A 4 digit number is a valid ISO-8601 for the beginning of that year
  //5 digits or more must be a unix time, until we reach a year 10,000 problem
  if (/\d{5,}/.test(dateString)) {
    dateInt = parseInt(dateString);
    //Date regards numbers as unix timestamps, strings are processed differently
    res.json({ unix: dateString, utc: new Date(dateInt).toUTCString() });
  }

  let dateObject = new Date(dateString);

  if (dateObject.toString() === "Invalid Date") {
    res.json({ error: "Invaid Date" });
  } else {
    res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
  }
});  

app.get("/api/", function (req, res) {
  //DATE =2022-11-01
  let dateObj = new Date();
  res.json({unix: dateObj.getTime(), utc: dateObj.toUTCString()});
});  
*/

// listen for requests :)
var PORT= 3005;

var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
