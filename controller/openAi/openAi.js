const OpenAi = require("openai");
const ImageModel = require("../../models/ImageSchem");
require("dotenv").config();

console.log(process.env.apidalle);
const openai = new OpenAi({
  apiKey: process.env.apidalle,
});

module.exports.textToImageGen = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "256x256",
    });

    // Check if the response contains the expected data structure
    if (!response.data || response.data.length === 0 || !response.data[0].url) {
      throw new Error("No images generated or response format incorrect");
    }

    // Extract the image URL
    const imageUrl = response.data[0].url;

    const newImage = new ImageModel({
      imageUrl: imageUrl,
      prompt: prompt,
    });

    await newImage.save();

    res.status(200).json({ message: imageUrl });
  } catch (error) {
    console.error(error); // Log the error for further investigation
    res.status(500).json({ message: error.message });
  }
};
