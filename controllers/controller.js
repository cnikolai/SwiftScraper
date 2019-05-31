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

  app.get("/api/saved", function(req, res) {
    //var notes = [];
    db.SavedArticles.find({})
    // Specify that we want to populate the retrieved users with any associated notes
    .populate("notes")
    .then(function(dbSavedArticle) {
      // for (var i = 0; i <= dbNotes.length; i++) {
      //   notes.push(dbNotes[i]);
      // }
      console.log("notes: ",dbSavedArticle.notes);
      // If any Users are found, send them to the client with any associated Notes
      //res.json(dbSavedArticle);
      //TODO: look at following code
      //TODO: catch error if have no saved articles or scraped articles
      // "branch_data", {
      //   user: req.user,
      //   admin: req.user.eUserType,
      //   sBranch: sBranch
      // });
      res.render("indexsavedarticles", {swiftarticles: dbSavedArticle, notes: dbSavedArticle.notes});
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  });

  app.put("/api/swiftarticles/", function(req, res) {
    var swiftarticle = req.body;
    console.log("swiftarticle object: ", swiftarticle)
    db.SavedArticles.create(swiftarticle).then(function(data) {
      var hbsObject = {
        swiftarticles: swiftarticle
      };
      //console.log("saved swift article: ", swiftarticle);
      res.render("index", hbsObject);
    });
  });

  app.delete("/api/swiftarticles", function(req, res) {
    var swiftarticle = req.body;
    console.log("swiftarticle object: ", swiftarticle)
    db.SavedArticles.deleteOne(swiftarticle).then(function(data) {
      var hbsObject = {
        swiftarticles: swiftarticle
      };
      //console.log("saved swift article: ", swiftarticle);
      res.render("indexsavedarticles", hbsObject);
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
        text: "https://theswiftdev.com" + text
      });
    });
  
    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
    results.forEach(function (element) {
      db.Swift.create({"title":element.title,"summary":element.summary,"text":element.text});
    })
    //TODO: fix this to new webpage
    //TODO: add clear articles
    res.send("scrape complete!");
  });
});
// Route for saving a new Note to the db and associating it with a User
app.post("/submitnote", function(req, res) {
  // Create a new Note in the db
  db.Note.create({"title":req.body.title, "body": req.body.body})
    .then(function(dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.SavedArticles.findOneAndUpdate({title: req.body.articletitle}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbSavedArticle) {
      // If the SavedArticle was updated successfully, send it back to the client
      //res.json(dbSavedArticle);
      res.render("indexsavedarticles", req.body.articletitle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route to see what user looks like WITH populating
app.get("/populatedarticles", function(req, res) {
  // TODO
  // =====
  // Write the query to grab the documents from the User collection,
  // and populate them with any associated Notes.
  // TIP: Check the models out to see how the Notes refers to the User
  db.SavedArticles.find({})
    // Specify that we want to populate the retrieved users with any associated notes
    .populate("notes")
    .then(function(dbUser) {
      // If any SavedArticles are found, send them to the client with any associated Notes
      //res.json(dbUser);

    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});
};
