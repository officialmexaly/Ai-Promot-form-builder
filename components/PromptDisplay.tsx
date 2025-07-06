// components/PromptDisplay.tsx
import React from 'react';

interface PromptDisplayProps {
  prompt: string;
  onCopy: () => void;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, onCopy }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Generated ChatGPT Prompt</h3>
        <button
          onClick={onCopy}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Copy to Clipboard
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
          {prompt}
        </pre>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for using this prompt:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Copy and paste this entire prompt into ChatGPT</li>
          <li>• You can modify any part of the prompt before sending</li>
          <li>• For better results, be specific about your requirements</li>
          <li>• Follow up with clarifying questions if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default PromptDisplay;