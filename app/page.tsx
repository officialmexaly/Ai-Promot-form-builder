'use client'

import { useState, useRef, useEffect } from 'react'
import DynamicForm from '@/components/DynamicForm'

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

const examplePrompts = [
  {
    title: "Enterprise CRM Lead Form",
    description: "Complete customer relationship management form",
    prompt: "Create a comprehensive CRM lead form with contact details (data for name, email, phone), company information (link to existing companies, data for company name), lead qualification (rating for lead score, select for source like 'Website', 'Cold Call', 'Referral'), financial details (currency for expected deal value, percent for probability), timeline (date for expected close date), and engagement tracking (table for interaction history, multiselect for interests, long_text for notes)"
  },
  {
    title: "Medical Patient Registration",
    description: "Healthcare patient onboarding system",
    prompt: "Design a patient registration form including personal information (data for full name, email, phone, date for birth date), medical details (small_text for current medications, multiselect for known allergies, rating for pain level), insurance information (link to insurance providers, data for policy number), emergency contact (data for contact name, phone for emergency number), and medical history (long_text for previous conditions, table for past surgeries with dates)"
  },
  {
    title: "E-commerce Product Catalog",
    description: "Complete product management form",
    prompt: "Build a product catalog form with basic details (data for product name, long_text for description, currency for price, int for stock quantity), categorization (multiselect for categories, tags for product keywords), media management (attach_image for main product photo, attach for product manual), specifications (json for technical specs, table for variants with size and color), availability (switch for active status, date for launch date), and SEO (small_text for meta description)"
  },
  {
    title: "Project Management System",
    description: "Comprehensive project tracking form",
    prompt: "Create a project management form with project basics (data for project name, markdown for description, link to client), timeline (date for start date, date for end date, duration for estimated hours), team assignment (table_multiselect for team members, link to project manager), progress tracking (percent for completion, rating for client satisfaction), budget management (currency for budget, currency for actual cost), and documentation (attach for project files, json for custom fields)"
  },
  {
    title: "Event Registration & Planning",
    description: "Complete event management system",
    prompt: "Generate an event registration form including event details (data for event name, datetime for event date and time, geolocation for venue location), attendee information (data for full name, email, phone), preferences (multiselect for dietary restrictions, select for t-shirt size, radio for attendance type like 'In-person' or 'Virtual'), special requirements (checkbox for accessibility needs, long_text for special requests), payment (currency for registration fee, select for payment method), and confirmation (signature for agreement, barcode for ticket)"
  },
  {
    title: "Employee Onboarding Portal",
    description: "HR employee management system",
    prompt: "Design an employee onboarding form with personal details (data for full name, email, phone, date for start date), employment information (select for department, select for position, currency for salary, link to reporting manager), documents (attach for resume, attach for ID copy, signature for employment agreement), system access (data for preferred username, password for temporary password), benefits (multiselect for benefit selections, percent for retirement contribution), and profile (attach_image for profile photo, small_text for bio)"
  },
  {
    title: "Financial Loan Application",
    description: "Banking and finance application form",
    prompt: "Create a loan application form including applicant information (data for full name, email, phone, date for date of birth), financial details (currency for requested amount, currency for annual income, select for employment type, int for credit score), loan specifics (select for loan type like 'Personal', 'Auto', 'Home', duration for loan term, percent for preferred interest rate), documentation (attach for income proof, attach for bank statements, signature for application consent), and verification (json for additional financial data, barcode for application tracking)"
  },
  {
    title: "Academic Course Management",
    description: "Educational institution management",
    prompt: "Build a course management form with course details (data for course title, code for course code, markdown for course description, link to instructor), scheduling (datetime for class times, duration for class duration, int for credit hours), enrollment (int for max students, currency for course fee, multiselect for prerequisites), assessment (table for assignments with due dates, percent for passing grade, rating for difficulty level), resources (attach for syllabus, attach for reading materials), and administration (switch for active status, json for custom course metadata)"
  }
]

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [schema, setSchema] = useState<Schema | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showExamples, setShowExamples] = useState(true)
  const formRef = useRef<HTMLDivElement>(null)

  const handleGenerateForm = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate your form')
      return
    }

    setLoading(true)
    setError('')
    setShowExamples(false)

    try {
      const response = await fetch('/api/generate-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setSchema(data.schema)
      
      // Smooth scroll to form after generation
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClearForm = () => {
    setSchema(null)
    setPrompt('')
    setError('')
    setShowExamples(true)
  }

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt)
    setShowExamples(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerateForm()
    }
  }

  useEffect(() => {
    // Add keyboard shortcut listener
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !loading) {
        e.preventDefault()
        handleGenerateForm()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyPress)
    return () => document.removeEventListener('keydown', handleGlobalKeyPress)
  }, [loading, prompt])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Powered by Advanced AI
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI Form Builder
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Beyond Imagination
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into beautiful, functional forms instantly. Just describe what you need in natural language, and watch our AI create professional forms with advanced field types and intelligent validation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                20+ Field Types
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Smart Validation
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Instant Generation
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Prompt Input Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-lg font-semibold text-gray-900 mb-3">
              Describe Your Form
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                rows={6}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                placeholder="Example: Create a comprehensive job application form with personal details, professional experience, file uploads for resume and cover letter, skill tags, salary expectations, and availability preferences..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
              <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                {prompt.length}/2000 • Cmd/Ctrl + Enter to generate
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGenerateForm}
              disabled={loading || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg flex items-center justify-center group"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Form...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Form
                </>
              )}
            </button>

            {schema && (
              <button
                onClick={handleClearForm}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 font-semibold"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Generated Form Section */}
        {schema && (
          <div ref={formRef} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            
            <div className="mb-8 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Form Generated Successfully
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your AI-Generated Form</h2>
              <p className="text-gray-600">Ready to use with intelligent validation and modern design</p>
            </div>
            
            <DynamicForm schema={schema} />
          </div>
        )}

        {/* Example Prompts Section */}
        {showExamples && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Example Prompts</h3>
              <p className="text-gray-600">Get inspired with these professionally crafted form examples</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example.prompt)}
                  className="group text-left p-6 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-purple-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {example.title}
                    </h4>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                  <div className="text-xs text-gray-500 italic line-clamp-3 bg-gray-50 p-3 rounded-lg border-l-4 border-gray-200">
                    "{example.prompt.substring(0, 120)}..."
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">Powerful Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Generation</h4>
              <p className="text-gray-600">Advanced AI understands context and creates forms with appropriate field types and validation</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">20+ Field Types</h4>
              <p className="text-gray-600">From basic inputs to advanced components like rating systems, color pickers, and tag inputs</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Smart Validation</h4>
              <p className="text-gray-600">Intelligent validation rules with real-time feedback and user-friendly error messages</p>
            </div>
          </div>
        </div>

        {/* Field Types Showcase */}
        <div className="mt-20 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Supported Field Types</h3>
            <p className="text-gray-600">Our AI can generate any of these field types based on your description</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { type: 'Data Input', icon: '📝', color: 'bg-blue-100 text-blue-700' },
              { type: 'Email', icon: '📧', color: 'bg-green-100 text-green-700' },
              { type: 'Password', icon: '🔒', color: 'bg-red-100 text-red-700' },
              { type: 'Phone', icon: '📱', color: 'bg-purple-100 text-purple-700' },
              { type: 'Currency', icon: '💰', color: 'bg-yellow-100 text-yellow-700' },
              { type: 'Percentage', icon: '📊', color: 'bg-indigo-100 text-indigo-700' },
              { type: 'Date/Time', icon: '📅', color: 'bg-pink-100 text-pink-700' },
              { type: 'Duration', icon: '⏱️', color: 'bg-orange-100 text-orange-700' },
              { type: 'File Attach', icon: '📎', color: 'bg-teal-100 text-teal-700' },
              { type: 'Image Upload', icon: '🖼️', color: 'bg-cyan-100 text-cyan-700' },
              { type: 'Signature', icon: '✍️', color: 'bg-lime-100 text-lime-700' },
              { type: 'Barcode', icon: '🔲', color: 'bg-amber-100 text-amber-700' },
              { type: 'Link Fields', icon: '🔗', color: 'bg-rose-100 text-rose-700' },
              { type: 'JSON Data', icon: '📋', color: 'bg-violet-100 text-violet-700' },
              { type: 'Geolocation', icon: '📍', color: 'bg-emerald-100 text-emerald-700' },
              { type: 'Code Editor', icon: '💻', color: 'bg-slate-100 text-slate-700' },
              { type: 'Markdown', icon: '📄', color: 'bg-sky-100 text-sky-700' },
              { type: 'Tables', icon: '📑', color: 'bg-gray-100 text-gray-700' },
              { type: 'Multi-Select', icon: '☑️', color: 'bg-blue-100 text-blue-700' },
              { type: 'Autocomplete', icon: '🔍', color: 'bg-green-100 text-green-700' },
              { type: 'Rating Stars', icon: '⭐', color: 'bg-yellow-100 text-yellow-700' },
              { type: 'Color Picker', icon: '🎨', color: 'bg-purple-100 text-purple-700' },
              { type: 'Toggle Switch', icon: '🔄', color: 'bg-indigo-100 text-indigo-700' },
              { type: 'Tag Input', icon: '🏷️', color: 'bg-pink-100 text-pink-700' }
            ].map((field, index) => (
              <div key={index} className={`${field.color} px-3 py-2 rounded-lg text-center text-sm font-medium flex items-center justify-center space-x-2`}>
                <span>{field.icon}</span>
                <span className="hidden sm:inline">{field.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">💡 Tips for Better Results</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-900 mb-2">Be Specific & Contextual</h4>
              <p className="text-blue-700 text-sm">Mention the business context (CRM, healthcare, e-commerce) and specific field types you need (currency, rating, geolocation, etc.)</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-400">
              <h4 className="font-semibold text-green-900 mb-2">Include Relationships</h4>
              <p className="text-green-700 text-sm">Specify links between data (customer to orders, employee to department) and table structures for complex forms</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-900 mb-2">Advanced Features</h4>
              <p className="text-purple-700 text-sm">Request specialized fields like signatures, barcodes, JSON data, markdown editors, or geolocation for enhanced functionality</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-400">
              <h4 className="font-semibold text-orange-900 mb-2">Data Validation</h4>
              <p className="text-orange-700 text-sm">Mention validation requirements like file size limits, currency precision, date ranges, or pattern matching</p>
            </div>
            
            <div className="p-4 bg-teal-50 rounded-xl border-l-4 border-teal-400">
              <h4 className="font-semibold text-teal-900 mb-2">User Experience</h4>
              <p className="text-teal-700 text-sm">Request features like autocomplete, rating systems, progress indicators, or conditional field visibility</p>
            </div>
            
            <div className="p-4 bg-pink-50 rounded-xl border-l-4 border-pink-400">
              <h4 className="font-semibold text-pink-900 mb-2">Enterprise Features</h4>
              <p className="text-pink-700 text-sm">Include workflow elements like approval chains, document attachments, digital signatures, or audit trails</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}