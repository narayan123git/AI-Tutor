import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const handler: Handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const { mode, topic } = JSON.parse(event.body || "{}");

    if (!mode || !topic) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Mode and topic are required" }),
      };
    }

    const prompt = `Mode: ${mode}\nTopic: ${topic}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const aiResponse = await model.generateContent(prompt);

    const text = aiResponse.response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({
        title: `AI Tutor - ${topic}`,
        summary: `Here is your ${mode} explanation for ${topic}`,
        content_blocks: [
          {
            type: "text",
            content: text,
          },
        ],
      }),
    };
  } catch (error) {
    console.error("AI Tutor API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong." }),
    };
  }
};
