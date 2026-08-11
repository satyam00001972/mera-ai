const express = require("express");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 10000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {

  try {

    const messages = req.body.messages;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid messages"
      });
    }

    const response =
      await client.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
              "आप Mera AI हैं। उपयोगकर्ता जिस भाषा में सवाल पूछे, उसी भाषा में सरल और उपयोगी जवाब दें।"
          },
          ...messages.slice(-20)
        ]

      });

    const answer =
      response.choices[0].message.content;

    res.json({
      answer: answer
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI से जवाब प्राप्त नहीं हो पाया।"
    });

  }

});

app.listen(PORT, () => {

  console.log(
    `Mera AI server running on port ${PORT}`
  );

});
