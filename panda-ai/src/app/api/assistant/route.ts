import { NextResponse } from "next/server";

type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

const defaultReply = (assistantName: string, message: string) =>
  `${assistantName} here! I heard: “${message}”. Connect your OpenAI or Gemini key in the environment to unlock full AI responses.`;

export async function POST(request: Request) {
  try {
    const { message, history, assistantName } = (await request.json()) as {
      message: string;
      history: ChatHistoryItem[];
      assistantName: string;
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: defaultReply(assistantName, message) });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are ${assistantName}, a joyful panda-themed personal voice assistant. 
Use a friendly tone, encourage healthy digital habits, and ask follow-up questions when helpful.
Keep replies concise (≈120 words) and reference the user's name if provided.`,
          },
          ...history.map((entry) => ({
            role: entry.role,
            content: entry.content,
          })),
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error:", error);
      return NextResponse.json(
        {
          reply:
            "Panda AI could not reach the model. Double-check your API key or model permissions.",
        },
        { status: 500 },
      );
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };

    const reply = data.choices?.[0]?.message?.content ?? defaultReply(assistantName, message);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        reply:
          "Panda AI ran into an unexpected error. Please try again shortly or review your API credentials.",
      },
      { status: 500 },
    );
  }
}
