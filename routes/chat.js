import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

router.post("/", async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
            error: "Messages array is required"
        });
    }

    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        const formattedMessages = messages.map(msg => ({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content
        }));

        // ✅ Add system prompt to control response style
        const systemMessage = {
            role: "system",
            content: `You are a helpful and friendly AI assistant named NexaChat. 
      Keep your responses concise, clear and conversational. 
      Do NOT use markdown formatting like **bold**, ##headers, or bullet points with *.
      Reply in plain simple with diagram.
      Keep answers short unless the user asks for detailed explanation.`
        };

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [systemMessage, ...formattedMessages], // ✅ System prompt first
            max_tokens: 500
        });

        res.json({
            message: response.choices[0].message.content
        });

    } catch (error) {
        console.error("Groq Error:", error);
        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

export default router;