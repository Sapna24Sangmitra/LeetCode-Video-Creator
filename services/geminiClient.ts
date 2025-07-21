import { GoogleGenAI } from "@google/genai";
import { API_KEY_ERROR_MESSAGE } from '../constants';

let ai: GoogleGenAI | null = null;

/**
 * Initializes and returns a singleton instance of the GoogleGenAI client.
 * Throws an error if the API_KEY environment variable is not set.
 */
export const getGeminiClient = (): GoogleGenAI => {
  if (ai) {
    return ai;
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error(API_KEY_ERROR_MESSAGE);
    throw new Error(API_KEY_ERROR_MESSAGE);
  }

  ai = new GoogleGenAI({ apiKey });
  return ai;
};
