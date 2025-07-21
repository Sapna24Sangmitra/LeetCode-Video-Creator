
import React, { useState, useCallback } from 'react';
import { AppView, SlideData, UserInput } from './types';
import InputScreen from './components/InputScreen';
import SlideshowScreen from './components/SlideshowScreen';
import LoadingSpinner from './components/LoadingSpinner';
import { generateAllSlidesData } from './services/geminiService';
import { API_KEY_ERROR_MESSAGE, GEMINI_MODEL_NAME } from './constants';
import FloatingEmojisBackground from './components/FloatingEmojisBackground';
import { generateAudio } from './services/ttsService';
import { validateAndFixDiagram } from './services/diagramService';
import Button from './components/Button';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('input');
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleUserInputSubmit = useCallback(async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setSlides([]);
    setLoadingMessage("Initializing explanation...");

    try {
      // Phase 1: Generate all text and diagram content
      setLoadingMessage("Generating slide content from Gemini...");
      const textSlides = await generateAllSlidesData(data);
      
      // Phase 2: Validate and fix any broken Mermaid diagrams
      setLoadingMessage("Validating diagrams...");
      const validatedSlidesPromises = textSlides.map(slide => validateAndFixDiagram(slide));
      const validatedSlides = await Promise.all(validatedSlidesPromises);

      // Phase 3: Generate audio for each slide sequentially and cache it
      const slidesWithAudio: SlideData[] = [];
      for (let i = 0; i < validatedSlides.length; i++) {
        const slide = validatedSlides[i];
        setLoadingMessage(`Generating audio for slide ${i + 1} of ${validatedSlides.length}...`);
        
        try {
          const audioUrl = await generateAudio(slide.audioText);
          slidesWithAudio.push({ ...slide, audioUrl });
        } catch (audioError) {
           console.error(`Failed to generate audio for slide ${i + 1}:`, audioError);
           // Add slide with an error marker or just the text; the slideshow will handle the missing URL.
           slidesWithAudio.push({ ...slide });
        }
      }

      setSlides(slidesWithAudio);
      setCurrentView('slideshow');
    } catch (err: unknown) {
      console.error("Error generating slideshow:", err);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (err instanceof Error) {
        if (err.message.includes("API_KEY")) {
            errorMessage = API_KEY_ERROR_MESSAGE + "\nPlease ensure it is correctly configured in your environment and refresh the page.";
        } else if (err.message.includes("404") && err.message.includes("NOT_FOUND")) {
            errorMessage = `An Error Occurred: 404 Not Found\n\nThis typically means the AI model specified in 'constants.ts' ('${GEMINI_MODEL_NAME}') is either incorrect, deprecated, or your API key does not have permission to use it.\n\nTroubleshooting Steps:\n1. Verify the 'GEMINI_MODEL_NAME' in 'src/constants.ts' is correct.\n2. Ensure your Google Cloud project has the 'Generative Language API' or 'Vertex AI API' enabled.\n3. Confirm your API key is valid and has access to the specified model.`;
        } else {
            errorMessage = `Failed to call the Gemini API. Please try again.\n\nFull Error Details:\n${err.message}`;
        }
      }
      setError(errorMessage);
      setCurrentView('input'); 
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleReset = useCallback(() => {
    setCurrentView('input');
    setSlides([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const renderContent = () => {
    if (isLoading) { 
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
          <LoadingSpinner text={loadingMessage || "Generating your personalized LeetCode explanation..."} size="lg"/>
          <p className="mt-6 text-xl text-yellow-300 font-medium">Communicating with Gemini...</p>
          <p className="mt-2 text-sm text-yellow-400">Please wait, this can take up to a minute.</p>
        </div>
      );
    }
    
    if (error && currentView === 'input') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-indigo-950 p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-red-700/50">
            <h2 className="text-3xl font-bold text-red-500 mb-4">An Error Occurred</h2>
            <div className="bg-red-900/20 p-4 rounded-lg text-left my-6">
              <pre className="text-sm text-red-200 whitespace-pre-wrap font-fira-code">
                <code>{error}</code>
              </pre>
            </div>
            <Button onClick={handleReset}>
              Try Again
            </Button>
            <p className="mt-6 text-sm text-yellow-500">If the issue persists, check your browser's developer console for more details.</p>
          </div>
        </div>
      );
    }

    if (currentView === 'input' && !isLoading && !error) {
      return <InputScreen onSubmit={handleUserInputSubmit} isLoading={isLoading} />;
    }
    if (currentView === 'slideshow' && slides.length > 0) {
      return <SlideshowScreen slides={slides} onReset={handleReset} />;
    }
    return null; // Should not happen in normal flow
  };

  return (
    <div className="App relative min-h-screen">
      <FloatingEmojisBackground />
      <main className="relative z-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
