import { getKnowledgeBaseContext } from "../../utils/knowledgeBase";
import { generateChatResponse } from "../../utils/openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Invalid message array" });
    }

    // 1. Retrieve knowledge base context
    const docId = process.env.GOOGLE_DOC_ID;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const knowledgeContext = await getKnowledgeBaseContext(docId, sheetId);

    // 2. Fetch AI response
    const aiResponse = await generateChatResponse(messages, knowledgeContext);

    if (!aiResponse.success) {
      return res.status(500).json({ message: aiResponse.message, error: aiResponse.error });
    }

    // 3. Return response to frontend
    return res.status(200).json({ reply: aiResponse.message });
  } catch (error) {
    console.error("API Route Error:", error);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
}
