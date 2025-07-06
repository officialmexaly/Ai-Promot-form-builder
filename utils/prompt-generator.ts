// utils/prompt-generator.ts
import { FormData } from '../types/form';

export const generateChatGPTPrompt = (data: FormData): string => {
  // Niche-specific role mapping
  const nicheRoleMap: Record<string, string> = {
    technology: "an experienced technology expert and software professional",
    marketing: "a marketing strategist and digital marketing expert",
    business: "a business consultant and strategy expert",
    education: "an experienced educator and learning specialist",
    healthcare: "a healthcare professional and medical expert",
    creative: "a creative professional and design expert",
    content: "a content strategist and professional writer",
    ecommerce: "an e-commerce specialist and retail expert",
    consulting: "a professional consultant and business advisor",
    fitness: "a fitness expert and wellness coach",
    "real-estate": "a real estate professional and market expert",
    legal: "a legal professional and compliance expert",
    food: "a culinary expert and hospitality professional",
    travel: "a travel industry expert and tourism specialist",
    automotive: "an automotive industry expert and vehicle specialist",
    entertainment: "an entertainment industry professional and media expert",
    other: "a knowledgeable professional"
  };

  // Niche-specific context and best practices
  const nicheContextMap: Record<string, string> = {
    technology: "Focus on technical accuracy, industry best practices, and practical implementation. Consider scalability, security, and user experience.",
    marketing: "Emphasize audience targeting, conversion optimization, brand messaging, and ROI. Include actionable marketing strategies.",
    business: "Provide strategic insights, consider market dynamics, financial implications, and business growth opportunities.",
    education: "Use clear explanations, learning objectives, and pedagogical best practices. Make content accessible and engaging.",
    healthcare: "Prioritize accuracy, evidence-based information, and patient safety. Follow medical best practices and ethical guidelines.",
    creative: "Encourage innovation, artistic expression, and creative problem-solving. Consider visual appeal and user engagement.",
    content: "Focus on audience engagement, SEO optimization, storytelling, and content strategy. Ensure readability and value.",
    ecommerce: "Consider customer experience, conversion optimization, product positioning, and sales funnel effectiveness.",
    consulting: "Provide strategic analysis, actionable recommendations, and professional insights. Focus on client value and outcomes.",
    fitness: "Emphasize safety, proper form, progressive training, and holistic wellness approaches.",
    "real-estate": "Consider market trends, property valuation, legal requirements, and client needs in property transactions.",
    legal: "Ensure accuracy, compliance, and risk mitigation. Focus on legal best practices and regulatory requirements.",
    food: "Consider taste, nutrition, food safety, presentation, and customer satisfaction.",
    travel: "Focus on customer experience, safety, cultural sensitivity, and memorable experiences.",
    automotive: "Consider safety, performance, reliability, and technical specifications.",
    entertainment: "Focus on audience engagement, storytelling, production value, and entertainment industry standards.",
    other: "Provide well-researched, practical, and actionable advice."
  };

  let prompt = `You are ${nicheRoleMap[data.niche] || nicheRoleMap.other}. `;
  
  // Add the user's specific request
  prompt += `${data.description} `;
  
  // Add niche-specific context
  prompt += `\n\nContext and Approach: ${nicheContextMap[data.niche] || nicheContextMap.other} `;
  
  // Add standard best practices for better output
  prompt += `\n\nPlease provide a comprehensive, well-structured response that:
- Is professional and actionable
- Includes specific examples where relevant
- Considers current best practices in the ${data.niche} industry
- Provides clear, step-by-step guidance when applicable
- Is tailored to deliver maximum value and practical results`;
  
  return prompt.trim();
};