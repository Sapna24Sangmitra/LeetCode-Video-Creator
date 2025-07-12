
import React, { useState, useCallback } from 'react';
import { AppView, SlideData, UserInput } from './types';
import InputScreen from './components/InputScreen';
import SlideshowScreen from './components/SlideshowScreen';
import LoadingSpinner from './components/LoadingSpinner';
import { generateAllSlidesData } from './services/geminiService';
import { API_KEY_ERROR_MESSAGE } from './constants';
import FloatingEmojisBackground from './components/FloatingEmojisBackground';
import { generateAudio } from './services/ttsService';
import { validateAndFixDiagram } from './services/diagramService';

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
      let errorMessage = "Failed to generate slideshow. Please try again.";
      if (err instanceof Error) {
        if (err.message.includes("API_KEY")) {
            errorMessage = API_KEY_ERROR_MESSAGE + " Please set it up and refresh.";
        } else {
            errorMessage = `Failed to call the Gemini API. Please try again.\nDetails: ${err.message}`;
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
          <p className="mt-6 text-xl text-purple-300 font-medium">Communicating with Gemini...</p>
          <p className="mt-2 text-sm text-gray-400">Please wait, this can take up to a minute.</p>
        </div>
      );
    }
    
    if (error && currentView === 'input') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 text-center">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full">
            <h2 className="text-3xl font-bold text-red-500 mb-6">An Error Occurred</h2>
            <p className="text-lg text-gray-300 mb-8 whitespace-pre-line">{error}</p>
            <button 
              onClick={handleReset} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150"
            >
              Try Again
            </button>
            <p className="mt-6 text-sm text-gray-400">If the issue persists, ensure your <code className="bg-gray-700 px-1.5 py-0.5 rounded-md font-fira-code">API_KEY</code> is correctly set.</p>
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
    <div className="App relative min-h-screen bg-gray-900">
      <FloatingEmojisBackground />
      <main className="relative z-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
