
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-purple-500`}></div>
      {text && <p className="text-purple-400 text-lg">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
    