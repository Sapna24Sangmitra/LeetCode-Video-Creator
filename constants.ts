
import { SlideType } from './types';

export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
// Updated to the official model name from the Gemini TTS documentation.
export const GEMINI_TTS_MODEL_NAME = "gemini-2.5-flash-preview-tts";

export const SLIDE_ORDER: ReadonlyArray<SlideType> = [
  SlideType.INTRO,
  SlideType.PROBLEM_EXPLANATION,
  SlideType.USER_CODE,
  SlideType.SOLUTION_EXPLANATION,
  SlideType.OUTRO,
];

export const API_KEY_ERROR_MESSAGE = "API_KEY environment variable not set. Please ensure it is configured.";