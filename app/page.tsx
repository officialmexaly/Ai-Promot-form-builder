"use client"

import React, { useState } from 'react';
import PromptFormGenerator from '../components/PromptFormGenerator';
import PromptDisplay from '../components/PromptDisplay';
import { chatGPTFormConfig } from '../config/chatgpt-form-config';
import { generateChatGPTPrompt } from '../utils/prompt-generator';
import { FormData } from '../types/form';

const ChatGPTPromptGenerator: React.FC = () => {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const handleFormSubmit = (formData: FormData) => {
    const prompt = generateChatGPTPrompt(formData);
    setGeneratedPrompt(prompt);
    setShowPrompt(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('Prompt copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PromptFormGenerator 
        formConfig={chatGPTFormConfig} 
        onSubmit={handleFormSubmit}
      />
      
      {showPrompt && (
        <PromptDisplay 
          prompt={generatedPrompt}
          onCopy={handleCopyToClipboard}
        />
      )}
    </div>
  );
};

export default ChatGPTPromptGenerator;