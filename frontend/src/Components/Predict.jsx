const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: `Extract nutritional values for this staple provide a detailed breakdown of the nutritional content. Include information such as the calorie count, vitamins and minerals, fiber content, and any other relevant nutritional information. \n\nStaple:{staple}\n\nAnswer Only This\n\nCalories:  \n\nCarbohydrates: \n\nFiber:  \n\nProtein:  \n\nFat:  \n\nCalcium:  \n\nIron:  \n##\n`,
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
});

console.log(response);
