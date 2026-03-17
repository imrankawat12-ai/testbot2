let openai;

function getClient() {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!openai && apiKey) {
    openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://github.com/imrankawat12-ai/ai-chatbot-demo",
        "X-Title": "AI Chatbot Demo",
      }
    });
  }
  return openai;
}

const SYSTEM_PROMPT = "You are a helpful AI assistant that answers questions using the provided knowledge base. Always give clear and helpful answers.";

export async function generateChatResponse(messages, knowledgeContext) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const modelName = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"; 

  if (!apiKey) {
    return {
      success: false,
      message: "Configuration Error: API Key is not set in Vercel Environment Variables.",
    };
  }

  const client = getClient();
  if (!client) {
    return {
      success: false,
      message: "Failed to initialize AI client. Check your API key.",
    };
  }

  // Construct the system prompt with the dynamically fetched context
  const fullSystemMessage = `${SYSTEM_PROMPT}\n\n--- KNOWLEDGE BASE ---\n${knowledgeContext || "No specific knowledge base context was retrieved."}\n----------------------`;

  // Prepare the conversation history
  const apiMessages = [
    { role: "system", content: fullSystemMessage },
    ...messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
  ];

  try {
    const response = await client.chat.completions.create({
      model: modelName,
      messages: apiMessages,
      temperature: 0.3,
    });

    return {
      success: true,
      message: response.choices[0].message.content,
    };
  } catch (error) {
    console.error("AI API Error:", error);
    return {
      success: false,
      message: "I'm sorry, I encountered an error while communicating with the AI service.",
      error: error.message,
    };
  }
}
