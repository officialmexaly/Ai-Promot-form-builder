// File: components/IntelligentFormBuilder.tsx
import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Wand2, 
  Sparkles, 
  Brain, 
  Target, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  FileText,
  Users,
  Settings,
  Globe,
  Shield,
  Lightbulb,
  TrendingUp,
  Briefcase,
  Code,
  Stethoscope,
  Scale,
  GraduationCap,
  Building,
  DollarSign,
  Palette,
  Truck,
  Camera,
  Cpu,
  Play,
  Loader2,
  Star,
  Award,
  Rocket
} from 'lucide-react';

interface Props {
  onFormGenerated?: (schema: any) => void;
}

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  rows?: number;
  aiEnhanced?: boolean;
}

interface GeneratedForm {
  title: string;
  description: string;
  fields: Field[];
  aiEnhancements: {
    smartValidation: boolean;
    autoComplete: boolean;
    contextualHelp: boolean;
    predictiveFields: boolean;
  };
}

const IntelligentFormBuilder = ({ onFormGenerated }: Props) => {
  const [selectedProfession, setSelectedProfession] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<GeneratedForm | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [aiPersonality, setAiPersonality] = useState('adaptive');
  const [complexityLevel, setComplexityLevel] = useState('intermediate');

  const professions = [
    { 
      id: 'healthcare', 
      name: 'Healthcare Professional', 
      icon: Stethoscope, 
      color: 'bg-red-500', 
      description: 'Medical forms, patient intake, treatment plans' 
    },
    { 
      id: 'legal', 
      name: 'Legal Professional', 
      icon: Scale, 
      color: 'bg-purple-500', 
      description: 'Legal documents, contracts, case management' 
    },
    { 
      id: 'education', 
      name: 'Education Specialist', 
      icon: GraduationCap, 
      color: 'bg-green-500', 
      description: 'Student forms, assessments, academic records' 
    },
    { 
      id: 'finance', 
      name: 'Financial Advisor', 
      icon: DollarSign, 
      color: 'bg-blue-500', 
      description: 'Financial planning, investment forms, risk assessment' 
    },
    { 
      id: 'technology', 
      name: 'Tech Professional', 
      icon: Cpu, 
      color: 'bg-indigo-500', 
      description: 'Software forms, system configs, user feedback' 
    },
    { 
      id: 'marketing', 
      name: 'Marketing Expert', 
      icon: TrendingUp, 
      color: 'bg-pink-500', 
      description: 'Campaign forms, lead generation, market research' 
    },
    { 
      id: 'design', 
      name: 'Creative Designer', 
      icon: Palette, 
      color: 'bg-orange-500', 
      description: 'Design briefs, client feedback, project specs' 
    },
    { 
      id: 'logistics', 
      name: 'Logistics Manager', 
      icon: Truck, 
      color: 'bg-yellow-500', 
      description: 'Shipping forms, inventory, supply chain' 
    },
    { 
      id: 'business', 
      name: 'Business Analyst', 
      icon: Building, 
      color: 'bg-teal-500', 
      description: 'Business processes, requirements, analysis' 
    },
    { 
      id: 'consulting', 
      name: 'Consultant', 
      icon: Briefcase, 
      color: 'bg-gray-500', 
      description: 'Client intake, proposals, project management' 
    },
    { 
      id: 'media', 
      name: 'Media Professional', 
      icon: Camera, 
      color: 'bg-violet-500', 
      description: 'Content forms, media releases, production' 
    },
    { 
      id: 'custom', 
      name: 'Custom Profession', 
      icon: Users, 
      color: 'bg-slate-500', 
      description: 'Tell us about your unique field' 
    }
  ];

  const aiPersonalities = [
    { 
      id: 'adaptive', 
      name: 'Adaptive Intelligence', 
      description: 'Learns and adapts to your specific needs', 
      icon: Brain 
    },
    { 
      id: 'creative', 
      name: 'Creative Genius', 
      description: 'Innovative and out-of-the-box thinking', 
      icon: Lightbulb 
    },
    { 
      id: 'analytical', 
      name: 'Analytical Mind', 
      description: 'Data-driven and logical approach', 
      icon: Target 
    },
    { 
      id: 'efficient', 
      name: 'Efficiency Expert', 
      description: 'Streamlined and optimized solutions', 
      icon: Zap 
    }
  ];

  const complexityLevels = [
    { 
      id: 'basic', 
      name: 'Basic', 
      description: 'Simple forms with essential fields', 
      color: 'bg-green-100 text-green-800' 
    },
    { 
      id: 'intermediate', 
      name: 'Intermediate', 
      description: 'Moderate complexity with conditional logic', 
      color: 'bg-yellow-100 text-yellow-800' 
    },
    { 
      id: 'advanced', 
      name: 'Advanced', 
      description: 'Complex workflows and integrations', 
      color: 'bg-red-100 text-red-800' 
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise', 
      description: 'Full-scale enterprise solutions', 
      color: 'bg-purple-100 text-purple-800' 
    }
  ];

  const generateIntelligentFields = (profession: string, description: string): Field[] => {
    const baseFields: Field[] = [
      { 
        name: 'name', 
        label: 'Full Name', 
        type: 'text', 
        required: true, 
        aiEnhanced: true,
        placeholder: 'Enter your full name'
      },
      { 
        name: 'email', 
        label: 'Email Address', 
        type: 'email', 
        required: true, 
        aiEnhanced: true,
        placeholder: 'Enter your email address'
      }
    ];

    const professionSpecificFields: Record<string, Field[]> = {
      healthcare: [
        { 
          name: 'patient_id', 
          label: 'Patient ID', 
          type: 'text', 
          required: true,
          placeholder: 'Enter patient ID'
        },
        { 
          name: 'dob', 
          label: 'Date of Birth', 
          type: 'date', 
          required: true 
        },
        { 
          name: 'medical_history', 
          label: 'Medical History', 
          type: 'textarea', 
          rows: 4,
          placeholder: 'Describe relevant medical history'
        },
        { 
          name: 'allergies', 
          label: 'Known Allergies', 
          type: 'multiselect', 
          options: ['None', 'Penicillin', 'Latex', 'Shellfish', 'Peanuts', 'Other'] 
        },
        { 
          name: 'insurance_provider', 
          label: 'Insurance Provider', 
          type: 'select', 
          options: ['Aetna', 'Blue Cross', 'Cigna', 'UnitedHealth', 'Other'] 
        }
      ],
      legal: [
        { 
          name: 'case_number', 
          label: 'Case Number', 
          type: 'text', 
          required: true,
          placeholder: 'Enter case number'
        },
        { 
          name: 'case_type', 
          label: 'Case Type', 
          type: 'select', 
          options: ['Civil', 'Criminal', 'Family', 'Corporate', 'Immigration'] 
        },
        { 
          name: 'urgency', 
          label: 'Urgency Level', 
          type: 'radio', 
          options: ['Low', 'Medium', 'High', 'Critical'] 
        },
        { 
          name: 'legal_description', 
          label: 'Legal Matter Description', 
          type: 'textarea', 
          rows: 6,
          placeholder: 'Describe the legal matter in detail'
        },
        { 
          name: 'documents', 
          label: 'Supporting Documents', 
          type: 'file'
        }
      ],
      technology: [
        { 
          name: 'project_name', 
          label: 'Project Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter project name'
        },
        { 
          name: 'tech_stack', 
          label: 'Technology Stack', 
          type: 'multiselect', 
          options: ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'Go'] 
        },
        { 
          name: 'complexity', 
          label: 'Project Complexity', 
          type: 'range'
        },
        { 
          name: 'timeline', 
          label: 'Expected Timeline', 
          type: 'select', 
          options: ['1-2 weeks', '1 month', '2-3 months', '6+ months'] 
        },
        { 
          name: 'requirements', 
          label: 'Technical Requirements', 
          type: 'textarea', 
          rows: 5,
          placeholder: 'Describe technical requirements and specifications'
        }
      ],
      finance: [
        { 
          name: 'client_id', 
          label: 'Client ID', 
          type: 'text', 
          required: true,
          placeholder: 'Enter client ID'
        },
        { 
          name: 'investment_goal', 
          label: 'Investment Goal', 
          type: 'select', 
          options: ['Retirement', 'Education', 'Home Purchase', 'Wealth Building', 'Other'] 
        },
        { 
          name: 'risk_tolerance', 
          label: 'Risk Tolerance', 
          type: 'radio', 
          options: ['Conservative', 'Moderate', 'Aggressive'] 
        },
        { 
          name: 'investment_amount', 
          label: 'Investment Amount', 
          type: 'number',
          placeholder: 'Enter amount in USD'
        },
        { 
          name: 'financial_goals', 
          label: 'Financial Goals', 
          type: 'textarea', 
          rows: 4,
          placeholder: 'Describe your financial goals and objectives'
        }
      ],
      education: [
        { 
          name: 'student_id', 
          label: 'Student ID', 
          type: 'text', 
          required: true,
          placeholder: 'Enter student ID'
        },
        { 
          name: 'grade_level', 
          label: 'Grade Level', 
          type: 'select', 
          options: ['Elementary', 'Middle School', 'High School', 'College', 'Graduate'] 
        },
        { 
          name: 'subject', 
          label: 'Subject Area', 
          type: 'multiselect', 
          options: ['Mathematics', 'Science', 'English', 'History', 'Arts', 'Physical Education'] 
        },
        { 
          name: 'assessment_type', 
          label: 'Assessment Type', 
          type: 'radio', 
          options: ['Quiz', 'Test', 'Project', 'Assignment', 'Final Exam'] 
        },
        { 
          name: 'notes', 
          label: 'Additional Notes', 
          type: 'textarea', 
          rows: 3,
          placeholder: 'Any additional information or special considerations'
        }
      ]
    };

    return [...baseFields, ...(professionSpecificFields[profession] || [])];
  };

  const handleGenerate = async () => {
    if (!selectedProfession || !formDescription.trim()) return;
    
    setIsGenerating(true);
    setActiveStep(4);
    
    // Simulate AI processing with professional intelligence
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockForm: GeneratedForm = {
      title: `Intelligent ${professions.find(p => p.id === selectedProfession)?.name} Form`,
      description: formDescription,
      fields: generateIntelligentFields(selectedProfession, formDescription),
      aiEnhancements: {
        smartValidation: true,
        autoComplete: true,
        contextualHelp: true,
        predictiveFields: true
      }
    };
    
    setGeneratedForm(mockForm);
    setIsGenerating(false);
    
    // Call the callback if provided
    if (onFormGenerated) {
      onFormGenerated(mockForm);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Profession</h3>
              <p className="text-gray-600">Select your field to unlock specialized AI intelligence</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professions.map((profession) => {
                const IconComponent = profession.icon;
                return (
                  <button
                    key={profession.id}
                    onClick={() => {
                      setSelectedProfession(profession.id);
                      setActiveStep(2);
                    }}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:-translate-y-1 ${
                      selectedProfession === profession.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`w-10 h-10 rounded-lg ${profession.color} flex items-center justify-center mr-3`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{profession.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{profession.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Configure AI Intelligence</h3>
              <p className="text-gray-600">Customize how the AI thinks and approaches your form</p>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">AI Personality</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiPersonalities.map((personality) => {
                    const IconComponent = personality.icon;
                    return (
                      <button
                        key={personality.id}
                        onClick={() => setAiPersonality(personality.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          aiPersonality === personality.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <IconComponent className="w-5 h-5 text-purple-600 mr-2" />
                          <h5 className="font-medium">{personality.name}</h5>
                        </div>
                        <p className="text-sm text-gray-600">{personality.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Complexity Level</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {complexityLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setComplexityLevel(level.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        complexityLevel === level.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-2 ${level.color}`}>
                        {level.name}
                      </div>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Describe Your Form</h3>
              <p className="text-gray-600">Tell the AI what you need - be as detailed as possible</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe your form in detail. For example: 'I need a patient intake form for my dental practice that collects medical history, insurance information, and appointment preferences. The form should include conditional fields based on the type of procedure.'"
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={6}
                />
                <div className="mt-2 text-sm text-gray-500">
                  {formDescription.length}/500 characters
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">AI Enhancement Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                    <span>Smart field suggestions</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-blue-600 mr-2" />
                    <span>Intelligent validation</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-blue-600 mr-2" />
                    <span>Auto-complete features</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-blue-600 mr-2" />
                    <span>Multi-language support</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!formDescription.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Generate Intelligent Form
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {isGenerating ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI is Crafting Your Form</h3>
                <p className="text-gray-600 mb-6">Applying professional intelligence and best practices...</p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                    Analyzing requirements
                  </div>
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    Generating fields
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-1" />
                    Optimizing UX
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Intelligent Form is Ready!</h3>
                  <p className="text-gray-600">AI has generated a professional-grade form with advanced features</p>
                </div>

                {generatedForm && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{generatedForm.title}</h4>
                        <p className="text-gray-600">{generatedForm.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          AI Enhanced
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Professional
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {generatedForm.fields.map((field, index) => (
                        <div key={index} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                            {field.aiEnhanced && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Bot className="w-3 h-3 mr-1" />
                                AI
                              </span>
                            )}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows={field.rows || 3}
                              placeholder={field.placeholder}
                            />
                          ) : field.type === 'select' ? (
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <option value="">Select an option</option>
                              {field.options?.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : field.type === 'multiselect' ? (
                            <div className="space-y-2">
                              {field.options?.map((option, i) => (
                                <label key={i} className="flex items-center">
                                  <input type="checkbox" className="mr-2" />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            </div>
                          ) : field.type === 'radio' ? (
                            <div className="space-y-2">
                              {field.options?.map((option, i) => (
                                <label key={i} className="flex items-center">
                                  <input type="radio" name={field.name} className="mr-2" />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <input
                              type={field.type}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>AI Score: 95%</span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 text-green-500 mr-1" />
                          <span>Security: High</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 text-blue-500 mr-1" />
                          <span>Performance: Optimized</span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Edit Form
                        </button>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                          <Play className="w-4 h-4 mr-2" />
                          Deploy Form
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Intelligent AI Form Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionary form generation powered by profession-specific AI intelligence. 
            Create sophisticated forms that understand your industry and automate your workflow.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {[
              { step: 1, label: 'Profession', icon: Users },
              { step: 2, label: 'AI Config', icon: Settings },
              { step: 3, label: 'Describe', icon: FileText },
              { step: 4, label: 'Generate', icon: Rocket }
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  activeStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  activeStep >= step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {label}
                </span>
                {step < 4 && (
                  <div className={`w-16 h-0.5 ml-8 ${
                    activeStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Powered by advanced AI • Professional-grade security • Enterprise-ready
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntelligentFormBuilder;