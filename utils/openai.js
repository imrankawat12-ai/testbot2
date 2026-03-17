import OpenAI from "openai";

// OpenAI Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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";
const MODEL_NAME = "gpt-4o-mini"; 

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const SYSTEM_PROMPT = "You are a helpful AI assistant that answers questions using the provided knowledge base. Always give clear and helpful answers.";

/**
 * Generates a response using OpenAI's GPT models
 */
export async function generateChatResponse(messages, knowledgeContext) {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      message: "Configuration Error: OPENAI_API_KEY is not set.",
    };
  }

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
    const response = await openai.chat.completions.create({
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
