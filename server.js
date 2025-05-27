const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require('body-parser');

const app = express();

// ✅ Add CORS headers for all requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(bodyParser.json());

// 🧠 Connect to OpenRouter.ai
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "EMPTY",
  basePath: "https://openrouter.ai/api/v1 ",
});

const openai = new OpenAIApi(configuration);

// 🔁 Summary endpoint
app.post('/summarize', async (req, res) => {
  const { text, subject } = req.body;

  if (!text || !subject) {
    return res.status(400).json({ error: "Text and subject are required." });
  }

  try {
    let prompt = "";

    // 🎯 Subject-based prompts
    if (subject === "Biology" || subject === "Physics") {
      prompt = `Generate a bullet-point summary of this ${subject} lecture:\n\n${text}`;
    } else if (subject === "History") {
      prompt = `Chronological summary of historical event:\n\n${text}`;
    } else if (subject === "Computer Science") {
      prompt = `Explain the main concepts and code references from this CS lecture:\n\n${text}`;
    } else if (subject === "Math") {
      prompt = `Explain formulas and solutions clearly:\n\n${text}`;
    } else {
      prompt = `Create a structured summary of this ${subject} transcript:\n\n${text}`;
    }

    const response = await openai.createCompletion({
      model: "mistralai/mistral-7b-instruct:free",
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.5
    });

    const summary = response.data.choices[0].text.trim();
    res.json({ summary });
  } catch (error) {
    console.error("Error summarizing:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
