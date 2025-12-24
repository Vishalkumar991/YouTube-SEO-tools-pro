
import { GoogleGenAI } from "@google/genai";
import { AIModel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a 90-point deep analysis report for any YouTube tool.
 */
export const generateAIContent = async (
  toolId: string, 
  input: string, 
  options: Record<string, string> = {},
  model: AIModel = 'gemini-3-flash-preview'
) => {
  const optionsContext = Object.entries(options)
    .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
    .join(', ');

  const systemInstruction = `You are the "Project Ultra-Creator" AI. Your output MUST be a structured 90-point deep analysis report.
  
  MANDATORY STRUCTURE (90 POINTS TOTAL):
  - PHASE 1: STRATEGIC VISION (10 Points) - High-level conceptual direction.
  - PHASE 2: METADATA ENGINE (20 Points) - Titles, tags, and description technicals.
  - PHASE 3: AUDIENCE NEURAL TRIGGERS (20 Points) - Psychological hooks and retention loops.
  - PHASE 4: ALGORITHM SYNC (20 Points) - Search and discovery optimization specifics.
  - PHASE 5: PRODUCTION BLUEPRINT (20 Points) - Visuals, sound, and editing mandates.
  
  SETTINGS: ${optionsContext}.
  MANDATE: Every single point must be actionable data. No generic filler.`;

  const userPrompt = `Tool ID: ${toolId}. Input: "${input}". 
  Execute the 90-point deep neural audit now. Provide extremely high density information suitable for a top 0.1% YouTube creator.`;

  try {
    // Calling generateContent with model and contents directly as per guidelines.
    // Removed maxOutputTokens to prevent response truncation for detailed 90-point reports.
    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });
    return response.text || "Neural connection timeout. Re-initializing...";
  } catch (error) {
    console.error("Gemini Execution Error:", error);
    throw new Error("Neural overload. Please switch to FLASH model or wait 10 seconds.");
  }
};

/**
 * Generates an SEO-optimized blog guide for a specific tool.
 */
export const generateToolBlog = async (toolName: string, category: string) => {
  const systemInstruction = `You are a world-class SEO Content Strategist. Generate a 1500-word comprehensive guide (Blog) on how to use ${toolName} to dominate the YouTube Algorithm in 2025.
  
  BLOG STRUCTURE:
  - Viral Headline
  - Introduction: Why this tool is the "Secret Weapon" of 2025.
  - Section 1: Algorithmic Fundamentals.
  - Section 2: Step-by-Step Optimization Guide using ${toolName}.
  - Section 3: CTR vs Retention (Psychological analysis).
  - Section 4: Pro-Tips for "Search Stacking".
  - Conclusion: The roadmap to 1 Million Subscribers.
  
  Format in clean Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a massive SEO blog about "${toolName}" in the "${category}" niche.`,
      config: { systemInstruction },
    });
    return response.text;
  } catch (error) {
    return "Error generating blog. Please check your connection.";
  }
};
