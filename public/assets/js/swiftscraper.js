// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
    $(".button").on("click", function(event) {
      console.log("inside save article button click");
      var id = "1";
      var title = $(this).data("title");
      var summary = $(this).data("summary");
      var text = $(this).data("text");
  
      var newArticle = {
        title: title,
        summary: summary,
        text: text
      };
  
      // Send the PUT request.
      $.ajax("/api/swiftarticles/", {
        type: "PUT",
        data: newArticle
      }).then(
        function() {
          console.log("inserted new article to saved articles ", id);
          // Reload the page to get the updated list
          location.reload();
        }
      );
    });

    $(".deletebutton").on("click", function(event) {
      console.log("inside delete article button click");
      var id = "1";
      var title = $(this).data("title");
      var summary = $(this).data("summary");
      var text = $(this).data("text");
  
      var newArticle = {
        title: title,
        summary: summary,
        text: text
      };
  
      // Send the PUT request.
      $.ajax("/api/swiftarticles/", {
        type: "DELETE",
        data: newArticle
      }).then(
        function() {
          console.log("Deleted article from saved articles ", id);
          // Reload the page to get the updated list
          location.reload();
        }
      );
    });
  });
  