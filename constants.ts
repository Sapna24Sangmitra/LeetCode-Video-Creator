
import { SlideType } from './types';

// Use the official, stable model name for text generation. This should resolve "404 Not Found" errors if the API key has access to it.
export const GEMINI_MODEL_NAME = "gemini-2.5-flash"; 

// The Text-to-Speech (TTS) feature via `responseModalities` is not supported with the gemini-2.5-flash model.
// The previous preview model with this capability is deprecated.
// Setting this to an empty string to gracefully disable audio generation until a supported model is available.
export const GEMINI_TTS_MODEL_NAME = "gemini-2.5-flash-preview-tts";

export const SLIDE_ORDER: ReadonlyArray<SlideType> = [
  SlideType.INTRO,
  SlideType.PROBLEM_EXPLANATION,
  SlideType.USER_CODE,
  SlideType.SOLUTION_EXPLANATION,
  SlideType.OUTRO,
];

export const API_KEY_ERROR_MESSAGE = "API_KEY environment variable not set. Please ensure it is configured.";
