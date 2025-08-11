// api/tutor.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { mode, topic } = req.body;

    if (!mode || !topic) {
      return res.status(400).json({ error: "Mode and topic are required" });
    }

    const prompt = `Mode: ${mode}\nTopic: ${topic}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const aiResponse = await model.generateContent(prompt);

    const text = aiResponse.response.text();

    // You can parse/format text here to match your frontend schema

    res.status(200).json({
      title: `AI Tutor - ${topic}`,
      summary: `Here is your ${mode} explanation for ${topic}`,
      content_blocks: [
        {
          type: "text",
          content: text,
        },
      ],
    });
  } catch (error) {
    console.error("AI Tutor API error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
