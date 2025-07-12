
import { SlideData } from '../types';
import { fixMermaidCode } from './geminiService';

// The Mermaid API is loaded globally from a script in index.html.
// We assert its type here for TypeScript.
declare const mermaid: {
    parse: (text: string) => Promise<boolean>;
};

/**
 * Validates a slide's Mermaid diagram. If invalid, it attempts to fix it using Gemini, with retries.
 * @param slide The slide data object to validate.
 * @returns A promise that resolves to the slide data, with corrected mermaidCode if applicable, or no code if unfixable.
 */
export const validateAndFixDiagram = async (slide: SlideData): Promise<SlideData> => {
    if (!slide.mermaidCode || slide.mermaidCode.trim() === '') {
        // No diagram to validate.
        return slide;
    }

    const MAX_FIX_ATTEMPTS = 2; // Try to fix it up to 2 times.
    let currentCode = slide.mermaidCode;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_FIX_ATTEMPTS; attempt++) {
        try {
            // Attempt to parse the current version of the code
            await mermaid.parse(currentCode);

            // If we are here, the code is valid.
            if (attempt > 0) {
                // This means a fix was successful.
                console.log(`Successfully fixed and validated Mermaid diagram on attempt ${attempt}.`);
                return { ...slide, mermaidCode: currentCode };
            } else {
                // This means the original code was already valid.
                return slide;
            }
        } catch (e) {
            lastError = e instanceof Error ? e : new Error(String(e));
            console.warn(`Mermaid validation attempt #${attempt + 1} failed for slide "${slide.title}". Error: ${lastError.message}`);

            if (attempt >= MAX_FIX_ATTEMPTS) {
                // We've used up all our attempts.
                break;
            }

            // If validation failed, try to get a fix from Gemini.
            try {
                console.log(`Attempting Gemini fix #${attempt + 1}...`);
                const context = `This diagram is for a slide titled "${slide.title}" which explains a code solution. The diagram should illustrate the solution's logic.`;
                const fixedCode = await fixMermaidCode(currentCode, lastError.message, context);
                
                // The new code for the next iteration of the loop
                currentCode = fixedCode; 
            } catch (fixerError) {
                // This is an error in the call to Gemini itself.
                console.error("Gemini failed during the fix attempt. Aborting fix process.", fixerError);
                // Since we can't fix it, remove the diagram to avoid showing an error.
                return { ...slide, mermaidCode: undefined };
            }
        }
    }

    // If the loop completes without returning, it means all fix attempts failed.
    console.error(`All ${MAX_FIX_ATTEMPTS} Gemini fix attempts resulted in invalid Mermaid code. Removing diagram from slide to prevent errors.`);
    return { ...slide, mermaidCode: undefined };
};
