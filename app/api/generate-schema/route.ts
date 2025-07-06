import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'file' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' | 'checkbox' | 'radio' | 'range' | 'color' | 'search' | 'multiselect' | 'rating' | 'switch' | 'tags';
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
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
}

interface Schema {
  title?: string;
  description?: string;
  fields: Field[];
  submitText?: string;
  resetText?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 })
    }

    const systemPrompt = `You are an advanced form builder AI with expertise in UX/UI design and form optimization. Generate comprehensive JSON schemas for forms based on natural language descriptions.

AVAILABLE FIELD TYPES:
- text: Short text inputs (names, titles, usernames)
- email: Email addresses with validation
- password: Password fields with security
- tel: Phone numbers with formatting
- url: Website URLs with validation
- search: Search inputs with autocomplete styling
- number: Numeric inputs with min/max
- range: Slider inputs with visual feedback
- textarea: Multi-line text (descriptions, messages, comments)
- select: Single-choice dropdown menus
- multiselect: Multiple-choice checkboxes in a scrollable container
- radio: Single-choice radio buttons
- checkbox: Single boolean checkbox
- switch: Toggle switch for on/off states
- file: File uploads (single or multiple)
- date: Date picker
- time: Time picker
- datetime-local: Combined date and time
- color: Color picker with hex input
- rating: 5-star rating system
- tags: Dynamic tag input system

SCHEMA STRUCTURE:
{
  "title": "Form Title",
  "description": "Optional form description",
  "fields": [
    {
      "name": "fieldName",
      "label": "Display Label",
      "type": "field_type",
      "required": true|false,
      "placeholder": "Helpful placeholder text",
      "description": "Additional field explanation",
      "options": ["option1", "option2"], // For select/multiselect/radio
      "min": 0, // For number/range/date
      "max": 100, // For number/range/date
      "step": 1, // For number/range
      "multiple": true|false, // For file inputs
      "accept": ".pdf,.doc,.docx", // For file inputs
      "pattern": "regex_pattern", // For validation
      "validation": {
        "minLength": 3,
        "maxLength": 50,
        "min": 0,
        "max": 100,
        "pattern": "regex",
        "custom": "Custom error message"
      }
    }
  ],
  "submitText": "Custom Submit Button Text",
  "resetText": "Custom Reset Button Text"
}

INTELLIGENT FIELD TYPE SELECTION:
- Names, titles, addresses → text
- Email addresses → email
- Phone numbers → tel
- Websites, social media → url
- Passwords, PINs → password
- Ages, quantities, prices → number
- Ratings, scales, sliders → range or rating
- Comments, descriptions, feedback → textarea
- Country, state, category selection → select
- Multiple categories, interests → multiselect
- Gender, yes/no questions → radio
- Agreement, consent → checkbox
- Enable/disable features → switch
- Documents, images → file
- Birth dates, deadlines → date
- Appointment times → time or datetime-local
- Brand colors, preferences → color
- Skills, interests, hobbies → tags
- Search functionality → search

VALIDATION RULES:
- Email fields: Automatic email validation
- Phone fields: Phone number pattern validation
- URL fields: URL format validation
- Password fields: Minimum security requirements
- Required fields: Mark essential fields as required
- Length limits: Set appropriate min/max lengths
- Number ranges: Set realistic min/max values
- File types: Specify accepted file extensions

SMART SUGGESTIONS:
- Job applications: name, email, phone, resume (file), position (select), experience (number), cover letter (textarea)
- Contact forms: name, email, subject (select), message (textarea), urgency (radio)
- Registration forms: personal info, preferences (multiselect), agreements (checkbox), profile picture (file)
- Surveys: demographics (select/radio), ratings (rating/range), feedback (textarea), suggestions (tags)
- E-commerce: product details, pricing (number), categories (multiselect), images (file), availability (switch)
- Event registration: attendee info, dietary restrictions (multiselect), special requests (textarea), emergency contact
- Feedback forms: overall rating (rating), specific ratings (range), comments (textarea), recommendations (checkbox)

ENHANCED UX FEATURES:
- Add helpful placeholders for guidance
- Include field descriptions for complex inputs
- Set appropriate validation with user-friendly error messages
- Use logical field ordering and grouping
- Provide realistic options for select fields
- Consider accessibility and mobile usability

EXAMPLES:

"Job application form":
- Personal: name (text), email (email), phone (tel)
- Professional: resume (file), position (select), experience (number), salary expectation (range)
- Additional: cover letter (textarea), skills (tags), availability (date), willing to relocate (switch)

"Customer feedback survey":
- Identity: name (text), email (email), customer since (date)
- Experience: overall rating (rating), service quality (range), likelihood to recommend (range)
- Feedback: best aspects (multiselect), improvements needed (textarea), contact preferences (radio)

"E-commerce product form":
- Basic: product name (text), price (number), category (select), subcategories (multiselect)
- Details: description (textarea), specifications (tags), availability (switch), launch date (date)
- Media: main image (file), gallery images (file with multiple), color variants (color)

Return ONLY valid JSON with no additional text. Ensure all field names are camelCase and unique.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 })
    }

    // Try to parse the JSON response
    let schema: Schema
    try {
      // Clean the response in case there's any markdown formatting
      const cleanedResponse = response.replace(/```json\n?|```\n?/g, '').trim()
      schema = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw response:', response)
      return NextResponse.json({ error: 'Invalid JSON response from AI' }, { status: 500 })
    }

    // Validate the schema structure
    if (!schema.fields || !Array.isArray(schema.fields)) {
      return NextResponse.json({ error: 'Invalid schema structure: fields array is required' }, { status: 500 })
    }

    if (schema.fields.length === 0) {
      return NextResponse.json({ error: 'Schema must contain at least one field' }, { status: 500 })
    }

    // Validate each field
    const allowedTypes = [
      'text', 'email', 'password', 'textarea', 'select', 'file', 'number', 'tel', 'url', 
      'date', 'time', 'datetime-local', 'checkbox', 'radio', 'range', 'color', 'search', 
      'multiselect', 'rating', 'switch', 'tags'
    ]

    for (const field of schema.fields) {
      if (!field.name || !field.label || !field.type) {
        return NextResponse.json({ 
          error: `Invalid field structure: name, label, and type are required. Field: ${JSON.stringify(field)}` 
        }, { status: 500 })
      }
      
      if (!allowedTypes.includes(field.type)) {
        return NextResponse.json({ 
          error: `Invalid field type: ${field.type}. Allowed types: ${allowedTypes.join(', ')}` 
        }, { status: 500 })
      }

      // Validate field-specific requirements
      if (['select', 'multiselect', 'radio'].includes(field.type) && (!field.options || field.options.length === 0)) {
        return NextResponse.json({ 
          error: `Field type '${field.type}' requires options array. Field: ${field.name}` 
        }, { status: 500 })
      }

      // Ensure field names are unique
      const fieldNames = schema.fields.map(f => f.name)
      const uniqueNames = new Set(fieldNames)
      if (fieldNames.length !== uniqueNames.size) {
        return NextResponse.json({ 
          error: 'Field names must be unique' 
        }, { status: 500 })
      }
    }

    // Add default values if missing
    if (!schema.title) {
      schema.title = 'Generated Form'
    }

    if (!schema.submitText) {
      schema.submitText = 'Submit Form'
    }

    if (!schema.resetText) {
      schema.resetText = 'Reset'
    }

    return NextResponse.json({ schema })

  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('rate limit')) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }, { status: 429 })
      }
      
      if (error.message.includes('insufficient_quota')) {
        return NextResponse.json({ 
          error: 'OpenAI quota exceeded. Please check your API usage.' 
        }, { status: 402 })
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}