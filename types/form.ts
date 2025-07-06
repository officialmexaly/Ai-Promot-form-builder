// types/form.ts
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number';
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  checkboxLabel?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{
    value: string;
    label: string;
  }>;
  validation?: (value: any) => boolean | string;
}

export interface FormConfig {
  title?: string;
  description?: string;
  submitText?: string;
  fields: FormField[];
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}