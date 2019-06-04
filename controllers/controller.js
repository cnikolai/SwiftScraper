//??? question: not deleting notes from database
//??? quesiton: how to refresh the page on the modal
//??? question: how to pass in a parameter variable to a partial

// Import the model to use its database functions.
var db = require("../models");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/", function(req, res) {
      res.render("index");
    });
 

  app.get("/home", function(req, res) {
    db.Swift.find({}).then(function(data) {
      var hbsObject = {
        swiftarticles: data
      };
      res.render("indexhome", hbsObject);
    });
  });

  app.get("/api/saved", function(req, res) {
    console.log("inside get /api/saved/");
    var notes = [];
    var swiftarticles = [];
    db.SavedArticles.find({})
    // Specify that we want to populate the retrieved users with any associated notes
    .populate("notes")
    .then(function(dbSavedArticle) {
      console.log("after database search for articles and notes");
       for (var i = 0; i < dbSavedArticle.length; i++) {
         console.log("inside saved articles for loop");
         console.log("dbsavedarticle: ",dbSavedArticle[i]);
         swiftarticles.push(dbSavedArticle[i]);
         notes.push(dbSavedArticle[i].notes);
       }
      console.log("swiftarticles: ", swiftarticles);
      console.log("notes: ", notes)
      res.render("indexsavedarticles", {swiftarticles: swiftarticles, notes: notes});
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  });

  app.put("/api/swiftarticles/", function(req, res) {
    var swiftarticle = req.body;
    console.log("swiftarticle object: ", swiftarticle)
    //if the article already exists, then don't save it, otherwise, save it
    db.SavedArticles.find({title: swiftarticle.title}).then(function(dbArticle) {
      console.log("outside new article found");
        if (dbArticle.length === 0) {
          console.log("inside new article found");
          //if there are no articles in the database, then...
          db.SavedArticles.find({}).then(function(dbArticles) {
            if (dbArticles.length === 0) {
              //then there are no saved articles in the database
              var hbsObject = {
                //swiftarticles: swiftarticle
              };
              //res.reload();
            }
          });
          //otherwise...it's a new article, go ahead and save it
          db.SavedArticles.create(swiftarticle).then(function(data) {
            var hbsObject = {
              swiftarticles: swiftarticle
            };
            res.render("index", hbsObject);
          });
        }
      });
      var hbsObject = {
        //swiftarticles: swiftarticle
      };
      //console.log("saved swift article: ", swiftarticle);
      //res.reload();
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
    console.log("scrape complete!");
    res.render("indexscraped");
  });
});


app.delete("/api/swiftnote/", function(req, res) {
  var noteid = req.body.id;
  console.log("noteid: ", noteid);
  var swiftarticletitle = req.body.title;
  console.log("article title: ", swiftarticletitle);
  //console.log("swiftarticle object: ", swiftarticle)
  //db.SavedArticles.updateOne({title: swiftarticletitle},{$pull: {_id: noteid}}, { multi: true })
  db.Note.deleteOne({_id: noteid})
  .then(function(data) {
    console.log("removed swift note from article: ", );
    //res.render("indexsavedarticles", hbsObject);
    //res.redirect("/api/saved/");
    res.render("indexsavedarticles", {notes: {_id:noteid}});
  });
});
// Route for saving a new Note to the db and associating it with a User
app.post("/submitnote", function(req, res) {
  console.log("req.body: ",req.body);
  console.log("articletitle: ",req.body.articletitle);
  // Create a new Note in the db
  db.Note.create({"title": "null", "body": req.body.body})
    .then(function(dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      console.log("dbNote: ", dbNote);
      console.log("articletitle: ",req.body.articletitle);
      return db.SavedArticles.findOneAndUpdate({title: req.body.articletitle}, {$push: { notes: dbNote._id } }, { new: true });
    }).then(function(data) {
        console.log("data: ",data);
        db.SavedArticles.find({}).then(function (data2) {
          var hbsObject = {
            swiftarticles: data2
          };
          //console.log("saved swift article: ", swiftarticle);
          //res.render("indexsavedarticles", {hbsObject,title:req.body.title, body: req.body.body});
          res.redirect("/api/saved/");
        });
        })
      // If the SavedArticle was updated successfully, send it back to the client
      //res.json(dbSavedArticle);
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