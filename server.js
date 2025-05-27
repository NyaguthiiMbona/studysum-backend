const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Replace this key with your own OpenRouter or Hugging Face key later
const configuration = new Configuration({
  apiKey: "EMPTY", // Demo key – replace with real one in production
  basePath: "https://openrouter.ai/api/v1 ",
});

const openai = new OpenAIApi(configuration);

app.post('/summarize', async (req, res) => {
  const { text, subject } = req.body;

  if (!text || !subject) {
    return res.status(400).json({ error: "Text and subject are required." });
  }

  try {
    let prompt = "";

    if (subject === "Biology" || subject === "Physics") {
      prompt = `Generate a bullet-point summary of this ${subject} lecture:\n\n${text}`;
    } else if (subject === "History") {
      prompt = `Chronological summary of this historical event:\n\n${text}`;
    } else if (subject === "Computer Science") {
      prompt = `Explain main concepts, code snippets, and logic:\n\n${text}`;
    } else if (subject === "Math") {
      prompt = `Explain formulas and problems clearly:\n\n${text}`;
    } else {
      prompt = `Create a structured summary in clear points:\n\nSubject: ${subject}\n\nTranscript:\n${text}`;
    }

    const response = await openai.createCompletion({
      model: "mistralai/mistral-7b-instruct:free", // Free model
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.5,
    });

    const summary = response.data.choices[0].text.trim();
    res.json({ summary });
  } catch (error) {
    console.error("Error summarizing:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
