// Import the model to use its database functions.
var db = require("../models");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Swift.find({}).then(function(data) {
      var hbsObject = {
        swiftarticles: data
      };
      res.render("index", hbsObject);
    });
  });

  app.get("/scrape", function(req, res) {
    axios.get("https://theswiftdev.com/").then(function(response) {
  
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
  
    // An empty array to save the data that we'll scrape
    var results = [];
  
    $("a.post-card-content-link").each(function(i, element) {
  
      var title = $(element).find(".post-card-title").text();
      var summary = $(element).find(".post-card-excerpt p").text();
      var text = $(element).attr("href");;
  
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        summary: summary,
        text: text
      });
    });
  
    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
    results.forEach(function (element) {
      db.Swift.create({"title":element.title,"summary":element.summary,"text":element.text});
    })
    res.send("scrape complete!");
  });
});

  // app.post("/api/burgers", function(req, res) {
  //   db.Burger.create({burger_name: req.body.name}).then(function(dbBurger) {
  //     res.json(dbBurger);
  //   });
  // });

  // app.put("/api/burgers/:id", function(req, res) {
  //   var id = req.params.id;
  //   db.Burger.update(
  //     {devoured: true},
  //     {
  //       where: {
  //         id: id
  //       }
  //     }).then(function(dbBurger) {
  //     res.json(dbBurger);
  //   });
  // });
};
