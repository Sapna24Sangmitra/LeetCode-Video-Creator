import React, { useEffect, useRef } from 'react';
import { SlideData, SlideType } from '../types';

// @ts-ignore
const mermaidAPI = window.mermaid;

interface SlideProps {
  slide: SlideData;
}

const renderFormattedLine = (line: string, lineIndex: number): JSX.Element => {
  let currentLine = line;
  let emojiSpan: JSX.Element | null = null;
  let textColorClass = 'text-yellow-200'; // Default

  const emojiMatch = currentLine.match(/^EMOJI\[(.+?)\]\s*(.*)/);
  if (emojiMatch) {
    emojiSpan = <span className="mr-2">{emojiMatch[1]}</span>;
    currentLine = emojiMatch[2];
  }

  const colorMatch = currentLine.match(/^COLOR\[(purple|pink|yellow|green|blue)\]\s*(.*)/i);
  if (colorMatch) {
    const color = colorMatch[1].toLowerCase();
    const colorMap: { [key: string]: string } = {
      purple: 'text-indigo-300',
      pink: 'text-orange-400',
      yellow: 'text-yellow-300',
      green: 'text-green-400',
      blue: 'text-cyan-400',
    };
    textColorClass = colorMap[color] || textColorClass;
    currentLine = colorMatch[2];
  }

  const parts = currentLine.split(/(\*\*.*?\*\*)/g).filter(part => part);

  return (
    <p key={lineIndex} className={`opacity-90 ${textColorClass} transition-colors duration-300`}>
      {emojiSpan}
      {parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIndex} className="font-semibold text-yellow-300">
              {part.substring(2, part.length - 2)}
            </strong>
          );
        }
        return <span key={partIndex}>{part}</span>;
      })}
    </p>
  );
};


const Slide: React.FC<SlideProps> = ({ slide }) => {
  const contentParts = slide.displayContent.split('\n').filter(part => part.trim() !== '');
  const mermaidContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slide.mermaidCode && mermaidContainerRef.current && mermaidAPI) {
      mermaidContainerRef.current.innerHTML = ''; 
      const pre = document.createElement('pre');
      pre.className = 'mermaid';
      pre.textContent = slide.mermaidCode;
      mermaidContainerRef.current.appendChild(pre);
      
      try {
        mermaidAPI.run({
          nodes: [pre],
        });
      } catch (e) {
        console.error("Mermaid rendering error:", e);
        if (mermaidContainerRef.current) {
            mermaidContainerRef.current.innerHTML = `<div class="p-4 bg-red-900/50 rounded-md"><p class="text-red-300 font-medium">Error rendering diagram.</p><pre class="text-xs text-red-200/70 mt-2 font-fira-code">${slide.mermaidCode}</pre></div>`;
        }
      }
    } else if (mermaidContainerRef.current) {
      mermaidContainerRef.current.innerHTML = '';
    }
  }, [slide.mermaidCode, slide.title, slide.type]);

  const hasDiagram = !!slide.mermaidCode;

  return (
    <div className="w-full h-full flex flex-col animate-fadeIn overflow-hidden p-4 sm:p-5">
      <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 text-center text-wrap flex-shrink-0">
        {slide.title}
      </h2>
      
      {/* min-h-0 is a flexbox trick to make overflow scrolling work correctly in a flex child */}
      <div className="flex-1 w-full flex flex-col items-stretch overflow-hidden gap-4 min-h-0">
        
        {/* Text/Code Container */}
        <div 
          className={`
            w-full
            ${hasDiagram && slide.type !== SlideType.USER_CODE ? 'flex-shrink' : 'flex-1 min-h-0'} 
            overflow-y-auto custom-scrollbar
            ${!hasDiagram ? 'flex flex-col justify-center' : ''}
          `}
        >
          {slide.type === SlideType.USER_CODE ? (
            <div className="w-full h-full bg-indigo-950/80 p-3 sm:p-4 rounded-lg shadow-inner overflow-auto custom-scrollbar border border-indigo-700">
              <pre className="text-left text-sm text-yellow-200 whitespace-pre-wrap font-fira-code leading-relaxed">
                <code>{slide.displayContent}</code>
              </pre>
            </div>
          ) : (
             <div className="text-base sm:text-lg leading-relaxed space-y-3 prose prose-invert max-w-none text-center p-2">
              {contentParts.length > 0 ? (
                contentParts.map((part, index) => renderFormattedLine(part, index))
              ) : (
                <p className="italic text-yellow-400/70">No display content available for this slide.</p> 
              )}
            </div>
          )}
        </div>

        {/* Diagram Container */}
        {hasDiagram && (
          // flex-1 ensures it takes up remaining vertical space. min-h-0 helps with flex sizing.
          // items-center and justify-center will center the diagram container.
          <div className="w-full flex-1 flex items-center justify-center border-t border-indigo-700/50 pt-4 min-h-0">
            <div 
              ref={mermaidContainerRef} 
              className="w-full h-full flex items-center justify-center"
              aria-label="Diagram related to slide content"
            >
              {/* Mermaid will render here. The SVG inside is styled globally to scale. */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slide;