const mongoose = require("mongoose");

// Define schema
const ImageSchema = new mongoose.Schema({
  imageUrl: String,
  prompt: String,
});

// Create model
const ImageModel = mongoose.model("ImageModel", ImageSchema);

// Export model
module.exports = ImageModel;
