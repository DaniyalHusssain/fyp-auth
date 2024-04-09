const { model } = require("mongoose");
const OpenAi = require("openai");
const openai = new OpenAi({
  apiKey: "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",
});

const image_generator = async () => {
  const response = await openai.images.generate({
    // model: "dalle-e-2",
    prompt: "A lion ",
    n: 1,
    size: "256x256",
  });
  console.log(response);
};

image_generator();
