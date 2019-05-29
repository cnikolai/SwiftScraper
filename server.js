// Dependencies
var express = require("express");
var mongoose = require("mongoose");

// Initialize Express
var app = express();
//var PORT = process.env.PORT || 8080;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/swiftheadlines";

mongoose.connect(MONGODB_URI);

var express = require("express");

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// =============================================================
// require("./routes/html-routes.js")(app);
// require("./routes/author-api-routes.js")(app);
// require("./routes/post-api-routes.js")(app);
require("./controllers/controller.js")(app);

// Database configuration
// var databaseUrl = "swiftscraper";
// var collections = ["scrapedData"];

// Main route (simple Hello World Message)
// app.get("/", function(req, res) {
//   res.send("Hello world");
// });

// app.get("/all", function(req, res) {
//   // Query: In our database, go to the animals collection, then "find" everything
//   db.Swift.find({}, function(error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       res.json(found);
//     }
//   });
  // db.Burger.findAll({}).then(function(data) {
  //   var hbsObject = {
  //     burgers: data
  //   };
  //   res.render("index", hbsObject);
  // });
// });

// app.get("/scrape", function(req, res) {
//   axios.get("https://theswiftdev.com/").then(function(response) {

//   // Load the HTML into cheerio and save it to a variable
//   // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//   var $ = cheerio.load(response.data);

//   // An empty array to save the data that we'll scrape
//   var results = [];

//   $("a.post-card-content-link").each(function(i, element) {

//     var title = $(element).find(".post-card-title").text();
//     var summary = $(element).find(".post-card-excerpt p").text();
//     var text = $(element).attr("href");;

//     // Save these results in an object that we'll push into the results array we defined earlier
//     results.push({
//       title: title,
//       summary: summary,
//       text: text
//     });
//   });

//   // Log the results once you've looped through each of the elements found with cheerio
//   console.log(results);
//   results.forEach(function (element) {
//     db.Swift.insert({"title":element.title,"summary":element.summary,"text":element.text});
//   })
//   res.send("scrape complete!");
// });
// });

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
