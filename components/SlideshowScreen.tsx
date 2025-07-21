import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SlideData } from '../types';
import Slide from './Slide';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

interface SlideshowScreenProps {
  slides: SlideData[];
  onReset: () => void;
}

const SlideshowScreen: React.FC<SlideshowScreenProps> = ({ slides, onReset }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [audioState, setAudioState] = useState<{
    isPlaying: boolean;
    isPaused: boolean;
    error: string | null;
  }>({
    isPlaying: false,
    isPaused: false,
    error: null,
  });

  const currentSlide = slides[currentSlideIndex];

  const advanceToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => {
      if (prevIndex < slides.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  }, [slides.length]);
  
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    setAudioState({ isPlaying: false, isPaused: false, error: null });

    if (currentSlide?.audioUrl) {
      audioEl.src = currentSlide.audioUrl;
      audioEl.play().then(() => {
        setAudioState({ isPlaying: true, isPaused: false, error: null });
      }).catch(e => {
        console.error("Audio playback failed:", e);
        setAudioState({ isPlaying: false, isPaused: false, error: "Playback failed." });
      });
    } else if (currentSlide?.audioText) {
      // Audio was expected but failed to generate/load.
      setAudioState({ isPlaying: false, isPaused: false, error: "Audio failed to load." });
    }
    
    return () => {
        if(audioEl) audioEl.pause();
    }
  }, [currentSlide]);

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };
  
  const handleTogglePause = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (audioState.error && currentSlide?.audioUrl) {
      audioEl.play().then(() => setAudioState({ isPlaying: true, isPaused: false, error: null }))
        .catch(e => setAudioState({ isPlaying: false, isPaused: false, error: "Playback failed."}));
      return;
    }

    if (!currentSlide?.audioUrl) return;

    if (audioState.isPlaying) {
      audioEl.pause();
      setAudioState(s => ({...s, isPlaying: false, isPaused: true }));
    } else {
      audioEl.play().catch(e => {
        console.error("Audio resume failed:", e);
        setAudioState(s => ({...s, error: "Playback failed."}));
      });
      setAudioState(s => ({...s, isPlaying: true, isPaused: false }));
    }
  };

  const handleAudioEnded = () => {
    setAudioState(s => ({...s, isPlaying: false, isPaused: false}));
    if (currentSlideIndex < slides.length - 1) {
        advanceToNextSlide();
    }
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner text="Preparing slides..." />
        <Button onClick={onReset} variant="secondary" className="mt-8 !py-2 !px-4 !text-sm">
          Back to Input
        </Button>
      </div>
    );
  }
  
  if (!currentSlide) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-indigo-950 p-8 rounded-xl shadow-2xl text-center">
          <p className="text-xl text-red-400 mb-6">Error: Could not load slide data.</p>
          <Button onClick={onReset} variant="secondary" className="!py-2 !px-4 !text-sm">
            Back to Input
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentSlideIndex + 1) / slides.length) * 100;

  const getPlayButtonContent = () => {
      if (audioState.isPlaying) return 'Pause';
      if (audioState.isPaused) return 'Resume';
      if (audioState.error) return 'Retry Audio';
      if (!currentSlide?.audioUrl) return 'No Audio';
      return 'Play';
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4">
      <audio ref={audioRef} onEnded={handleAudioEnded} />

      <div className="w-full bg-indigo-700/50 h-1.5 fixed top-0 left-0 z-50 shadow-lg">
        <div
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1.5 transition-all duration-300 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Main Content Area: Vertical Card */}
      <div className="w-full max-w-md aspect-[9/16] bg-indigo-950/50 rounded-2xl shadow-2xl overflow-hidden border border-indigo-700/50">
          <Slide slide={currentSlide} />
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-md mt-6 px-2">
        <div className="flex justify-between items-center w-full">
            <p className="text-sm text-yellow-400 font-medium">
                Slide {currentSlideIndex + 1} / {slides.length}
            </p>
            {audioState.error && <span className="text-sm text-red-400 font-medium">{audioState.error}</span>}
        </div>

        <div className="flex justify-center items-center space-x-4 mt-4">
          <Button 
            onClick={handlePrevSlide} 
            disabled={currentSlideIndex === 0} 
            variant="secondary" 
            className="w-1/4"
            aria-label="Previous Slide"
          >
            Prev
          </Button>
          <Button 
            onClick={handleTogglePause} 
            variant="primary" 
            disabled={!currentSlide?.audioUrl && !audioState.error}
            className="w-1/2"
            aria-label={getPlayButtonContent()}
          >
            {getPlayButtonContent()}
          </Button>
          {currentSlideIndex === slides.length - 1 ? (
            <Button 
              onClick={onReset} 
              variant="secondary"
              className="w-1/4 bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 !text-indigo-950"
              aria-label="Start Over"
            >
              Finish
            </Button>
          ) : (
            <Button 
              onClick={handleNextSlide} 
              disabled={currentSlideIndex === slides.length - 1}
              variant="secondary"
              className="w-1/4"
              aria-label="Next Slide"
            >
              Next
            </Button>
          )}
        </div>
         <div className="text-center mt-6">
            <Button onClick={onReset} variant="secondary" className="!bg-transparent !text-yellow-400 hover:!bg-indigo-700 !shadow-none !py-2 !px-4">
              Start Over
            </Button>
         </div>
      </div>
    </div>
  );
};

export default SlideshowScreen;