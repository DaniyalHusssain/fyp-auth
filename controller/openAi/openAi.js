const OpenAi = require("openai");
const ImageModel = require("../../models/ImageSchem");

const openai = new OpenAi({
  // apiKey: "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",
});

module.exports.textToImageGen = async (req, res) => {
  const { prompt } = req.body;

  try {
    response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "256x256",
    });

    const imageUrl = response.images[0].url;

    const newImage = new ImageModel({
      imageUrl: imageUrl,
      prompt: prompt,
    });

    await newImage.save();

    res.status(200).json({ message: imageUrl });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
