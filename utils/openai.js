// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyB0OvTBPGU3CU6WT0E_WgI7fc2OwlEsgZU";
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash"; // Default model

const SYSTEM_PROMPT = "You are a helpful AI assistant that answers questions using the provided knowledge base. Always give clear and helpful answers.";

/**
 * Generates a response using Google's Gemini API
 */
export async function generateChatResponse(messages, knowledgeContext) {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      message: "Configuration Error: GEMINI_API_KEY is not set.",
    };
  }

  // Construct the prompt with context
  const contextHeader = knowledgeContext 
    ? `KNOWLEDGE BASE CONTEXT:\n${knowledgeContext}\n\n` 
    : "No specific knowledge base context was provided.\n\n";
  
  const prompt = `${SYSTEM_PROMPT}\n\n${contextHeader}User Query: ${messages[messages.length - 1].content}`;

  // Prepare Gemini conversation format
  // Note: For simplicity in this demo, we send the key context + latest message. 
  // Gemini's generateContent expects 'contents' array.
  const contents = [
    {
      parts: [{ text: prompt }]
    }
  ];

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

    return {
      success: true,
      message: aiText,
    };
  } catch (error) {
    console.error("Gemini API Error details:", error);
    return {
      success: false,
      message: `Gemini Error: ${error.message || "Unknown error"}`,
      error: error.toString(),
    };
  }
}
