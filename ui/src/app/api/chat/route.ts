import { streamText, StreamData, convertToCoreMessages } from "ai";
import { promises as fs } from "fs";
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({
    baseURL: `${process.env.OLLAMA_ENDPOINT}/api`,
});

export const POST = async function (req: Request) {
    const { messages } = await req.json();

    const data = new StreamData();

    const system = `You are a helpful computer science assistant. People will ask you questions about their software, and you give them nice, concise tips on how to fix/optimize their code. You always respond like Yoda would.`;

    const response = await streamText({
        model: ollama(process.env.LOAD_MODEL!),
        system,
        messages: convertToCoreMessages(messages),
        maxTokens: 1000,
        onFinish() {
            data.close();
        }
    });

    return response.toDataStreamResponse({ data });
}