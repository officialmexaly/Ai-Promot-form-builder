import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'file';
  required?: boolean;
  options?: string[];
}

interface Schema {
  title?: string;
  fields: Field[];
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

    const systemPrompt = `You are a form builder AI. Generate a JSON schema for a form based on the user's natural language description.

The schema should follow this exact structure:
{
  "title": "Optional form title",
  "fields": [
    {
      "name": "unique_field_name",
      "label": "Human readable label",
      "type": "text|email|textarea|select|file",
      "required": true|false,
      "options": ["option1", "option2"] // Only for select type
    }
  ]
}

Rules:
1. Use camelCase for field names
2. Choose appropriate field types based on the description
3. Set required to true for essential fields
4. For select fields, provide realistic options
5. Keep labels clear and concise
6. Return ONLY valid JSON, no additional text

Field type guidelines:
- text: short text inputs (names, titles, etc.)
- email: email addresses
- textarea: long text (descriptions, messages, etc.)
- select: dropdown with predefined options
- file: file uploads (resumes, documents, etc.)

Examples:
"Contact form" → name (text), email (email), message (textarea)
"Job application" → name (text), email (email), resume (file), position (select)
"Survey" → name (text), rating (select), feedback (textarea)`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 })
    }

    // Try to parse the JSON response
    let schema: Schema
    try {
      schema = JSON.parse(response)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw response:', response)
      return NextResponse.json({ error: 'Invalid JSON response from AI' }, { status: 500 })
    }

    // Validate the schema structure
    if (!schema.fields || !Array.isArray(schema.fields)) {
      return NextResponse.json({ error: 'Invalid schema structure' }, { status: 500 })
    }

    // Validate each field
    for (const field of schema.fields) {
      if (!field.name || !field.label || !field.type) {
        return NextResponse.json({ error: 'Invalid field structure' }, { status: 500 })
      }
      
      if (!['text', 'email', 'textarea', 'select', 'file'].includes(field.type)) {
        return NextResponse.json({ error: `Invalid field type: ${field.type}` }, { status: 500 })
      }
    }

    return NextResponse.json({ schema })

  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}