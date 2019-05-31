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

     // Get the modal
 var modal = document.getElementsByClassName("articlenotesmodal");

 // Get the button that opens the modal
 var btn = document.getElementsByClassName("articlenotes");

 // Get the <span> element that closes the modal
 var span = document.getElementsByClassName("close")[0];

 for (var j = 0; j < btn.length; j++) {
 // When the user clicks the button, open the modal 
 btn[j].onclick = function() {
   for (var i = 0; i < modal.length; i++) {
   modal[i].style.display = "block";
    }
      var title = $(this).data("title");
      var summary = $(this).data("summary");
      var text = $(this).data("text");
  
      var newArticle = {
        title: title,
        summary: summary,
        text: text
      };
      console.log(newArticle);
  }
}

 // When the user clicks on <span> (x), close the modal
 span.onclick = function() {
  for (var i = 0; i < modal.length; i++) {
   modal[i].style.display = "none";
  }
 }

 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
    for (var i = 0; i < modal.length; i++) {
      if (event.target == modal[i]) {
     modal[i].style.display = "none";
    }
   }
 }

  });
  