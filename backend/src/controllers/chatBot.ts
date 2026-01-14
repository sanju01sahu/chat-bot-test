import { Request, Response } from "express";
import dotenv from "dotenv";
import { callReportPrompt, visitReportPrompt } from "../utils/prompts.js";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

dotenv.config(); // Load environment variables

// Initialize Bedrock client
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "ap-south-1", // change if needed
});

const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

export const generateCallReport = async (req: Request, res: Response) => {
  try {
    const callsData = (req as any).callsData;
    const {language} = req.body
    const prompt = `
      ${callReportPrompt}
      ${JSON.stringify(callsData)}
      The response should be in language: ${language}
    `;

    console.log(prompt)

    const command = new ConverseCommand({
      modelId: MODEL_ID,
      messages: [
        // { role: "assistant", content: [{ text: "You are a professional sales assistant." }] },
        { role: "user", content: [{ text: prompt }] },
      ],
      inferenceConfig: { maxTokens: 1024, temperature: 0.2 },
    });
    console.log(command)

    const response = await client.send(command);

    console.log(response);
    const outputText = response.output?.message?.content?.[0];

    // console.log(outputText);
    res.status(200).json(response.output?.message?.content?.[0].text);
  } catch (error) {
    console.error("Error generating call report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generateVisitReport = async (req: Request, res: Response) => {
  try {
    const visitsData = (req as any).visitsData;
    const {language} = req.body
    const prompt = `
      ${visitReportPrompt}
      ${JSON.stringify(visitsData)}
      The response should be in language: ${language}
    `;

    const command = new ConverseCommand({
      modelId: MODEL_ID,
      messages: [
        // { role: "assistant", content: [ {text: "You are a professional sales assistant." }] },
        { role: "user", content: [ {text: prompt }] },
      ],
      inferenceConfig: { maxTokens: 1024, temperature: 0.2 },
    });

    const response = await client.send(command);
    const outputText = response.output?.message?.content?.[0];

    // console.log(outputText);
    res.status(200).json(response.output?.message?.content?.[0].text);
  } catch (error) {
    console.error("Error generating visit report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};