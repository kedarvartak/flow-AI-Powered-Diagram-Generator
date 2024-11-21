import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const generateFlowchart = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const systemPrompt = `You are a flowchart generator. Generate a properly formatted Mermaid flowchart with these rules:
      1. Start with 'graph TD'
      2. Each node and connection MUST be on a new line
      3. Use proper syntax:
         - Regular nodes: A[Text without special characters]
         - Decision nodes: B{Question without special characters?}
         - Connections: A --> B
         - Conditional paths: A -->|condition| B
      4. Avoid using parentheses () in node text
      5. Use simple alphanumeric characters for node text
      6. Keep node names short and descriptive
      
      Example of correct formatting:
      graph TD
        A[Start] --> B{Decision}
        B -->|yes| C[Process]
        B -->|no| D[Alternative]
        C --> E[End]
        D --> E[End]

      Return ONLY the clean Mermaid code with proper line breaks.`;

    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let code = response.text()
      .replace(/```mermaid\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    // Clean up the code
    code = code.split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => {
        // Remove parentheses and special characters from node text
        return line.replace(/\((.*?)\)/g, '')
                  .replace(/[^\w\s\[\]{}>|-]/g, '');
      })
      .join('\n');
    
    // Ensure proper line break after graph TD
    if (!code.startsWith('graph TD\n')) {
      code = 'graph TD\n' + code;
    }
    
    return code;
  } catch (error) {
    console.error('Error generating flowchart:', error);
    throw error;
  }
}; 