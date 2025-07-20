import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw Error("Gemini Api key is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);
export const makeRequest = async (
  systemPrompt: string = "You are a helpful assistant.",
  prompt: string
  ): Promise<string | undefined> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = result.response;
    const text = await response.text();

    return text;
  } catch (error) {
    console.error("❌ Error:", error);
  }
};
