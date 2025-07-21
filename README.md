# LeetCode Gemini Explainer

## Description

LeetCode Gemini Explainer is an innovative React application that transforms LeetCode problem-solving into an engaging, educational experience. Users input their LeetCode problem statement and solution code, and the application generates a comprehensive slideshow presentation with AI-powered explanations and text-to-speech narration. The app leverages Google's Gemini AI to create step-by-step breakdowns of coding problems and solutions, complete with interactive visual diagrams and audio explanations.

## File Structure and Descriptions

### Root Files
- **`App.tsx`** - Main application component managing state transitions between input and slideshow screens
- **`index.tsx`** - React application entry point with DOM rendering setup
- **`index.html`** - HTML template integrating Mermaid.js for diagrams and Tailwind CSS for styling
- **`package.json`** - Project dependencies including React, TypeScript, Vite, and Google Generative AI
- **`tsconfig.json`** - TypeScript compiler configuration with modern ES modules support
- **`vite.config.ts`** - Vite build tool configuration for fast development and optimized production builds
- **`types.ts`** - TypeScript interfaces and enums for slide data, user input, and application state
- **`constants.ts`** - Configuration constants including Gemini model names and API settings
- **`metadata.json`** - Application metadata containing project name and description
- **`.env.local`** - Environment variables file for storing the Gemini API key
- **`.gitignore`** - Git ignore file specifying files and directories to exclude from version control

### Components Directory (`/components`)
- **`InputScreen.tsx`** - User interface form for inputting LeetCode day number, problem statement, and solution code
- **`SlideshowScreen.tsx`** - Main slideshow presentation component with audio playback, navigation controls, and slide management
- **`Slide.tsx`** - Individual slide component with formatted text rendering, emoji support, and Mermaid diagram display
- **`Button.tsx`** - Reusable styled button component with consistent theming and hover effects
- **`TextArea.tsx`** - Reusable styled textarea component for multi-line text input with proper styling
- **`LoadingSpinner.tsx`** - Animated loading component with customizable text and sizing options
- **`FloatingEmojisBackground.tsx`** - Animated background component with floating emoji elements for visual appeal

### Services Directory (`/services`)
- **`geminiService.ts`** - Core AI service handling slide content generation using Google Gemini API with sophisticated prompting
- **`geminiClient.ts`** - Gemini API client configuration and initialization with error handling
- **`ttsService.ts`** - Text-to-speech service converting slide narration to audio using Gemini TTS capabilities
- **`diagramService.ts`** - Mermaid diagram validation and automatic error correction service with retry logic

### Hooks Directory (`/hooks`)
- **`useSpeechSynthesis.ts`** - Custom React hook providing browser speech synthesis functionality as fallback

## Key Technologies and Components

### Frontend Framework
- **React 19.1.0** - Modern UI framework with hooks, functional components, and concurrent features
- **TypeScript 5.7.2** - Type-safe JavaScript development with advanced typing features
- **Vite 6.2.0** - Next-generation frontend tooling with fast HMR and optimized builds

### Styling and UI
- **Tailwind CSS** - Utility-first CSS framework for rapid styling and responsive design
- **Custom CSS animations** - Smooth transitions, loading states, and floating background elements
- **Glass-morphism effects** - Modern UI design with backdrop blur and transparency

### AI and Machine Learning
- **Google Gemini AI** - Advanced language model for content generation and explanation
- **@google/genai 1.6.0** - Official Google Generative AI SDK for seamless API integration
- **Intelligent prompting** - Sophisticated prompt engineering for consistent, educational content

### Visualization and Diagrams
- **Mermaid.js** - Dynamic diagram and flowchart generation for algorithm visualization
- **Custom text formatting** - Enhanced rendering with emoji support and color coding
- **Automatic diagram validation** - Error detection and correction for robust diagram display

### Audio Processing
- **Gemini TTS** - AI-powered text-to-speech for natural-sounding slide narration
- **Web Audio API** - Browser-based audio playback with controls and buffering
- **Audio caching** - Efficient audio data management for smooth playback

## Key Features

### 🤖 AI-Powered Content Generation
- **Intelligent Problem Analysis** - Automatic breakdown of LeetCode problems with context understanding
- **Solution Explanation** - Step-by-step code analysis tailored to user's specific implementation
- **Adaptive Content** - Explanations adjust based on problem complexity and user-provided hints
- **Multi-modal Output** - Generates both visual content and audio narration for comprehensive learning

### 🎙️ Professional Voice Narration
- **High-Quality TTS** - Gemini-powered text-to-speech with natural prosody and pacing
- **Synchronized Playback** - Audio automatically plays with slide transitions for seamless experience
- **Conversational Tone** - AI-generated scripts sound like friendly, knowledgeable tutors
- **Audio Controls** - Full playback controls with pause, resume, and manual navigation

### 📊 Interactive Visual Diagrams
- **Automatic Diagram Generation** - Mermaid flowcharts and graphs created based on algorithm logic
- **Smart Validation** - Built-in diagram syntax checking with automatic error correction
- **Algorithm Visualization** - Complex data structures and processes illustrated clearly
- **Responsive Design** - Diagrams adapt to different screen sizes and orientations

### 🎨 Modern User Experience
- **Intuitive Interface** - Clean, modern design with glass-morphism effects and smooth animations
- **Responsive Layout** - Optimized for desktop, tablet, and mobile viewing
- **Loading States** - Engaging loading animations with progress indicators and status messages
- **Error Handling** - User-friendly error messages with actionable solutions

### 📚 Structured Learning Pipeline
- **5-Slide Format** - Consistent presentation structure for optimal learning flow
- **Progress Tracking** - Visual indicators showing current slide and overall progress
- **Easy Navigation** - Intuitive controls for moving between slides and sections
- **Session Management** - Ability to reset and start new explanations seamlessly

## Usage Pipeline

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/Sapna24Sangmitra/LeetCode-Video-Creator.git
cd leetcode-gemini-explainer

# Install dependencies
npm install

# Set up your Gemini API key in .env.local
echo "API_KEY=your_gemini_api_key_here" > .env.local

# Start the development server
npm run dev
```

### 2. Input Phase
1. **Access the Application** - Navigate to `http://localhost:5173` in your browser
2. **Enter Problem Details**:
   - **Day Number**: Input your LeetCode challenge day (1-100) for progress tracking
   - **Problem Statement**: Copy and paste the complete problem description from LeetCode
   - **Solution Code**: Add your working solution in any programming language
   - **Explanation Hints** (Optional): Specify particular aspects you want emphasized
3. **Validation** - The form automatically validates inputs before submission
4. **Submit** - Click the generate button to begin AI processing

### 3. AI Processing Phase
The application performs several sophisticated operations:

1. **Content Generation** (15-30 seconds)
   - Gemini AI analyzes your problem and solution
   - Generates structured content for 5 different slide types
   - Creates both visual bullet points and detailed narration scripts

2. **Diagram Creation and Validation** (5-10 seconds)
   - Automatically generates Mermaid diagrams for complex algorithms
   - Validates diagram syntax and fixes errors using AI
   - Ensures all visual elements render correctly

3. **Audio Generation** (20-40 seconds)
   - Converts narration scripts to high-quality speech
   - Processes each slide's audio independently
   - Caches audio data for immediate playback

### 4. Interactive Slideshow Experience
Navigate through a professionally structured 5-slide presentation:

**Slide 1: Introduction**
- Welcome message with problem context
- Sets the stage for the learning session
- Introduces the specific LeetCode challenge

**Slide 2: Problem Explanation**
- Detailed breakdown of the problem requirements
- Visual diagrams illustrating key concepts
- Examples and edge cases clarification

**Slide 3: Your Solution Code**
- Clean, syntax-highlighted display of your submitted code
- Preparation for the detailed explanation to follow

**Slide 4: Solution Analysis**
- Step-by-step walkthrough of your implementation
- Algorithm complexity analysis
- Visual flowcharts showing execution flow

**Slide 5: Conclusion**
- Summary of key learning points
- Encouragement and next steps
- Connection to broader programming concepts

### 5. Controls and Navigation
- **Audio Playback**: Automatic narration with manual pause/resume controls
- **Slide Navigation**: Previous/Next buttons with keyboard shortcuts
- **Progress Tracking**: Visual progress bar and slide counter
- **Reset Functionality**: Easy return to input screen for new problems
- **Error Recovery**: Graceful handling of audio or content generation failures

### 6. Learning Benefits
- **Multi-Sensory Learning**: Combines visual, auditory, and textual information
- **Personalized Content**: Explanations tailored to your specific code implementation
- **Professional Presentation**: Structured like educational videos for optimal retention
- **Self-Paced Learning**: Full control over playback speed and navigation
- **Comprehensive Coverage**: From problem understanding to solution mastery

This pipeline transforms static LeetCode practice into dynamic, engaging educational content that enhances understanding through AI-powered explanations and professional presentation formats.
