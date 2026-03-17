import OpenAI from "openai";

// OpenAI Configuration
const MODEL_NAME = "gpt-4o-mini"; 

// Initialize OpenAI client lazily to handle missing keys during build
let openai;
function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!openai && apiKey) {
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openai;
}

const SYSTEM_PROMPT = "You are a helpful AI assistant that answers questions using the provided knowledge base. Always give clear and helpful answers.";

/**
 * Generates a response using OpenAI's GPT models
 */
export async function generateChatResponse(messages, knowledgeContext) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      message: "Configuration Error: OPENAI_API_KEY is not set in Environment Variables.",
    };
  }

  const client = getClient();

  // Construct the system prompt with context
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
      model: MODEL_NAME,
      messages: apiMessages,
      temperature: 0.3,
    });

    return {
      success: true,
      message: response.choices[0].message.content,
    };
  } catch (error) {
    console.error("OpenAI API Error details:", error);
    return {
      success: false,
      message: `OpenAI Error: ${error.message || "Unknown error"}`,
      error: error.toString(),
    };
  }
}
