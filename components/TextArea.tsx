import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, id, className, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-base font-medium text-yellow-300 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        className={`
          w-full p-3.5 bg-indigo-800/50 border border-indigo-600 
          rounded-lg shadow-sm 
          text-yellow-200 placeholder-yellow-500/70 
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
          focus:bg-indigo-800/70
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