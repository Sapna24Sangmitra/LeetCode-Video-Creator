import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, id, className, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-base font-medium text-gray-300 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        className={`
          w-full p-3.5 bg-gray-700/50 border border-gray-600 
          rounded-lg shadow-sm 
          text-gray-200 placeholder-gray-500 
          focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
          focus:bg-gray-700/70
          transition-colors duration-150 ease-in-out 
          resize-y min-h-[150px] 
          ${className || ''}
        `}
        {...props}
      />
    </div>
  );
};

export default TextArea;