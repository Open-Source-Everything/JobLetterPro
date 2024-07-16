import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { env } from "@/env";

const client = new OpenAIClient(
  env.AZURE_OPENAI_URL,
  new AzureKeyCredential(env.AZURE_OPENAI_KEY),
);

export const getAzureGPTQuery = async (question: string) => {
  const deploymentId = env.AZURE_OPENAI_DEPLOYMENT_ID;
  const messages = [{ role: "user", content: question }];
  const data = await client.getChatCompletions(deploymentId, messages);
  return data?.choices[0]?.message?.content ?? "Oops Something Went Wrong";
};
