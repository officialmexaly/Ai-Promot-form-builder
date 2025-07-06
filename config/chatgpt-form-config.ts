// config/chatgpt-form-config.ts
import { FormConfig } from '../types/form';

export const chatGPTFormConfig: FormConfig = {
  title: "ChatGPT Prompt Generator",
  description: "Generate optimized prompts with just your description and niche",
  submitText: "Generate Prompt",
  fields: [
    {
      name: "niche",
      label: "Niche/Industry",
      type: "select",
      required: true,
      options: [
        { value: "technology", label: "Technology & Software" },
        { value: "marketing", label: "Marketing & Sales" },
        { value: "business", label: "Business & Finance" },
        { value: "education", label: "Education & Training" },
        { value: "healthcare", label: "Healthcare & Medical" },
        { value: "creative", label: "Creative & Design" },
        { value: "content", label: "Content & Writing" },
        { value: "ecommerce", label: "E-commerce & Retail" },
        { value: "consulting", label: "Consulting & Services" },
        { value: "fitness", label: "Fitness & Wellness" },
        { value: "real-estate", label: "Real Estate" },
        { value: "legal", label: "Legal & Compliance" },
        { value: "food", label: "Food & Hospitality" },
        { value: "travel", label: "Travel & Tourism" },
        { value: "automotive", label: "Automotive" },
        { value: "entertainment", label: "Entertainment & Media" },
        { value: "other", label: "Other" }
      ],
      helpText: "Select your industry or area of focus"
    },
    {
      name: "description",
      label: "What do you want ChatGPT to help you with?",
      type: "textarea",
      required: true,
      rows: 4,
      placeholder: "Describe what you need help with. For example: 'Create a marketing email for my new product launch' or 'Help me write a blog post about sustainable living tips'",
      helpText: "Be as specific as possible about your request. The more details you provide, the better the generated prompt will be."
    }
  ]
};
