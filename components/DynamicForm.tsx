'use client'

import { useState } from 'react'

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

interface DynamicFormProps {
  schema: Schema;
}

export default function DynamicForm({ schema }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    schema.fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name] === '')) {
        newErrors[field.name] = `${field.label} is required`
      }
      
      if (field.type === 'email' && formData[field.name] && 
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.name])) {
        newErrors[field.name] = 'Please enter a valid email address'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setSubmitted(true)
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData)
    }
  }

  const handleReset = () => {
    setFormData({})
    setErrors({})
    setSubmitted(false)
  }

  const renderField = (field: Field) => {
    const hasError = errors[field.name]
    const baseInputClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      hasError ? 'border-red-300' : 'border-gray-300'
    }`

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseInputClasses}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )

      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            rows={4}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${baseInputClasses} resize-none`}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'file':
        return (
          <input
            type="file"
            id={field.name}
            name={field.name}
            onChange={(e) => handleInputChange(field.name, e.target.files?.[0] || null)}
            className={`${baseInputClasses} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
          />
        )

      default:
        return null
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Form Submitted Successfully!</h3>
        <p className="text-gray-600 mb-4">Thank you for your submission.</p>
        <button
          onClick={handleReset}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {schema.title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{schema.title}</h2>
        </div>
      )}

      {schema.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {renderField(field)}
          
          {errors[field.name] && (
            <p className="text-sm text-red-600">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Submit Form
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  )
}