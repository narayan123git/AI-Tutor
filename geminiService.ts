// services/tutorService.ts
import { InteractionMode, TutorResponse } from "../types";

export const getTutorResponse = async (userInput: string, mode: InteractionMode): Promise<TutorResponse> => {
  try {
    const prompt = `Mode: ${mode}\nTopic: ${userInput}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    let jsonText = response.text.trim();

    // Remove markdown code fences if present
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```[a-z]*\n?/, "").replace(/```$/, "");
    }

    // Fix common trailing commas to avoid JSON parse errors
    jsonText = jsonText.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

    const data = JSON.parse(jsonText);

    // Basic validation
    if (!data.title || !data.summary || !Array.isArray(data.content_blocks)) {
      throw new Error("Invalid response format from AI.");
    }

    return data as TutorResponse;

  } catch (error) {
    console.error("Error fetching or parsing AI response:", error);
    const err = error as Error;
    throw new Error(`Failed to get response from AI Tutor. ${err.message}`);
  }
};
