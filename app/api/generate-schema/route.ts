import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Field {
  name: string;
  label: string;
  type: 
    // Basic Data Types
    'data' | 'small_text' | 'long_text' | 'text' | 'markdown' | 'html' | 'code' |
    // Numeric Types  
    'int' | 'float' | 'currency' | 'percent' | 'rating' |
    // Date & Time
    'date' | 'datetime' | 'time' | 'duration' |
    // Relationships
    'link' | 'dynamic_link' | 'table' | 'table_multiselect' |
    // Choice
    'select' | 'autocomplete' | 'multiselect' | 'radio' | 'checkbox' |
    // Files & Media
    'attach' | 'attach_image' | 'image' | 'signature' | 'barcode' |
    // Visual/Layout/UI
    'color' | 'heading' | 'button' | 'read_only' | 'icon' |
    // Specialized
    'geolocation' | 'json' | 'password' | 'phone' | 'email' | 'url' |
    // Additional Web Types
    'number' | 'range' | 'search' | 'switch' | 'tags' | 'file';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  accept?: string;
  pattern?: string;
  description?: string;
  defaultValue?: any;
  precision?: number;
  currency?: string;
  targetDocType?: string;
  linkFilters?: Record<string, any>;
  maxStars?: number;
  allowHalfRating?: boolean;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
    fileSize?: string;
    fileTypes?: string[];
  };
}

interface Schema {
  title?: string;
  description?: string;
  fields: Field[];
  submitText?: string;
  resetText?: string;
}

// Helper function to clean and parse JSON response
function parseAIResponse(response: string): Schema {
  // Remove common markdown formatting
  let cleanedResponse = response
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .replace(/^```$/gm, '')
    .trim();

  // Remove any text before the first { or [
  const jsonStart = cleanedResponse.search(/^[\s]*[{\[]/m);
  if (jsonStart !== -1) {
    cleanedResponse = cleanedResponse.substring(jsonStart);
  }

  // Remove any text after the last } or ]
  const jsonEnd = cleanedResponse.lastIndexOf('}');
  const jsonEndArray = cleanedResponse.lastIndexOf(']');
  const actualEnd = Math.max(jsonEnd, jsonEndArray);
  if (actualEnd !== -1) {
    cleanedResponse = cleanedResponse.substring(0, actualEnd + 1);
  }

  // Try to fix common JSON issues
  cleanedResponse = cleanedResponse
    .replace(/,\s*}/g, '}')  // Remove trailing commas before }
    .replace(/,\s*]/g, ']')  // Remove trailing commas before ]
    .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Quote unquoted keys
    .replace(/:\s*'([^']*)'/g, ': "$1"')  // Replace single quotes with double quotes
    .replace(/\n/g, ' ')  // Replace newlines with spaces
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .trim();

  try {
    return JSON.parse(cleanedResponse);
  } catch (error) {
    // If parsing fails, try to extract JSON using regex
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Enhanced validation function
function validateSchema(schema: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if schema is an object
  if (!schema || typeof schema !== 'object') {
    errors.push('Schema must be an object');
    return { isValid: false, errors };
  }

  // Validate required fields array
  if (!schema.fields || !Array.isArray(schema.fields)) {
    errors.push('Schema must contain a fields array');
    return { isValid: false, errors };
  }

  if (schema.fields.length === 0) {
    errors.push('Schema must contain at least one field');
    return { isValid: false, errors };
  }

  // Allowed field types
  const allowedTypes = [
    'data', 'small_text', 'long_text', 'text', 'markdown', 'html', 'code',
    'int', 'float', 'currency', 'percent', 'rating',
    'date', 'datetime', 'time', 'duration',
    'link', 'dynamic_link', 'table', 'table_multiselect',
    'select', 'autocomplete', 'multiselect', 'radio', 'checkbox',
    'attach', 'attach_image', 'image', 'signature', 'barcode',
    'color', 'heading', 'button', 'read_only', 'icon',
    'geolocation', 'json', 'password', 'phone', 'email', 'url',
    'number', 'range', 'search', 'switch', 'tags', 'file'
  ];

  // Validate each field
  const fieldNames = new Set<string>();
  
  for (let i = 0; i < schema.fields.length; i++) {
    const field = schema.fields[i];
    const fieldPrefix = `Field ${i + 1}`;

    // Check required properties
    if (!field.name || typeof field.name !== 'string') {
      errors.push(`${fieldPrefix}: 'name' is required and must be a string`);
    }
    if (!field.label || typeof field.label !== 'string') {
      errors.push(`${fieldPrefix}: 'label' is required and must be a string`);
    }
    if (!field.type || typeof field.type !== 'string') {
      errors.push(`${fieldPrefix}: 'type' is required and must be a string`);
    }

    // Check for duplicate field names
    if (field.name) {
      if (fieldNames.has(field.name)) {
        errors.push(`${fieldPrefix}: Duplicate field name '${field.name}'`);
      }
      fieldNames.add(field.name);
    }

    // Validate field type
    if (field.type && !allowedTypes.includes(field.type)) {
      errors.push(`${fieldPrefix}: Invalid field type '${field.type}'. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Validate field-specific requirements
    if (['select', 'multiselect', 'radio', 'autocomplete'].includes(field.type)) {
      if (!field.options || !Array.isArray(field.options) || field.options.length === 0) {
        errors.push(`${fieldPrefix}: Field type '${field.type}' requires a non-empty options array`);
      }
    }

    if (field.type === 'link' && !field.targetDocType) {
      // This is a warning, not an error
      console.warn(`${fieldPrefix}: Link field '${field.name}' should specify targetDocType for better UX`);
    }

    // Validate numeric constraints
    if (field.min !== undefined && field.max !== undefined && field.min > field.max) {
      errors.push(`${fieldPrefix}: 'min' value cannot be greater than 'max' value`);
    }

    // Validate rating field
    if (field.type === 'rating' && field.maxStars !== undefined) {
      if (field.maxStars < 1 || field.maxStars > 10) {
        errors.push(`${fieldPrefix}: 'maxStars' must be between 1 and 10`);
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

// Enhanced system prompt with better JSON formatting instructions
const getSystemPrompt = () => `You are an advanced form builder AI. You must respond with ONLY valid JSON that matches the exact schema format specified below. Do not include any markdown formatting, explanations, or additional text.

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON - no markdown, no explanations, no additional text
2. Do not wrap the JSON in \`\`\`json blocks
3. Ensure all strings are properly quoted with double quotes
4. Remove any trailing commas
5. Validate your JSON before responding

REQUIRED JSON SCHEMA:
{
  "title": "Form Title",
  "description": "Optional form description",
  "fields": [
    {
      "name": "field_name",
      "label": "Field Label",
      "type": "field_type",
      "required": true|false,
      "placeholder": "optional placeholder",
      "options": ["option1", "option2"],
      "validation": {
        "minLength": 0,
        "maxLength": 100
      }
    }
  ],
  "submitText": "Submit",
  "resetText": "Reset"
}

FIELD TYPES: data, small_text, long_text, text, markdown, html, code, int, float, currency, percent, rating, date, datetime, time, duration, link, dynamic_link, table, table_multiselect, select, autocomplete, multiselect, radio, checkbox, attach, attach_image, image, signature, barcode, color, heading, button, read_only, icon, geolocation, json, password, phone, email, url, number, range, search, switch, tags, file

RULES:
- Field names must be unique and camelCase
- Select/multiselect fields must have options array
- Currency fields should include currency property
- Rating fields should include maxStars property
- All field names must be unique
- Respond with valid JSON only`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid prompt is required' }, 
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'AI service is not configured' }, 
        { status: 500 }
      );
    }

    // Make OpenAI API call with retry logic
    let completion;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: getSystemPrompt() },
            { role: 'user', content: `Create a form schema for: ${prompt}` }
          ],
          temperature: 0.3, // Lower temperature for more consistent JSON
          max_tokens: 2000,
          presence_penalty: 0,
          frequency_penalty: 0,
        });
        break;
      } catch (apiError: any) {
        attempts++;
        
        if (apiError.code === 'rate_limit_exceeded') {
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            continue;
          }
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again in a moment.' },
            { status: 429 }
          );
        }
        
        if (apiError.code === 'insufficient_quota') {
          return NextResponse.json(
            { error: 'API quota exceeded. Please check your usage.' },
            { status: 402 }
          );
        }
        
        if (attempts === maxAttempts) {
          throw apiError;
        }
      }
    }

    const rawResponse = completion?.choices[0]?.message?.content;
    if (!rawResponse) {
      return NextResponse.json(
        { error: 'No response generated from AI' }, 
        { status: 500 }
      );
    }

    // Parse and validate the response
    let schema: Schema;
    try {
      schema = parseAIResponse(rawResponse);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw AI response:', rawResponse);
      
      return NextResponse.json({
        error: 'Invalid JSON response from AI. Please try a different prompt.',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 500 });
    }

    // Validate the parsed schema
    const validation = validateSchema(schema);
    if (!validation.isValid) {
      console.error('Schema validation errors:', validation.errors);
      console.error('Invalid schema:', JSON.stringify(schema, null, 2));
      
      return NextResponse.json({
        error: 'Generated schema is invalid',
        details: validation.errors.join('; ')
      }, { status: 500 });
    }

    // Apply default values and enhancements
    if (!schema.title) {
      schema.title = 'Generated Form';
    }
    if (!schema.submitText) {
      schema.submitText = 'Submit';
    }
    if (!schema.resetText) {
      schema.resetText = 'Reset';
    }

    // Enhance fields with defaults
    schema.fields.forEach(field => {
      if (field.type === 'currency' && !field.currency) {
        field.currency = 'USD';
      }
      if (field.type === 'rating' && !field.maxStars) {
        field.maxStars = 5;
      }
      if (field.type === 'attach_image' && !field.accept) {
        field.accept = '.jpg,.jpeg,.png,.gif,.webp';
      }
      if (field.type === 'geolocation' && !field.mapType) {
        field.mapType = 'roadmap';
      }
    });

    return NextResponse.json({ schema });

  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}