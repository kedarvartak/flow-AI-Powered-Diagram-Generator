import { GoogleGenerativeAI } from "@google/generative-ai";
import { cacheService } from '../utils/cache';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const cleanMermaidCode = (response) => {
  // Remove code block markers and trim
  let cleaned = response
    .replace(/```mermaid\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  // Ensure proper line endings
  cleaned = cleaned.replace(/\r\n/g, '\n');
  
  // Remove any leading whitespace from each line
  cleaned = cleaned.split('\n')
    .map(line => line.trim())
    .join('\n');
    
  return cleaned;
};

const validateMermaidSyntax = (code, type) => {
  const typePatterns = {
    flowchart: /^flowchart\s+(LR|TD|BT|RL)/,
    sequence: /^sequenceDiagram/,
    erd: /^erDiagram/
  };

  const pattern = typePatterns[type];
  if (!pattern || !pattern.test(code)) {
    throw new Error(`Invalid ${type} diagram syntax`);
  }
  return true;
};

const getPromptTemplate = (type, text) => {
  const templates = {
    flowchart: `Create a Mermaid.js flowchart. Description: "${text}".
      Rules:
      1. Start with exactly 'flowchart LR' or 'flowchart TD'
      2. Use proper syntax: nodeId[Label] --> nodeId2[Label2]
      3. No markdown code blocks
      4. No extra text
      5. Return only valid Mermaid.js code`,
    sequence: `Create a Mermaid.js sequence diagram based on this description: "${text}".
      Requirements:
      - Start with 'sequenceDiagram'
      - Define all participants
      - Show clear message flows with arrows
      - Include activations where relevant
      - Add notes where helpful
      Output only the Mermaid.js code without any additional text or formatting.`,
    
    // ... other templates following same pattern
  };
  
  return templates[type] || templates.flowchart;
};

export const generateFlowchart = async (text, type = 'flowchart') => {
  try {
    const cacheKey = `${type}-${text}`;
    const cachedResult = cacheService.get(cacheKey);
    if (cachedResult) return cachedResult;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(getPromptTemplate(type, text));
    const response = result.response.text();
    
    const cleanedCode = cleanMermaidCode(response);
    validateMermaidSyntax(cleanedCode, type);
    
    cacheService.set(cacheKey, cleanedCode);
    return cleanedCode;
  } catch (error) {
    console.error('Error generating diagram:', error);
    throw new Error(`Failed to generate ${type} diagram: ${error.message}`);
  }
};