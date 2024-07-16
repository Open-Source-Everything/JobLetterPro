import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: "",
});
export const getGroqApi = async (inputString: string) => {
  const { text } = await generateText({
    model: groq("llama3-8b-8192"),
    prompt: inputString,
  });
  return text;
};