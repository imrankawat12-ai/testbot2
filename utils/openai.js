// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyB0OvTBPGU3CU6WT0E_WgI7fc2OwlEsgZU";
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash"; 

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

  // Ensure model name doesn't have accidental "models/" prefix twice
  const cleanModelName = MODEL_NAME.startsWith("models/") ? MODEL_NAME.split("/")[1] : MODEL_NAME;

  // Construct the prompt with context
  const contextHeader = knowledgeContext 
    ? `KNOWLEDGE BASE CONTEXT:\n${knowledgeContext}\n\n` 
    : "No specific knowledge base context was provided.\n\n";
  
  const prompt = `${SYSTEM_PROMPT}\n\n${contextHeader}User Query: ${messages[messages.length - 1].content}`;

  const contents = [
    {
      parts: [{ text: prompt }]
    }
  ];

  try {
    // Switching to v1 stable endpoint
    const url = `https://generativelanguage.googleapis.com/v1/models/${cleanModelName}:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If v1 fails, it might be a model availability issue or account restriction
      throw new Error(data.error?.message || `API Error (${response.status})`);
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
