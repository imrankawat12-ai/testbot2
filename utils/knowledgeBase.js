export async function getKnowledgeBaseContext(docId, sheetId) {
  let context = "";

  // 1. Fetch Google Doc context if ID is provided
  if (docId) {
    try {
      const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        context += `--- GOOGLE DOC CONTENT ---\n${text}\n\n`;
      } else {
        console.warn(`Failed to fetch Google Doc (${docId}): ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching Google Doc:", error);
    }
  }

  // 2. Fetch Google Sheet context if ID is provided
  if (sheetId) {
    try {
      // Fetching the first sheet as CSV
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      const response = await fetch(url);
      if (response.ok) {
        const csv = await response.text();
        context += `--- GOOGLE SHEET CONTENT (CSV) ---\n${csv}\n\n`;
      } else {
        console.warn(`Failed to fetch Google Sheet (${sheetId}): ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching Google Sheet:", error);
    }
  }

  return context.trim() || "No knowledge base context available.";
}
