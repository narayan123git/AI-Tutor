
import { GoogleGenAI, Type } from "@google/genai";
import { InteractionMode, TutorResponse } from '../types';

if (!import.meta.env.VITE_API_KEY) {
    throw new Error("VITE_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const systemInstruction = `
You are the core AI engine for a multi-feature AI Tutor website that serves as an all-in-one learning hub for school and college students.
Your primary goal is to generate interactive and educational content based on the user's request and selected interaction mode.
You MUST ALWAYS structure your responses in the specified JSON format. The frontend UI depends entirely on this structure to render content correctly.

Available Interaction Modes and Your Role:
- Explain: Teach concepts from basics to advanced with step-by-step explanations.
- Code: Generate full, runnable code with explanations, sample outputs, and possible improvements.
- Quiz: Create multiple-choice questions, fill-in-the-blank, and short answer quizzes with hints and answers.
- Flashcards: Output Q&A flashcards for memory practice.
- Exam: Provide quick revision sheets, formulas, mnemonics, and mock tests.
- Project: Suggest real-world projects with step-by-step implementation plans.
- Plan: Suggest a day-by-day or week-by-week learning plan.
- Map: Create text-based mind maps of a topic’s structure.

Style & Personality:
- Be encouraging, clear, and engaging.
- Adapt explanations for different levels (Beginner, Intermediate, Advanced) if specified.
- Use analogies, examples, and simple language.
- For long topics, end with a "Quick Recap" in a text block and suggest a "Next Topic" in the summary.

CRITICAL: Your entire output must be a single, valid JSON object that conforms to the provided schema. No extra text, no markdown formatting outside of the JSON.
`;

const mindMapNodeSchema: any = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        children: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    topic: { type: Type.STRING },
                    children: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                topic: { type: Type.STRING }
                            }
                        },
                        nullable: true,
                    }
                },
                nullable: true,
            }
        },
        nullable: true,
    }
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A concise and engaging title for the topic." },
        summary: { type: Type.STRING, description: "A brief, one-paragraph summary of the content." },
        content_blocks: {
            type: Type.ARRAY,
            description: "An array of different content blocks to be rendered.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "Type of content: 'text', 'code', 'quiz', 'flashcards', 'mindmap'." },
                    content: { type: Type.STRING, nullable: true, description: "Content for 'text' and 'code' blocks." },
                    language: { type: Type.STRING, nullable: true, description: "Programming language for 'code' blocks (e.g., 'python', 'javascript')." },
                    questions: {
                        type: Type.ARRAY,
                        nullable: true,
                        description: "An array of quiz questions for 'quiz' blocks.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                type: { type: Type.STRING, description: "'multiple-choice', 'fill-in-the-blank', 'short-answer'" },
                                options: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                                answer: { type: Type.STRING },
                                hint: { type: Type.STRING, nullable: true },
                            }
                        }
                    },
                    cards: {
                        type: Type.ARRAY,
                        nullable: true,
                        description: "An array of Q&A pairs for 'flashcards' blocks.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                answer: { type: Type.STRING },
                            }
                        }
                    },
                    nodes: {
                        type: Type.ARRAY,
                        nullable: true,
                        description: "An array of nodes for 'mindmap' blocks.",
                        items: mindMapNodeSchema,
                    }
                }
            }
        },
        extra: {
            type: Type.OBJECT,
            nullable: true,
            description: "Additional helpful information.",
            properties: {
                exam_tips: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                common_mistakes: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                real_world_applications: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
            }
        }
    }
};


export const getTutorResponse = async (userInput: string, mode: InteractionMode): Promise<TutorResponse> => {
    try {
        const prompt = `
Mode: ${mode}
Topic: ${userInput}

IMPORTANT:
Respond ONLY with a single valid JSON object matching the provided schema.
Do NOT include any extra text, explanations, or markdown outside of the JSON.
`;

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

        // Debug log in dev mode
        if (import.meta.env.DEV) {
            console.log("Raw AI Output:", jsonText);
        }

        // Remove any markdown fences if present
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/```[a-zA-Z]*\n?/, "").replace(/```$/, "");
        }

        // Attempt to fix common JSON formatting mistakes
        try {
            jsonText = jsonText
                .replace(/,\s*}/g, "}") // trailing commas in objects
                .replace(/,\s*]/g, "]"); // trailing commas in arrays
        } catch {
            // ignore — just best-effort cleanup
        }

        const data = JSON.parse(jsonText);

        // Strict validation
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

