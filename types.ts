
export enum SlideType {
  INTRO = "Intro: Problem Statement",
  PROBLEM_EXPLANATION = "Explanation of Problem",
  SOLUTION_EXPLANATION = "Explanation of Your Solution",
  USER_CODE = "Your Submitted Code",
  OUTRO = "Thank You & Next Steps"
}

export interface SlideData {
  type: SlideType;
  title: string;
  displayContent: string; // Visually concise content for the slide (e.g., bullet points, user code).
  audioText: string;      // Detailed, conversational narration script for TTS.
  mermaidCode?: string;   // Optional Mermaid diagram code for visualization.
  audioUrl?: string;      // Cached data URL for the generated audio.
}

export interface UserInput {
  dayNumber: number;
  problemStatement: string;
  solutionCode: string;
  explanationHints?: string; // Optional hints from the user
}

export type AppView = 'input' | 'slideshow';