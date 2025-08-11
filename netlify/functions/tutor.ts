// api/tutor.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("Received request:", req.method, req.body);

    if (req.method !== 'POST') {
      console.log("Invalid method:", req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { mode, topic } = req.body;

    if (!mode || !topic) {
      console.log("Missing mode or topic");
      return res.status(400).json({ error: 'Mode and topic are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY environment variable is missing!");
      return res.status(500).json({ error: 'Server environment variable GEMINI_API_KEY is not set' });
    }

    const prompt = `Mode: ${mode}\nTopic: ${topic}`;
    console.log("Prompt for AI:", prompt);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const aiResponse = await model.generateContent(prompt);
    const text = aiResponse.response.text();

    console.log("AI response text:", text);

    return res.status(200).json({
      title: `AI Tutor - ${topic}`,
      summary: `Here is your ${mode} explanation for ${topic}`,
      content_blocks: [
        {
          type: 'text',
          content: text,
        },
      ],
    });

  } catch (error) {
    console.error("AI Tutor API error:", error);
    return res.status(500).json({ error: 'Something went wrong.', detail: error instanceof Error ? error.message : error });
  }
}
