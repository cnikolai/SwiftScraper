var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var SwiftSchema = new Schema({
  title: String,
  summary: String,
  text: String
});

// This creates our model from the above schema, using mongoose's model method
var Swift = mongoose.model("Swift", SwiftSchema);

// Export the Swift model
module.exports = Swift;
