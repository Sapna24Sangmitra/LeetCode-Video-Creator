
import React, { useState } from 'react';
import { UserInput } from '../types';
import Button from './Button';
import TextArea from './TextArea';

interface InputScreenProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputScreen: React.FC<InputScreenProps> = ({ onSubmit, isLoading }) => {
  const [dayNumber, setDayNumber] = useState<string>('');
  const [problemStatement, setProblemStatement] = useState<string>('');
  const [solutionCode, setSolutionCode] = useState<string>('');
  const [explanationHints, setExplanationHints] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDayNumber = parseInt(dayNumber, 10);
    if (isNaN(parsedDayNumber) || parsedDayNumber <= 0) {
      alert("Please enter a valid LeetCode day number (e.g., a positive integer).");
      return;
    }
    if (!problemStatement.trim() || !solutionCode.trim()) {
      alert("Please fill in both the problem statement and your solution code.");
      return;
    }
    onSubmit({ 
      dayNumber: parsedDayNumber, 
      problemStatement, 
      solutionCode,
      explanationHints: explanationHints.trim() 
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl bg-gray-800/80 backdrop-blur-md p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-700/50">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-transparent bg-clip-text">
          LeetCode Gemini Explainer
        </h1>
        <p className="text-center text-gray-300 mb-10 text-base sm:text-lg leading-relaxed">
          Paste your LeetCode problem and solution. Gemini will craft a dynamic, narrated slideshow to break it all down for you!
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="dayNumber" className="block text-base font-medium text-gray-300 mb-2">
              LeetCode Day Number (1-100)
            </label>
            <input
              type="number"
              id="dayNumber"
              value={dayNumber}
              onChange={(e) => setDayNumber(e.target.value)}
              min="1"
              // max="100" // Optional: if you want to enforce a max based on "of 100"
              placeholder="e.g., 42"
              required
              disabled={isLoading}
              className="w-full p-3.5 bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-gray-700/70 transition-colors duration-150 ease-in-out"
            />
          </div>
          <TextArea
            id="problemStatement"
            label="LeetCode Problem Statement"
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="e.g., Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
            rows={6}
            required
            disabled={isLoading}
            className="text-base"
          />
          <TextArea
            id="solutionCode"
            label="Your Solution Code"
            value={solutionCode}
            onChange={(e) => setSolutionCode(e.target.value)}
            placeholder={`function twoSum(nums, target) {\n  // Your amazing code here\n};`}
            rows={10}
            required
            disabled={isLoading}
            className="font-fira-code text-sm sm:text-base"
          />
          <TextArea
            id="explanationHints"
            label="Optional Explanation Hints"
            value={explanationHints}
            onChange={(e) => setExplanationHints(e.target.value)}
            placeholder="e.g., Focus on time complexity, explain a specific variable, compare with brute force..."
            rows={3}
            disabled={isLoading}
            className="text-base"
          />
          <Button type="submit" className="w-full !py-3.5 text-lg" isLoading={isLoading}>
            {isLoading ? 'Generating Explanation...' : 'Craft My Explanation'}
          </Button>
        </form>
      </div>
       <footer className="mt-12 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} LeetCode Gemini Explainer. Powered by Google Gemini.</p>
        <p className="mt-1">Ensure your <code className="bg-gray-700/50 px-1.5 py-0.5 rounded-md font-fira-code text-xs">API_KEY</code> environment variable is set.</p>
      </footer>
    </div>
  );
};

export default InputScreen;