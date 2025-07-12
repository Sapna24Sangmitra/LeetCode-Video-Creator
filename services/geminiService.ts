
import { GenerateContentResponse } from "@google/genai";
import { SlideData, SlideType, UserInput } from '../types';
import { GEMINI_MODEL_NAME, API_KEY_ERROR_MESSAGE, SLIDE_ORDER } from '../constants';
import { getGeminiClient } from './geminiClient';

interface GeminiSlideContent {
  displayContent: string;
  audioText: string;
  mermaidCode?: string;
}

const generateSlideContent = async (
  slideType: SlideType,
  userInput: UserInput
): Promise<GeminiSlideContent> => {
  const gemini = getGeminiClient();
  let promptSpecifics = "";

  const systemInstruction = `You are an expert LeetCode problem explainer and a master of Mermaid diagrams, creating content for a video-style slideshow.
You MUST ensure any Mermaid code you generate is syntactically correct and will parse without errors.
The user may provide optional hints or specific points they want to see covered in the explanation (labelled as "User-provided hints"). You should try to incorporate these hints naturally if provided and relevant to the current slide's purpose.
For each request, you MUST return a JSON object with properties: "displayContent" (string), "audioText" (string), and optionally "mermaidCode" (string).

1.  "displayContent": Generate *extremely* concise key points or bullet points (target 2-3 items, each very short, like 1-5 words per point). Each point should be on a new line. This text is for visual display on the slide.
    *   Use these simple formatting hints SPARINGLY for emphasis. Do NOT overdo it.
    *   ` + "`**Important Text**`" + `: Renders as bold and highlighted (e.g., yellow text).
    *   ` + "`EMOJI[💡] Text line with an idea.`" + `: Prepends the specified emoji. Choose relevant emojis.
    *   ` + "`COLOR[colorName] Text line in specified color.`" + ` Supported colors: 'purple', 'pink', 'yellow', 'green', 'blue'.
    *   Example for a line: ` + "`EMOJI[🚀] COLOR[green] **Launch Sequence**`" + `
    *   If no special formatting, just plain text for the line. Do NOT use other markdown.

2.  "audioText": Generate a *shorter, simpler, and crisper* narration script (target 20-30 seconds of speech). This script should elaborate *briefly* on the 'displayContent', use simple language, be direct, and sound like a friendly human presenter. Avoid jargon or explain it very simply. Do NOT use markdown.

3.  "mermaidCode": (Optional) If a visual diagram would significantly aid understanding (especially for Problem Explanation and Solution Explanation slides), provide **VALID** Mermaid diagram code for a simple flowchart, graph, or sequence diagram. Keep it concise and directly relevant. Example: "graph TD; A-->B;". If not applicable, make "mermaidCode" an empty string or omit the field.

Example JSON response format:
{
  "displayContent": "EMOJI[🌟] **Key Concept**\\nCOLOR[blue] Short detail\\nAnother point",
  "audioText": "This is a brief, simple, and conversational explanation...",
  "mermaidCode": "graph TD; Start --> Step1; Step1 --> End;"
}

Ensure the JSON is valid.`;

  let userHintsSegment = "";
  if (userInput.explanationHints && userInput.explanationHints.trim() !== "") {
    userHintsSegment = `\n\nUser-provided hints to consider for this explanation: "${userInput.explanationHints}"`;
  }

  switch (slideType) {
    case SlideType.INTRO:
      promptSpecifics = `Generate content for an INTRODUCTORY slide for the LeetCode problem: "${userInput.problemStatement}".
      The slide title will be "Leetcode Day ${userInput.dayNumber} of 100 Problem (Easy)".
      "displayContent" should be 2-3 very short key phrases using the formatting hints, relevant to an introduction.
      "audioText" should be a *brief and engaging* welcome.
      "mermaidCode" should be an empty string or omitted for this slide type.`;
      break;
    case SlideType.PROBLEM_EXPLANATION:
      promptSpecifics = `Generate content for a PROBLEM EXPLANATION slide for: "${userInput.problemStatement}".${userHintsSegment}
      "displayContent" should list 2-3 *very concise* critical aspects using formatting hints for clarity.
      "audioText" should *concisely and simply* explain the problem statement.
      "mermaidCode": Provide a simple, VALID Mermaid diagram if it aids understanding. If not applicable, use an empty string.`;
      break;
    case SlideType.USER_CODE:
      promptSpecifics = `The user has submitted their code, and it will be displayed on this slide. The *next* slide will explain this code.
      For THIS slide (showing the code), "displayContent" should be an empty string (code will be inserted manually).
      "audioText" should be a brief transitional sentence to introduce the code and set up the next slide. (e.g., "EMOJI[💻] Here is the solution code. On the next slide, we'll break down exactly how it works.").
      "mermaidCode" should be an empty string or omitted.`;
      break;
    case SlideType.SOLUTION_EXPLANATION:
      promptSpecifics = `Generate content for a SOLUTION EXPLANATION slide. The previous slide just showed the user's code. Now, explain that code. Problem: "${userInput.problemStatement}". User's solution for context:
      \`\`\`
      ${userInput.solutionCode}
      \`\`\`
      ${userHintsSegment}
      "displayContent" should be 2-3 *very concise* bullet points on the solution's strategy, using formatting hints.
      "audioText" should explain the provided solution code *simply and step-by-step, focusing on the core logic, as if you are continuing the presentation from the previous slide*.
      "mermaidCode": Provide a simple, VALID Mermaid flowchart illustrating the core logic of the user's solution. If not applicable, use an empty string.`;
      break;
    case SlideType.OUTRO:
      promptSpecifics = `Generate content for an OUTRO slide.
      "displayContent" should be 1-2 short, motivational phrases using formatting hints.
      "audioText" should be a *brief, friendly, and encouraging* conclusion.
      "mermaidCode" should be an empty string or omitted.`;
      break;
    default:
      throw new Error(`Unknown slide type: ${slideType}`);
  }

  try {
    const response: GenerateContentResponse = await gemini.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: promptSpecifics,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsed: Partial<GeminiSlideContent> = JSON.parse(jsonStr);

    if (typeof parsed.displayContent !== 'string' || typeof parsed.audioText !== 'string') {
        throw new Error("Invalid JSON structure: 'displayContent' or 'audioText' missing or not a string.");
    }
    
    const result: GeminiSlideContent = {
        displayContent: parsed.displayContent,
        audioText: parsed.audioText,
        mermaidCode: typeof parsed.mermaidCode === 'string' ? parsed.mermaidCode : undefined,
    };

    if (slideType === SlideType.USER_CODE) {
      result.displayContent = userInput.solutionCode; 
      result.audioText = result.audioText || "Here is your submitted code. We'll discuss it next.";
    }
    
    if (slideType === SlideType.INTRO || slideType === SlideType.USER_CODE || slideType === SlideType.OUTRO) {
        if (!result.mermaidCode || result.mermaidCode.trim() === "") {
             result.mermaidCode = ''; // Ensure truly empty for slides not needing it
        }
    }

    return result;

  } catch (error) {
    console.error(`Error generating content for slide ${slideType}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred with the AI API.";
    // Propagate a user-friendly error state up to the caller
    throw new Error(`Failed to generate content for slide "${slideType}". Reason: ${errorMessage}`);
  }
};


export const generateAllSlidesData = async (userInput: UserInput): Promise<SlideData[]> => {
  const slidePromises = SLIDE_ORDER.map(async (slideType) => {
    const { displayContent, audioText, mermaidCode } = await generateSlideContent(slideType, userInput);
    let title = slideType as string;
    if (slideType === SlideType.INTRO) {
      title = `Leetcode Day ${userInput.dayNumber} of 100 Problem (Easy)`;
    }
    return {
      type: slideType,
      title: title,
      displayContent,
      audioText,
      mermaidCode: mermaidCode && mermaidCode.trim() !== "" ? mermaidCode : undefined,
    };
  });

  return Promise.all(slidePromises);
};

/**
 * Asks Gemini to fix a broken Mermaid diagram.
 * @param brokenCode The syntactically incorrect Mermaid code.
 * @param errorMessage The error message produced by the Mermaid parser.
 * @param context The original textual context for the diagram.
 * @returns A promise that resolves to the corrected Mermaid code.
 */
export const fixMermaidCode = async (
  brokenCode: string,
  errorMessage: string,
  context: string
): Promise<string> => {
    const gemini = getGeminiClient();
    const prompt = `
The following Mermaid diagram code, intended to illustrate "${context}", is syntactically incorrect.
It failed with the error: "${errorMessage}".

Please analyze the faulty code, understand its original intent, and provide a corrected version that is syntactically valid.
Return ONLY the raw, corrected Mermaid code block. Do not include any explanations, apologies, or markdown formatting like \`\`\`mermaid.

Faulty Code:
---
${brokenCode}
---

Corrected Mermaid Code:`;

    try {
        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: prompt,
        });

        let fixedCode = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = fixedCode.match(fenceRegex);
        if (match && match[2]) {
          fixedCode = match[2].trim();
        }
        return fixedCode;
    } catch (error) {
        console.error("Gemini failed during the fix attempt:", error);
        throw new Error("The AI failed to correct the diagram code.");
    }
};