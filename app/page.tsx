'use client'

import { useState } from 'react'
import DynamicForm from '@/components/DynamicForm'

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

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [schema, setSchema] = useState<Schema | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerateForm = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setSchema(data.schema)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClearForm = () => {
    setSchema(null)
    setPrompt('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Prompt Form Builder
          </h1>
          <p className="text-gray-600">
            Describe your form in natural language and let AI generate it for you
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your form
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Example: Create a job application form with name, email, resume upload, and position selection"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleGenerateForm}
              disabled={loading || !prompt.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                'Generate Form'
              )}
            </button>

            {schema && (
              <button
                onClick={handleClearForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {schema && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated Form</h2>
              <p className="text-gray-600 text-sm">Your AI-generated form is ready to use</p>
            </div>
            <DynamicForm schema={schema} />
          </div>
        )}

        {/* Example prompts */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Prompts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Create a contact form with name, email, phone, and message",
              "Build a registration form with personal details and preferences",
              "Generate a feedback form with rating and comments",
              "Create a survey form with multiple choice and text questions"
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="text-sm text-gray-600 italic">"{example}"</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}