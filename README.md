# LeetCode Gemini Explainer

## Description

LeetCode Gemini Explainer is an interactive React application that transforms LeetCode problem-solving into an engaging, educational experience. Users input their LeetCode problem statement and solution code, and the application generates a comprehensive slideshow presentation with AI-powered explanations and text-to-speech narration. The app leverages Google's Gemini AI to create step-by-step breakdowns of coding problems and solutions, complete with visual diagrams and audio explanations.

## File Structure and Descriptions

### Root Files
- **`App.tsx`** - Main application component managing state and view routing between input and slideshow screens
- **`index.tsx`** - React application entry point and DOM rendering
- **`index.html`** - HTML template with Mermaid.js and Tailwind CSS integration
- **`package.json`** - Project dependencies and npm scripts configuration
- **`tsconfig.json`** - TypeScript compiler configuration
- **`vite.config.ts`** - Vite build tool configuration
- **`types.ts`** - TypeScript type definitions for slides, user input, and application state
- **`constants.ts`** - Application constants including Gemini model names and API configurations
- **`metadata.json`** - Application metadata with name and description

### Components Directory
- **`InputScreen.tsx`** - Form interface for users to input LeetCode day number, problem statement, and solution code
- **`SlideshowScreen.tsx`** - Main slideshow presentation component with audio playback and navigation controls
- **`Slide.tsx`** - Individual slide component with formatted text rendering and Mermaid diagram display
- **`Button.tsx`** - Reusable styled button component with consistent theming
- **`TextArea.tsx`** - Reusable styled textarea component for multi-line input
- **`LoadingSpinner.tsx`** - Loading animation component with customizable text and sizing
- **`FloatingEmojisBackground.tsx`** - Animated background with floating emoji elements for visual appeal

### Services Directory
- **`geminiService.ts`** - Core AI service for generating slide content using Google Gemini API
- **`geminiClient.ts`** - Gemini API client configuration and initialization
- **`ttsService.ts`** - Text-to-speech service converting slide narration to audio using Gemini TTS
- **`diagramService.ts`** - Mermaid diagram validation and error correction service

### Hooks Directory
- **`useSpeechSynthesis.ts`** - Custom React hook for browser speech synthesis functionality

## Key Technologies and Components

### Frontend Technologies
- **React 19.1.0** - Modern UI framework with hooks and functional components
- **TypeScript 5.7.2** - Type-safe JavaScript development
- **Vite 6.2.0** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling

### AI and APIs
- **Google Gemini AI** - Content generation and text-to-speech services
- **@google/genai 1.6.0** - Official Google Generative AI SDK

### Visualization
- **Mermaid.js** - Diagram and flowchart generation for visual explanations
- **Custom formatting system** - Enhanced text rendering with emojis and color coding

### Audio
- **Gemini TTS** - AI-powered text-to-speech for slide narration
- **Web Audio API** - Browser-based audio playback and control

## Key Features

### 🎯 AI-Powered Explanations
- Automatic generation of comprehensive problem breakdowns
- Step-by-step solution analysis using advanced language models
- Context-aware explanations tailored to user's coding approach

### 🎙️ Voice Narration
- High-quality text-to-speech audio for each slide
- Seamless audio playback with slide transitions
- Natural, conversational AI-generated narration scripts

### 📊 Visual Diagrams
- Automatic Mermaid diagram generation for complex algorithms
- Visual flowcharts and process illustrations
- Intelligent diagram validation and error correction

### 🎨 Modern UI/UX
- Responsive design with glass-morphism effects
- Animated floating emoji background
- Smooth transitions and loading states
- Dark theme with purple/pink gradient accents

### 🔄 Interactive Slideshow
- Full slideshow navigation controls
- Audio playback synchronization
- Progress tracking and slide management
- Error handling with user-friendly messages

## Usage Pipeline

### 1. Environment Setup
```bash
# Set your Google Gemini API key as an environment variable
export API_KEY="your_gemini_api_key_here"

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Input Phase
1. **Launch the application** and navigate to the input screen
2. **Enter LeetCode day number** (1-100) to track your progress
3. **Paste the problem statement** from LeetCode
4. **Add your solution code** in any supported programming language
5. **Optionally provide explanation hints** for customized focus areas
6. **Submit the form** to begin AI processing

### 3. Processing Phase
The application performs several automated steps:
1. **Content Generation** - Gemini AI analyzes your input and creates slide content
2. **Diagram Validation** - Mermaid diagrams are generated and validated for syntax
3. **Audio Generation** - Text-to-speech audio is created for each slide
4. **Content Assembly** - All components are combined into a cohesive presentation

### 4. Presentation Phase
1. **Slideshow Display** - Navigate through 5 structured slides:
   - **Intro**: Problem statement introduction
   - **Problem Explanation**: Detailed problem breakdown with diagrams
   - **Your Code**: Display of submitted solution
   - **Solution Explanation**: Step-by-step code analysis
   - **Outro**: Summary and next steps
2. **Audio Playback** - Automatic narration with manual controls
3. **Navigation** - Previous/next slide controls and progress indicators
4. **Reset Option** - Return to input screen for new problems

### 5. Slide Structure
Each generated slideshow follows a consistent 5-slide format:
- **Slide 1 (Intro)**: Welcome and problem introduction
- **Slide 2 (Problem Explanation)**: Detailed problem analysis with visual aids
- **Slide 3 (User Code)**: Clean display of your submitted solution
- **Slide 4 (Solution Explanation)**: In-depth code walkthrough and logic explanation
- **Slide 5 (Outro)**: Encouragement and learning summary

This pipeline transforms static LeetCode problems into dynamic, educational presentations that enhance understanding through multiple learning modalities (visual, auditory, and textual).
