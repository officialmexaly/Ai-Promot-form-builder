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

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 })
    }

    const systemPrompt = `You are an advanced form builder AI with expertise in Frappe Framework field types and enterprise application design. Generate comprehensive JSON schemas for forms based on natural language descriptions, utilizing the full spectrum of Frappe field types for maximum functionality and user experience.

COMPREHENSIVE FRAPPE FIELD TYPES AVAILABLE:

### Basic Data Types
- **data**: Single-line text (up to 140 chars), supports validation like Name, Email, Phone, URL
- **small_text**: Short multi-line text for brief descriptions
- **long_text**: Unlimited-length text fields for extensive content
- **text**: Standard multi-line text (legacy, use small_text/long_text instead)
- **markdown**: Rich-text with markdown support and live preview
- **html**: Rich HTML content with WYSIWYG editor
- **code**: Code input with syntax highlighting and validation

### Numeric Types
- **int**: Integer values with validation ranges
- **float**: Decimal values with configurable precision (up to 9 decimal places)
- **currency**: Decimal with currency formatting and symbol display
- **percent**: Numeric percentage with % symbol
- **rating**: Interactive star-rating (3-10 stars, half increments supported)

### Date & Time Types
- **date**: Date picker with calendar interface
- **datetime**: Combined date and time picker
- **time**: Time picker with hour/minute selection
- **duration**: Duration field with configurable display (hours, days, etc.)

### Relationship Types
- **link**: Link to another DocType/entity (e.g., Customer, Product)
- **dynamic_link**: Link whose target type is specified by another field
- **table**: Embedded child table with multiple records
- **table_multiselect**: Multi-select interface for linked records

### Choice Types
- **select**: Dropdown select from predefined options
- **autocomplete**: Intelligent suggestions based on existing data
- **multiselect**: Multiple choice selection with checkboxes
- **radio**: Single choice from radio button group
- **checkbox**: Boolean toggle checkbox

### Files & Media Types
- **attach**: General file attachment via file manager
- **attach_image**: Image-only file attachment with preview
- **image**: Display image from existing attach field
- **signature**: Digital signature capture and display
- **barcode**: Barcode input/display with scanning capability

### Visual/Layout Types
- **color**: Color picker with hex value input
- **heading**: Section heading for form organization
- **button**: Action button (triggers events, no data storage)
- **read_only**: Non-editable display field for computed values
- **icon**: Icon display for visual enhancement

### Specialized Types
- **geolocation**: Map-based location picker with GPS coordinates
- **json**: Structured JSON data with syntax highlighting
- **password**: Masked password input with security features
- **phone**: Phone number with international formatting
- **email**: Email address with validation
- **url**: Website URL with format validation

### Additional Web-Optimized Types
- **number**: HTML5 number input with steppers
- **range**: Slider control for numeric ranges
- **search**: Search input with autocomplete styling
- **switch**: Toggle switch for boolean values
- **tags**: Dynamic tag input system
- **file**: Modern file upload with drag-and-drop

INTELLIGENT FIELD TYPE SELECTION GUIDE:

**Personal Information:**
- Names, titles → data
- Addresses → small_text
- Bio, descriptions → long_text or markdown
- Phone → phone
- Email → email
- Website → url

**Business/Enterprise:**
- Customer references → link (targetDocType: "Customer")
- Product catalogs → table_multiselect
- Pricing → currency
- Quantities → int or float
- Ratings/Reviews → rating
- Status fields → select with predefined options

**Content Management:**
- Articles, blogs → markdown or html
- Code snippets → code
- File documents → attach
- Images → attach_image
- Digital signatures → signature

**Data Collection:**
- Surveys → rating, select, multiselect, text
- Feedback → rating + long_text
- Preferences → multiselect or checkbox
- Agreements → checkbox

**Technical/Advanced:**
- API responses → json
- Geographic data → geolocation
- Color preferences → color
- Configuration → json or code
- Computed values → read_only

**Temporal Data:**
- Birthdays, deadlines → date
- Appointments → datetime
- Work hours → time
- Project duration → duration

SCHEMA STRUCTURE WITH FRAPPE ENHANCEMENTS:
{
  "title": "Form Title",
  "description": "Detailed form description",
  "fields": [
    {
      "name": "fieldName",
      "label": "Display Label",
      "type": "frappe_field_type",
      "required": true|false,
      "placeholder": "Helpful placeholder",
      "description": "Field explanation or help text",
      
      // Choice field options
      "options": ["option1", "option2"],
      
      // Numeric constraints
      "min": 0,
      "max": 100,
      "step": 1,
      "precision": 2,
      
      // Currency specific
      "currency": "USD",
      
      // File constraints
      "multiple": true|false,
      "accept": ".pdf,.doc,.docx",
      "validation": {
        "fileSize": "10MB",
        "fileTypes": ["pdf", "doc", "docx"]
      },
      
      // Link field specifics
      "targetDocType": "Customer",
      "linkFilters": {"status": "Active"},
      
      // Rating specifics
      "maxStars": 5,
      "allowHalfRating": true,
      
      // Geolocation specifics
      "mapType": "roadmap",
      
      // Default value
      "defaultValue": "default_value",
      
      // Advanced validation
      "validation": {
        "minLength": 3,
        "maxLength": 50,
        "min": 0,
        "max": 100,
        "pattern": "regex_pattern",
        "custom": "Custom validation message"
      }
    }
  ],
  "submitText": "Submit Form",
  "resetText": "Reset"
}

CONTEXT-AWARE INTELLIGENCE:

**CRM/Sales Forms:**
- Contact: data (name), email, phone, link (company), select (lead_source)
- Opportunity: link (customer), currency (amount), percent (probability), date (close_date)

**HR/Recruitment:**
- Application: data (name), email, phone, attach (resume), select (position), rating (experience_level)
- Performance: link (employee), rating (performance), long_text (feedback), date (review_date)

**E-commerce:**
- Product: data (name), long_text (description), currency (price), attach_image (photo), multiselect (categories)
- Order: link (customer), table (order_items), currency (total), select (status)

**Healthcare:**
- Patient: data (name), date (birth_date), phone, email, multiselect (allergies), long_text (medical_history)
- Appointment: link (patient), link (doctor), datetime (appointment_time), select (type)

**Education:**
- Student: data (name), email, date (birth_date), link (course), percent (grade), attach (transcript)
- Course: data (name), long_text (description), int (credits), link (instructor), date (start_date)

**Project Management:**
- Project: data (name), long_text (description), date (start_date), date (end_date), percent (progress)
- Task: data (title), long_text (description), link (project), link (assignee), select (priority), select (status)

**Financial:**
- Invoice: link (customer), currency (amount), date (due_date), percent (tax_rate), select (status)
- Expense: data (description), currency (amount), date (expense_date), select (category), attach (receipt)

**Content Management:**
- Article: data (title), markdown (content), data (author), date (publish_date), multiselect (tags)
- Media: data (title), attach_image (file), long_text (description), data (alt_text)

ADVANCED VALIDATION RULES:
- Email fields: RFC 5322 compliant validation
- Phone fields: International format support with country codes
- URL fields: Protocol validation (http/https)
- Currency fields: Precision based on currency type
- File fields: MIME type and size validation
- Link fields: Existence validation in target DocType
- Date fields: Range validation and business logic
- JSON fields: Schema validation support

INTELLIGENT DEFAULTS:
- Set appropriate field lengths based on data type
- Apply industry-standard validation patterns
- Include helpful placeholders and descriptions
- Choose optimal field types for data relationships
- Add currency symbols for financial forms
- Include file type restrictions for security
- Set reasonable numeric ranges
- Configure rating scales appropriately

Return ONLY valid JSON. Ensure field names are camelCase and unique. Choose the most appropriate Frappe field type for each data requirement.`

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
      // Basic Data Types
      'data', 'small_text', 'long_text', 'text', 'markdown', 'html', 'code',
      // Numeric Types  
      'int', 'float', 'currency', 'percent', 'rating',
      // Date & Time
      'date', 'datetime', 'time', 'duration',
      // Relationships
      'link', 'dynamic_link', 'table', 'table_multiselect',
      // Choice
      'select', 'autocomplete', 'multiselect', 'radio', 'checkbox',
      // Files & Media
      'attach', 'attach_image', 'image', 'signature', 'barcode',
      // Visual/Layout/UI
      'color', 'heading', 'button', 'read_only', 'icon',
      // Specialized
      'geolocation', 'json', 'password', 'phone', 'email', 'url',
      // Additional Web Types
      'number', 'range', 'search', 'switch', 'tags', 'file'
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
      if (['select', 'multiselect', 'radio', 'autocomplete'].includes(field.type) && (!field.options || field.options.length === 0)) {
        return NextResponse.json({ 
          error: `Field type '${field.type}' requires options array. Field: ${field.name}` 
        }, { status: 500 })
      }

      // Validate link fields
      if (['link', 'dynamic_link'].includes(field.type) && field.type === 'link' && !field.targetDocType) {
        console.warn(`Link field '${field.name}' should specify targetDocType for better UX`)
      }

      // Validate currency fields
      if (field.type === 'currency' && !field.currency) {
        // Set default currency if not specified
        field.currency = 'USD'
      }

      // Validate rating fields
      if (field.type === 'rating') {
        if (!field.maxStars) field.maxStars = 5
        if (field.maxStars < 3 || field.maxStars > 10) {
          field.maxStars = 5 // Reset to default if invalid
        }
      }

      // Validate file fields
      if (['attach', 'attach_image', 'file'].includes(field.type)) {
        if (field.type === 'attach_image' && !field.accept) {
          field.accept = '.jpg,.jpeg,.png,.gif,.webp'
        }
        if (!field.validation) field.validation = {}
        if (!field.validation.fileSize) field.validation.fileSize = '10MB'
      }

      // Validate geolocation fields
      if (field.type === 'geolocation' && !field.mapType) {
        field.mapType = 'roadmap'
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