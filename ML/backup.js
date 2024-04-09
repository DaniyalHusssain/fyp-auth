// controller.js
const OpenAi = require("openai");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/your_database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Define a schema for storing generated images
const ImageSchema = new mongoose.Schema({
  imageUrl: String,
  prompt: String,
});

const ImageModel = mongoose.model("Image", ImageSchema);

// Initialize OpenAI client
const openai = new OpenAi({
  apiKey: "ai key",
});

// Controller function to generate image from text
const generateImage = async (prompt) => {
  try {
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "256x256",
    });

    // Assuming response contains image URL
    const imageUrl = response.images[0].url;

    // Save the generated image to MongoDB
    const newImage = new ImageModel({
      imageUrl: imageUrl,
      prompt: prompt,
    });

    await newImage.save();

    console.log("Image generated and saved:", imageUrl);
  } catch (error) {
    console.error("Error generating image:", error);
  }
};

module.exports = generateImage;
