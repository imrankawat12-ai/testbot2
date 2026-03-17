import OpenAI from "openai";

// Initialize OpenAI client.
// process.env.OPENAI_API_KEY is used automatically by the OpenAI SDK if present.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = "You are a helpful AI assistant that answers questions using the provided knowledge base. Always give clear and helpful answers.";

export async function generateChatResponse(messages, knowledgeContext) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      message: "Configuration Error: OPENAI_API_KEY is not set.",
    };
  }

  // Construct the system prompt with the dynamically fetched context
  const fullSystemMessage = `${SYSTEM_PROMPT}\n\n--- KNOWLEDGE BASE ---\n${knowledgeContext || "No specific knowledge base context was retrieved."}\n----------------------`;

  // Prepare the conversation history for OpenAI
  const apiMessages = [
    { role: "system", content: fullSystemMessage },
    ...messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using a fast, standard model suitable for most chat tasks
      messages: apiMessages,
      temperature: 0.3, // Lower temperature to keep responses grounded in the KB
    });

    return {
      success: true,
      message: response.choices[0].message.content,
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      success: false,
      message: "I'm sorry, I encountered an error while communicating with the AI service.",
      error: error.message,
    };
  }
}
