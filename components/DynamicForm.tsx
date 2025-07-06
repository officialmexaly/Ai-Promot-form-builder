'use client'

import { useState } from 'react'

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

interface DynamicFormProps {
  schema: Schema;
}

export default function DynamicForm({ schema }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const validateField = (field: Field, value: any) => {
    if (field.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`
    }
    
    if (!value) return ''
    
    // Email validation
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address'
    }
    
    // URL validation
    if (field.type === 'url' && !/^https?:\/\/.+/.test(value)) {
      return 'Please enter a valid URL (starting with http:// or https://)'
    }
    
    // Phone validation
    if (field.type === 'phone' && !/^[\+]?[\d\s\-\(\)]+$/.test(value)) {
      return 'Please enter a valid phone number'
    }
    
    // Pattern validation
    if (field.pattern && !new RegExp(field.pattern).test(value)) {
      return field.validation?.custom || 'Please enter a valid format'
    }
    
    // Length validation
    if (field.validation?.minLength && value.length < field.validation.minLength) {
      return `Minimum ${field.validation.minLength} characters required`
    }
    
    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      return `Maximum ${field.validation.maxLength} characters allowed`
    }
    
    // Number validation
    if (field.type === 'number' || field.type === 'range') {
      const numValue = parseFloat(value)
      if (field.validation?.min !== undefined && numValue < field.validation.min) {
        return `Minimum value is ${field.validation.min}`
      }
      if (field.validation?.max !== undefined && numValue > field.validation.max) {
        return `Maximum value is ${field.validation.max}`
      }
    }
    
    return ''
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    schema.fields.forEach(field => {
      const error = validateField(field, formData[field.name])
      if (error) {
        newErrors[field.name] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitted(true)
      setIsSubmitting(false)
      console.log('Form submitted:', formData)
    }
  }

  const handleReset = () => {
    setFormData({})
    setErrors({})
    setSubmitted(false)
  }

  const getFieldIcon = (type: string) => {
    const iconClass = "w-4 h-4 text-gray-400"
    
    switch (type) {
      case 'email':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
      case 'phone':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      case 'url':
      case 'link':
      case 'dynamic_link':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
      case 'barcode':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11V9a6 6 0 10-12 0v7m-3 0h18m-9 4h.01M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg>
      case 'signature':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
      case 'percent':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
      case 'password':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      case 'date':
      case 'datetime':
      case 'time':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      case 'attach':
      case 'attach_image':
      case 'file':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
      case 'currency':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
      case 'geolocation':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      case 'json':
      case 'code':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
      case 'search':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      default:
        return null
    }
  }

  const renderField = (field: Field) => {
    const hasError = errors[field.name]
    const baseInputClasses = `w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
      hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
    }`
    
    const iconInputClasses = `${baseInputClasses} pl-12`

    switch (field.type) {
      // Basic Data Types
      case 'data':
      case 'email':
      case 'password':
      case 'phone':
      case 'url':
      case 'search':
        return (
          <div className="relative">
            {getFieldIcon(field.type) && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                {getFieldIcon(field.type)}
              </div>
            )}
            <input
              type={field.type === 'data' ? 'text' : field.type === 'phone' ? 'tel' : field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={getFieldIcon(field.type) ? iconInputClasses : baseInputClasses}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              pattern={field.pattern}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength || (field.type === 'data' ? 140 : undefined)}
            />
          </div>
        )

      // Text Areas
      case 'small_text':
      case 'long_text':
      case 'text':
        return (
          <textarea
            id={field.name}
            name={field.name}
            rows={field.type === 'small_text' ? 3 : field.type === 'long_text' ? 8 : 4}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${baseInputClasses} resize-none`}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        )

      // Rich Text Editors
      case 'markdown':
        return (
          <div className="space-y-2">
            <textarea
              id={field.name}
              name={field.name}
              rows={8}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`${baseInputClasses} resize-none font-mono text-sm`}
              placeholder={field.placeholder || `Enter markdown content...`}
            />
            <div className="text-xs text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Supports **bold**, *italic*, `code`, and [links](url)
            </div>
          </div>
        )

      case 'html':
        return (
          <textarea
            id={field.name}
            name={field.name}
            rows={8}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${baseInputClasses} resize-none font-mono text-sm`}
            placeholder={field.placeholder || `<p>Enter HTML content...</p>`}
          />
        )

      case 'code':
        return (
          <div className="space-y-2">
            <textarea
              id={field.name}
              name={field.name}
              rows={10}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`${baseInputClasses} resize-none font-mono text-sm bg-gray-900 text-green-400 border-gray-700`}
              placeholder={field.placeholder || `// Enter your code here...`}
            />
            <div className="text-xs text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Code editor with syntax highlighting
            </div>
          </div>
        )

      // Numeric Types
      case 'int':
      case 'number':
        return (
          <input
            type="number"
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, field.type === 'int' ? parseInt(e.target.value) || '' : e.target.value)}
            className={baseInputClasses}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            min={field.min || field.validation?.min}
            max={field.max || field.validation?.max}
            step={field.type === 'int' ? 1 : field.step}
          />
        )

      case 'float':
        return (
          <input
            type="number"
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || '')}
            className={baseInputClasses}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            min={field.min || field.validation?.min}
            max={field.max || field.validation?.max}
            step={field.step || 0.01}
          />
        )

      case 'currency':
        return (
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              {getFieldIcon(field.type)}
            </div>
            <input
              type="number"
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || '')}
              className={iconInputClasses}
              placeholder={field.placeholder || `0.00`}
              min={field.min || 0}
              max={field.max}
              step={0.01}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {field.currency || 'USD'}
            </div>
          </div>
        )

      case 'percent':
        return (
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              {getFieldIcon(field.type)}
            </div>
            <input
              type="number"
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || '')}
              className={iconInputClasses}
              placeholder={field.placeholder || `0`}
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 0.1}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              %
            </div>
          </div>
        )

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              id={field.name}
              name={field.name}
              value={formData[field.name] || field.min || 0}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              min={field.min || field.validation?.min || 0}
              max={field.max || field.validation?.max || 100}
              step={field.step || 1}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{field.min || field.validation?.min || 0}</span>
              <span className="font-medium text-blue-600">{formData[field.name] || field.min || 0}</span>
              <span>{field.max || field.validation?.max || 100}</span>
            </div>
          </div>
        )

      // Date & Time Fields
      case 'date':
        return (
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              {getFieldIcon(field.type)}
            </div>
            <input
              type="date"
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={iconInputClasses}
            />
          </div>
        )

      case 'datetime':
        return (
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              {getFieldIcon(field.type)}
            </div>
            <input
              type="datetime-local"
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={iconInputClasses}
            />
          </div>
        )

      case 'time':
        return (
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              {getFieldIcon(field.type)}
            </div>
            <input
              type="time"
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={iconInputClasses}
            />
          </div>
        )

      case 'duration':
        return (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hours</label>
              <input
                type="number"
                min="0"
                max="23"
                value={formData[field.name]?.hours || ''}
                onChange={(e) => handleInputChange(field.name, {
                  ...formData[field.name],
                  hours: parseInt(e.target.value) || 0
                })}
                className={baseInputClasses}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={formData[field.name]?.minutes || ''}
                onChange={(e) => handleInputChange(field.name, {
                  ...formData[field.name],
                  minutes: parseInt(e.target.value) || 0
                })}
                className={baseInputClasses}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={formData[field.name]?.seconds || ''}
                onChange={(e) => handleInputChange(field.name, {
                  ...formData[field.name],
                  seconds: parseInt(e.target.value) || 0
                })}
                className={baseInputClasses}
                placeholder="0"
              />
            </div>
          </div>
        )

      // Relationship Fields
      case 'link':
        return (
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              {getFieldIcon(field.type)}
            </div>
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={iconInputClasses}
            >
              <option value="">Select {field.targetDocType || field.label.toLowerCase()}</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {field.targetDocType && (
              <div className="text-xs text-gray-500 mt-1">
                Links to: {field.targetDocType}
              </div>
            )}
          </div>
        )

      case 'dynamic_link':
        return (
          <div className="space-y-3">
            <select
              id={`${field.name}_type`}
              name={`${field.name}_type`}
              value={formData[`${field.name}_type`] || ''}
              onChange={(e) => handleInputChange(`${field.name}_type`, e.target.value)}
              className={baseInputClasses}
            >
              <option value="">Select type...</option>
              {['Customer', 'Supplier', 'Employee', 'Item'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                {getFieldIcon(field.type)}
              </div>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={iconInputClasses}
                placeholder={`Select ${formData[`${field.name}_type`] || 'item'} first...`}
                disabled={!formData[`${field.name}_type`]}
              />
            </div>
          </div>
        )

      case 'table':
        return (
          <div className="border-2 border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-700">{field.label} Items</h4>
              <button
                type="button"
                onClick={() => {
                  const currentItems = formData[field.name] || []
                  handleInputChange(field.name, [...currentItems, {}])
                }}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                + Add Row
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {(formData[field.name] || []).map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.name || ''}
                    onChange={(e) => {
                      const items = [...(formData[field.name] || [])]
                      items[index] = { ...items[index], name: e.target.value }
                      handleInputChange(field.name, items)
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const items = formData[field.name] || []
                      handleInputChange(field.name, items.filter((_: any, i: number) => i !== index))
                    }}
                    className="px-2 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              {(!formData[field.name] || formData[field.name].length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No items added yet. Click "Add Row" to start.
                </div>
              )}
            </div>
          </div>
        )

      case 'table_multiselect':
        return (
          <div className="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={(formData[field.name] || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = formData[field.name] || []
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option)
                      handleInputChange(field.name, newValues)
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )

      // Choice Fields
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

      case 'autocomplete':
        return (
          <div className="relative">
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClasses}
              placeholder={field.placeholder || `Type to search ${field.label.toLowerCase()}...`}
              list={`${field.name}_datalist`}
            />
            <datalist id={`${field.name}_datalist`}>
              {field.options?.map((option, index) => (
                <option key={index} value={option} />
              ))}
            </datalist>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )

      case 'multiselect':
        return (
          <div className="space-y-2 max-h-40 overflow-y-auto border-2 border-gray-200 rounded-xl p-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={(formData[field.name] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = formData[field.name] || []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option)
                    handleInputChange(field.name, newValues)
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={formData[field.name] === option}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{field.label}</span>
          </label>
        )

      case 'switch':
        return (
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={formData[field.name] || false}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-14 h-8 rounded-full transition-colors ${
                formData[field.name] ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                formData[field.name] ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
            <span className="ml-3 text-sm text-gray-700">{field.label}</span>
          </label>
        )

      // Files & Media
      case 'attach':
      case 'attach_image':
      case 'file':
        return (
          <div className="relative">
            <input
              type="file"
              id={field.name}
              name={field.name}
              multiple={field.multiple}
              accept={field.accept || (field.type === 'attach_image' ? '.jpg,.jpeg,.png,.gif,.webp' : undefined)}
              onChange={(e) => handleInputChange(field.name, field.multiple ? e.target.files : e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className={`${baseInputClasses} flex items-center justify-center border-dashed text-center py-8`}>
              <div>
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-gray-600">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {field.type === 'attach_image' ? 'Images only' : field.accept || 'Any file type'}
                  {field.validation?.fileSize && ` • Max ${field.validation.fileSize}`}
                </p>
              </div>
            </div>
          </div>
        )

      case 'signature':
        return (
          <div className="border-2 border-gray-200 rounded-xl p-4">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <p className="text-gray-600 mb-4">Digital Signature Pad</p>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => handleInputChange(field.name, 'signature_placeholder')}
              >
                Open Signature Pad
              </button>
              {formData[field.name] && (
                <div className="mt-4 text-sm text-green-600">✓ Signature captured</div>
              )}
            </div>
          </div>
        )

      case 'barcode':
        return (
          <div className="space-y-3">
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClasses}
              placeholder={field.placeholder || 'Enter barcode or scan'}
            />
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => {
                  // Barcode scanning simulation
                  handleInputChange(field.name, Math.random().toString().substr(2, 12))
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11V9a6 6 0 10-12 0v7m-3 0h18m-9 4h.01M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
                Scan Barcode
              </button>
              {formData[field.name] && (
                <div className="text-sm text-gray-600 font-mono">{formData[field.name]}</div>
              )}
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-3">
            <input
              type="url"
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClasses}
              placeholder="Enter image URL"
            />
            {formData[field.name] && (
              <div className="border-2 border-gray-200 rounded-lg p-2">
                <img
                  src={formData[field.name]}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        )

      // Specialized Fields
      case 'geolocation':
        return (
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                {getFieldIcon(field.type)}
              </div>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={formData[field.name] ? `${formData[field.name].lat}, ${formData[field.name].lng}` : ''}
                onChange={(e) => {
                  const [lat, lng] = e.target.value.split(',').map(s => parseFloat(s.trim()))
                  if (!isNaN(lat) && !isNaN(lng)) {
                    handleInputChange(field.name, { lat, lng })
                  }
                }}
                className={iconInputClasses}
                placeholder="Latitude, Longitude (e.g., 40.7128, -74.0060)"
              />
            </div>
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600 mb-4">Interactive Map ({field.mapType || 'roadmap'})</p>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // Simulate getting current location
                  handleInputChange(field.name, { lat: 40.7128, lng: -74.0060 })
                }}
              >
                Use Current Location
              </button>
            </div>
          </div>
        )

      case 'json':
        return (
          <div className="space-y-2">
            <textarea
              id={field.name}
              name={field.name}
              rows={8}
              value={formData[field.name] ? JSON.stringify(formData[field.name], null, 2) : ''}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  handleInputChange(field.name, parsed)
                } catch {
                  // Keep the raw text for now
                  handleInputChange(field.name, e.target.value)
                }
              }}
              className={`${baseInputClasses} resize-none font-mono text-sm bg-gray-900 text-green-400 border-gray-700`}
              placeholder='{"key": "value"}'
            />
            <div className="text-xs text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              JSON format with syntax validation
            </div>
          </div>
        )

      case 'color':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id={field.name}
              name={field.name}
              value={formData[field.name] || '#000000'}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={formData[field.name] || '#000000'}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="#000000"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        )

      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: field.maxStars || 5 }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange(field.name, star)}
                className={`w-8 h-8 ${
                  star <= (formData[field.name] || 0) ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {formData[field.name] ? `${formData[field.name]} of ${field.maxStars || 5}` : 'No rating'}
            </span>
          </div>
        )

      case 'tags':
        return (
          <div>
            <input
              type="text"
              placeholder="Type and press Enter to add tags"
              className={baseInputClasses}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  e.preventDefault()
                  const currentTags = formData[field.name] || []
                  const newTag = e.currentTarget.value.trim()
                  if (!currentTags.includes(newTag)) {
                    handleInputChange(field.name, [...currentTags, newTag])
                  }
                  e.currentTarget.value = ''
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData[field.name] || []).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const tags = formData[field.name] || []
                      handleInputChange(field.name, tags.filter((_: string, i: number) => i !== index))
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )

      // Layout/Display Fields
      case 'heading':
        return (
          <div className="py-4">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2">
              {field.label}
            </h3>
            {field.description && (
              <p className="text-gray-600 mt-2">{field.description}</p>
            )}
          </div>
        )

      case 'read_only':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <span className="text-gray-700">
              {formData[field.name] || field.defaultValue || 'No value set'}
            </span>
          </div>
        )

      case 'button':
        return (
          <button
            type="button"
            onClick={() => {
              // Button action simulation
              alert(`${field.label} button clicked!`)
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-colors font-medium"
          >
            {field.label}
          </button>
        )

      case 'icon':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-gray-700">{field.label}</span>
          </div>
        )

      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800">
              Field type "{field.type}" is not yet implemented.
            </p>
          </div>
        )
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Form Submitted Successfully!</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">Thank you for your submission. We've received your information and will get back to you soon.</p>
        <button
          onClick={handleReset}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-medium"
        >
          Submit Another Response
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {schema.title && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{schema.title}</h2>
          {schema.description && (
            <p className="text-gray-600 max-w-2xl mx-auto">{schema.description}</p>
          )}
        </div>
      )}

      <div className="grid gap-6">
        {schema.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            {field.type !== 'checkbox' && field.type !== 'switch' && field.type !== 'heading' && (
              <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            
            {field.description && field.type !== 'heading' && (
              <p className="text-sm text-gray-500 mb-2">{field.description}</p>
            )}
            
            {renderField(field)}
            
            {errors[field.name] && (
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors[field.name]}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            schema.submitText || 'Submit Form'
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 font-semibold"
        >
          {schema.resetText || 'Reset Form'}
        </button>
      </div>
    </form>
  )
}