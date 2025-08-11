// services/tutorService.ts
import { InteractionMode, TutorResponse } from "../types";

export const getTutorResponse = async (
  userInput: string,
  mode: InteractionMode
): Promise<TutorResponse> => {
  try {
    const response = await fetch("/.netlify/functions/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, topic: userInput }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Basic validation
    if (!data.title || !data.summary || !Array.isArray(data.content_blocks)) {
      throw new Error("Invalid response format from AI.");
    }

    return data as TutorResponse;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};
