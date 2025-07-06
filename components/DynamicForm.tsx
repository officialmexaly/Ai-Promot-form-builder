import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Brain, Database, FileText, Building, DollarSign, Users, Shield, Calendar, Map, Code, Zap, Workflow, Bot, Target, Globe, Lock, TrendingUp, ChevronRight, Play, Wand2, Settings, GitBranch, BarChart3, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type: 'data' | 'small_text' | 'long_text' | 'text' | 'markdown' | 'html' | 'code' |
        'int' | 'float' | 'currency' | 'percent' | 'rating' |
        'date' | 'datetime' | 'time' | 'duration' |
        'link' | 'dynamic_link' | 'table' | 'table_multiselect' |
        'select' | 'autocomplete' | 'multiselect' | 'radio' | 'checkbox' |
        'attach' | 'attach_image' | 'image' | 'signature' | 'barcode' |
        'color' | 'heading' | 'button' | 'read_only' | 'icon' |
        'geolocation' | 'json' | 'password' | 'phone' | 'email' | 'url' |
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
  conditional?: {
    dependsOn: string;
    value: any;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'in';
  };
  aiEnhanced?: {
    autoComplete?: boolean;
    smartValidation?: boolean;
    predictiveText?: boolean;
    contextualHelp?: boolean;
  };
}

interface Schema {
  title: string;
  description: string;
  category: string;
  fields: Field[];
  submitText: string;
  resetText: string;
  mexalyFeatures?: {
    processAutomation?: {
      enabled: boolean;
      triggers: string[];
      actions: string[];
    };
    aiInsights?: {
      enabled: boolean;
      analytics: string[];
      predictions: string[];
    };
    integrations?: {
      erp: boolean;
      crm: boolean;
      accounting: boolean;
      hr: boolean;
      compliance: boolean;
      analytics: boolean;
    };
    security?: {
      encryption: boolean;
      auditTrail: boolean;
      roleBasedAccess: boolean;
      complianceFrameworks: string[];
    };
    workflow?: {
      stages: Array<{
        name: string;
        fields: string[];
        approvers?: string[];
        conditions?: Array<{
          field: string;
          operator: string;
          value: any;
        }>;
        automation?: {
          email: boolean;
          webhook: boolean;
          dataSync: boolean;
        };
      }>;
    };
  };
}

const MexalyAIFormBuilder = () => {
  const [selectedPromptType, setSelectedPromptType] = useState('');
  const [businessContext, setBusinessContext] = useState('');
  const [userInput, setUserInput] = useState('');
  const [generatedSchema, setGeneratedSchema] = useState<Schema | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const businessSolutions = [
    {
      id: 'process_automation',
      name: 'Process Automation',
      icon: Workflow,
      color: 'bg-blue-600',
      description: 'Intelligent workflows that eliminate manual tasks',
      capabilities: ['Smart Routing', 'Auto-approval', 'Data Validation', 'Exception Handling'],
      examples: ['Employee Onboarding', 'Purchase Requests', 'Invoice Processing', 'Quality Control']
    },
    {
      id: 'compliance_governance',
      name: 'Compliance & Governance',
      icon: Shield,
      color: 'bg-red-600',
      description: 'Automated compliance with audit trails and controls',
      capabilities: ['Audit Trails', 'Role-based Access', 'Data Privacy', 'Regulatory Reporting'],
      examples: ['KYC Forms', 'Risk Assessments', 'Compliance Checklists', 'Incident Reports']
    },
    {
      id: 'data_intelligence',
      name: 'Data Intelligence',
      icon: BarChart3,
      color: 'bg-purple-600',
      description: 'AI-powered insights and predictive analytics',
      capabilities: ['Predictive Analytics', 'Anomaly Detection', 'Real-time Dashboards', 'ML Insights'],
      examples: ['Performance Reviews', 'Customer Surveys', 'Financial Planning', 'Market Research']
    },
    {
      id: 'customer_experience',
      name: 'Customer Experience',
      icon: Users,
      color: 'bg-green-600',
      description: 'Omnichannel experiences with personalization',
      capabilities: ['Personalization', 'Multi-channel', 'Journey Mapping', 'Feedback Loops'],
      examples: ['Service Requests', 'Product Registration', 'Support Tickets', 'Feedback Forms']
    },
    {
      id: 'financial_operations',
      name: 'Financial Operations',
      icon: DollarSign,
      color: 'bg-orange-600',
      description: 'Integrated financial processes with real-time controls',
      capabilities: ['Real-time Validation', 'Integration APIs', 'Fraud Detection', 'Cost Analytics'],
      examples: ['Expense Reports', 'Budget Requests', 'Vendor Applications', 'Invoice Approvals']
    },
    {
      id: 'enterprise_integration',
      name: 'Enterprise Integration',
      icon: Globe,
      color: 'bg-indigo-600',
      description: 'Seamless connectivity with existing enterprise systems',
      capabilities: ['API Integration', 'Data Sync', 'SSO Authentication', 'Legacy Systems'],
      examples: ['System Onboarding', 'Data Migration', 'API Configurations', 'Integration Testing']
    }
  ];

  const intelligentPromptBuilder = (category: string, context: string, description: string) => {
    const categoryConfigs = {
      process_automation: {
        focusAreas: ['workflow_efficiency', 'task_automation', 'approval_chains', 'exception_handling'],
        aiFeatures: {
          smartRouting: true,
          autoValidation: true,
          predictiveFields: true,
          contextualHelp: true
        },
        standardFields: {
          requestor: { type: 'link', target: 'User' },
          priority: { type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
          deadline: { type: 'datetime' },
          approval_status: { type: 'select', options: ['Pending', 'Approved', 'Rejected', 'On Hold'] }
        },
        mexalyIntegrations: {
          processAutomation: true,
          aiInsights: true,
          workflow: true
        }
      },
      compliance_governance: {
        focusAreas: ['regulatory_compliance', 'audit_trails', 'risk_management', 'data_governance'],
        aiFeatures: {
          complianceCheck: true,
          riskScoring: true,
          auditGeneration: true,
          regulatoryUpdates: true
        },
        standardFields: {
          compliance_officer: { type: 'link', target: 'User' },
          risk_level: { type: 'rating', maxStars: 5 },
          regulatory_framework: { type: 'multiselect', options: ['SOX', 'GDPR', 'HIPAA', 'ISO27001'] },
          audit_signature: { type: 'signature' }
        },
        mexalyIntegrations: {
          security: true,
          auditTrail: true,
          compliance: true
        }
      },
      data_intelligence: {
        focusAreas: ['analytics', 'insights', 'predictions', 'reporting'],
        aiFeatures: {
          predictiveAnalytics: true,
          anomalyDetection: true,
          naturalLanguageQuery: true,
          autoInsights: true
        },
        standardFields: {
          metric_type: { type: 'select', options: ['KPI', 'Metric', 'Dimension', 'Measure'] },
          data_source: { type: 'link', target: 'DataSource' },
          frequency: { type: 'select', options: ['Real-time', 'Hourly', 'Daily', 'Weekly', 'Monthly'] },
          visualization: { type: 'multiselect', options: ['Chart', 'Table', 'Dashboard', 'Report'] }
        },
        mexalyIntegrations: {
          aiInsights: true,
          analytics: true,
          predictiveModels: true
        }
      },
      customer_experience: {
        focusAreas: ['customer_journey', 'personalization', 'multichannel', 'satisfaction'],
        aiFeatures: {
          personalizedExperience: true,
          sentimentAnalysis: true,
          chatbotIntegration: true,
          behaviorPrediction: true
        },
        standardFields: {
          customer_id: { type: 'link', target: 'Customer' },
          interaction_channel: { type: 'select', options: ['Web', 'Mobile', 'Email', 'Phone', 'Chat'] },
          satisfaction_score: { type: 'rating', maxStars: 10 },
          journey_stage: { type: 'select', options: ['Awareness', 'Consideration', 'Purchase', 'Retention'] }
        },
        mexalyIntegrations: {
          crm: true,
          customerInsights: true,
          omnichannel: true
        }
      },
      financial_operations: {
        focusAreas: ['financial_control', 'cost_management', 'fraud_prevention', 'compliance'],
        aiFeatures: {
          fraudDetection: true,
          costOptimization: true,
          predictiveBudgeting: true,
          riskAssessment: true
        },
        standardFields: {
          amount: { type: 'currency', currency: 'USD' },
          cost_center: { type: 'link', target: 'CostCenter' },
          budget_category: { type: 'select', options: ['OPEX', 'CAPEX', 'Revenue', 'Investment'] },
          approval_limit: { type: 'currency', currency: 'USD' }
        },
        mexalyIntegrations: {
          accounting: true,
          erp: true,
          fraudDetection: true
        }
      },
      enterprise_integration: {
        focusAreas: ['system_connectivity', 'data_sync', 'api_management', 'legacy_modernization'],
        aiFeatures: {
          autoMapping: true,
          dataTransformation: true,
          errorPrediction: true,
          performanceOptimization: true
        },
        standardFields: {
          system_name: { type: 'data' },
          integration_type: { type: 'select', options: ['API', 'Database', 'File', 'Message Queue'] },
          data_format: { type: 'select', options: ['JSON', 'XML', 'CSV', 'Binary'] },
          sync_frequency: { type: 'select', options: ['Real-time', 'Batch', 'Scheduled', 'Event-driven'] }
        },
        mexalyIntegrations: {
          apiGateway: true,
          dataHub: true,
          systemConnectors: true
        }
      }
    };

    const config = categoryConfigs[category as keyof typeof categoryConfigs];
    if (!config) return null;

    // AI-powered field generation based on context and description
    const contextTerms = context.toLowerCase().split(' ');
    const descTerms = description.toLowerCase().split(' ');
    const allTerms = [...contextTerms, ...descTerms];

    const relevantFields = Object.keys(config.standardFields).filter(field => {
      const fieldTerms = field.toLowerCase().split('_');
      return fieldTerms.some(term => allTerms.includes(term)) || 
             allTerms.some(term => field.toLowerCase().includes(term));
    });

    // Generate intelligent field mapping
    const fields: Field[] = relevantFields.map(fieldName => {
      const fieldConfig = config.standardFields[fieldName as keyof typeof config.standardFields];
      return {
        name: fieldName,
        label: fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: fieldConfig.type as any,
        required: config.focusAreas.some(area => fieldName.includes(area.split('_')[0])),
        ...(fieldConfig.options && { options: fieldConfig.options }),
        ...(fieldConfig.currency && { currency: fieldConfig.currency }),
        ...(fieldConfig.maxStars && { maxStars: fieldConfig.maxStars }),
        ...(fieldConfig.target && { targetDocType: fieldConfig.target }),
        aiEnhanced: {
          autoComplete: config.aiFeatures.predictiveFields || false,
          smartValidation: config.aiFeatures.autoValidation || false,
          predictiveText: config.aiFeatures.predictiveFields || false,
          contextualHelp: config.aiFeatures.contextualHelp || false
        }
      };
    });

    // Add context-specific fields based on description analysis
    const additionalFields = generateContextualFields(description, category);
    fields.push(...additionalFields);

    const mexalyFeatures = {
      processAutomation: {
        enabled: config.mexalyIntegrations.processAutomation || false,
        triggers: ['form_submit', 'field_change', 'approval_required'],
        actions: ['send_notification', 'update_record', 'trigger_workflow']
      },
      aiInsights: {
        enabled: config.mexalyIntegrations.aiInsights || false,
        analytics: ['completion_rate', 'field_accuracy', 'user_behavior'],
        predictions: ['approval_likelihood', 'completion_time', 'error_probability']
      },
      integrations: {
        erp: config.mexalyIntegrations.erp || false,
        crm: config.mexalyIntegrations.crm || false,
        accounting: config.mexalyIntegrations.accounting || false,
        hr: category === 'process_automation',
        compliance: config.mexalyIntegrations.compliance || false,
        analytics: config.mexalyIntegrations.analytics || false
      },
      security: {
        encryption: true,
        auditTrail: config.mexalyIntegrations.auditTrail || false,
        roleBasedAccess: true,
        complianceFrameworks: category === 'compliance_governance' ? 
          ['SOC2', 'GDPR', 'HIPAA', 'ISO27001'] : ['SOC2']
      },
      workflow: generateIntelligentWorkflow(category, fields)
    };

    return {
      title: `${config.focusAreas[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Form`,
      description: description,
      category: category,
      fields: fields,
      submitText: 'Process with Mexaly AI',
      resetText: 'Reset',
      mexalyFeatures: mexalyFeatures
    };
  };

  const generateContextualFields = (description: string, category: string): Field[] => {
    const additionalFields: Field[] = [];
    const desc = description.toLowerCase();

    // Smart field detection based on keywords
    if (desc.includes('document') || desc.includes('file') || desc.includes('upload')) {
      additionalFields.push({
        name: 'supporting_documents',
        label: 'Supporting Documents',
        type: 'attach',
        multiple: true,
        accept: '.pdf,.doc,.docx,.xls,.xlsx',
        aiEnhanced: {
          autoComplete: false,
          smartValidation: true,
          predictiveText: false,
          contextualHelp: true
        }
      });
    }

    if (desc.includes('location') || desc.includes('address') || desc.includes('map')) {
      additionalFields.push({
        name: 'location',
        label: 'Location',
        type: 'geolocation',
        mapType: 'roadmap',
        aiEnhanced: {
          autoComplete: true,
          smartValidation: true,
          predictiveText: false,
          contextualHelp: true
        }
      });
    }

    if (desc.includes('signature') || desc.includes('approval') || desc.includes('sign')) {
      additionalFields.push({
        name: 'digital_signature',
        label: 'Digital Signature',
        type: 'signature',
        required: true,
        aiEnhanced: {
          autoComplete: false,
          smartValidation: true,
          predictiveText: false,
          contextualHelp: true
        }
      });
    }

    if (desc.includes('comment') || desc.includes('note') || desc.includes('feedback')) {
      additionalFields.push({
        name: 'comments',
        label: 'Comments',
        type: 'long_text',
        placeholder: 'Enter additional comments or notes...',
        aiEnhanced: {
          autoComplete: true,
          smartValidation: false,
          predictiveText: true,
          contextualHelp: true
        }
      });
    }

    return additionalFields;
  };

  const generateIntelligentWorkflow = (category: string, fields: Field[]) => {
    const workflowTemplates: Record<string, any> = {
      process_automation: {
        stages: [
          { 
            name: 'Initiation', 
            fields: fields.slice(0, Math.ceil(fields.length / 3)).map(f => f.name),
            automation: { email: true, webhook: false, dataSync: true }
          },
          { 
            name: 'Review', 
            fields: fields.slice(Math.ceil(fields.length / 3), Math.ceil(2 * fields.length / 3)).map(f => f.name),
            approvers: ['manager', 'department_head'],
            automation: { email: true, webhook: true, dataSync: true }
          },
          { 
            name: 'Approval', 
            fields: fields.slice(Math.ceil(2 * fields.length / 3)).map(f => f.name),
            approvers: ['executive'],
            automation: { email: true, webhook: true, dataSync: true }
          }
        ]
      },
      compliance_governance: {
        stages: [
          { 
            name: 'Documentation', 
            fields: fields.filter(f => f.type === 'attach' || f.type === 'long_text').map(f => f.name),
            automation: { email: true, webhook: false, dataSync: true }
          },
          { 
            name: 'Compliance Review', 
            fields: fields.filter(f => f.name.includes('compliance') || f.name.includes('risk')).map(f => f.name),
            approvers: ['compliance_officer'],
            automation: { email: true, webhook: true, dataSync: true }
          },
          { 
            name: 'Final Approval', 
            fields: fields.filter(f => f.type === 'signature').map(f => f.name),
            approvers: ['legal_team'],
            automation: { email: true, webhook: true, dataSync: true }
          }
        ]
      }
    };

    return workflowTemplates[category] || {
      stages: [
        { 
          name: 'Submission', 
          fields: fields.map(f => f.name),
          automation: { email: true, webhook: false, dataSync: true }
        }
      ]
    };
  };

  const handleGenerate = async () => {
    if (!selectedPromptType || !userInput.trim()) return;

    setIsGenerating(true);
    
    try {
      // Simulate AI processing with Mexaly intelligence
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const schema = intelligentPromptBuilder(selectedPromptType, businessContext, userInput);
      setGeneratedSchema(schema);
      setActiveTab('preview');
      
      // Scroll to results
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderField = (field: Field, index: number) => {
    const inputClasses = "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";
    const enhancedClasses = field.aiEnhanced?.smartValidation ? 
      `${inputClasses} border-blue-300 bg-blue-50/30` : inputClasses;
    
    switch (field.type) {
      case 'data':
      case 'email':
      case 'url':
      case 'phone':
        return (
          <div key={index} className="relative">
            <input
              type={field.type === 'data' ? 'text' : field.type}
              placeholder={field.placeholder || field.label}
              className={enhancedClasses}
              required={field.required}
            />
            {field.aiEnhanced?.autoComplete && (
              <div className="absolute right-3 top-3">
                <Bot className="w-5 h-5 text-blue-500" />
              </div>
            )}
          </div>
        );
      
      case 'small_text':
      case 'long_text':
        return (
          <div key={index} className="relative">
            <textarea
              rows={field.type === 'small_text' ? 3 : 6}
              placeholder={field.placeholder || field.label}
              className={enhancedClasses}
              required={field.required}
            />
            {field.aiEnhanced?.predictiveText && (
              <div className="absolute right-3 top-3">
                <Wand2 className="w-5 h-5 text-purple-500" />
              </div>
            )}
          </div>
        );
      
      case 'currency':
        return (
          <div key={index} className="relative">
            <span className="absolute left-4 top-3 text-gray-500 font-medium">
              {field.currency || 'USD'}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className={`${enhancedClasses} pl-16`}
              required={field.required}
            />
            <div className="absolute right-3 top-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
        );
      
      case 'rating':
        return (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(field.maxStars || 5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="text-3xl text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                >
                  ★
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-3">AI-Enhanced Rating</span>
          </div>
        );
      
      case 'select':
        return (
          <div key={index} className="relative">
            <select className={enhancedClasses} required={field.required}>
              <option value="">Select {field.label}</option>
              {field.options?.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
            {field.aiEnhanced?.contextualHelp && (
              <div className="absolute right-10 top-3">
                <Brain className="w-5 h-5 text-indigo-500" />
              </div>
            )}
          </div>
        );
      
      case 'multiselect':
        return (
          <div key={index} className="space-y-3 p-4 border-2 border-gray-200 rounded-lg">
            {field.options?.map((option, i) => (
              <label key={i} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'attach':
        return (
          <div key={index} className="relative">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">Supports: {field.accept || 'All file types'}</p>
              <input
                type="file"
                accept={field.accept}
                multiple={field.multiple}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required={field.required}
              />
            </div>
          </div>
        );
      
      case 'signature':
        return (
          <div key={index} className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50/30">
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-500 mr-2" />
              <Lock className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-blue-700 font-medium">Secure Digital Signature</p>
            <p className="text-sm text-blue-600 mt-2">Mexaly-protected with audit trail</p>
          </div>
        );
      
      case 'geolocation':
        return (
          <div key={index} className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 h-48 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-700 font-medium">Interactive Map</p>
                <p className="text-sm text-blue-600">AI-Enhanced Location Services</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <input
            key={index}
            type="text"
            placeholder={field.placeholder || field.label}
            className={enhancedClasses}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mexaly Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Mexaly</h1>
                  <p className="text-sm text-gray-500">Intelligent Business Solutions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span>Enterprise-Grade</span>
              <Lock className="w-4 h-4 ml-3" />
              <span>SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-6">
            <Bot className="w-4 h-4 mr-2" />
            AI-Powered Form Intelligence
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Business with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Intelligent Forms
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Mexaly's AI-powered form builder creates enterprise-grade solutions with intelligent automation, 
            compliance controls, and seamless integrations. From simple data collection to complex business processes.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Smart Process Automation
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Enterprise Security & Compliance
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              AI-Powered Insights
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Seamless Integrations
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-2 mb-8">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
              activeTab === 'builder'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Wand2 className="w-5 h-5 mr-2" />
            AI Form Builder
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            disabled={!generatedSchema}
          >
            <Play className="w-5 h-5 mr-2" />
            Preview & Deploy
          </button>
        </div>

        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Business Solutions Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Business Solution Type
                </h2>
                <div className="space-y-3">
                  {businessSolutions.map((solution) => {
                    const IconComponent = solution.icon;
                    return (
                      <button
                        key={solution.id}
                        onClick={() => setSelectedPromptType(solution.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedPromptType === solution.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${solution.color}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-semibold text-gray-900 mb-1">{solution.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{solution.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {solution.capabilities.slice(0, 2).map((cap, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Form Configuration */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Intelligent Form Configuration
                </h2>
                
                {/* Business Context */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Context (Optional)
                  </label>
                  <input
                    type="text"
                    value={businessContext}
                    onChange={(e) => setBusinessContext(e.target.value)}
                    placeholder="e.g., Manufacturing company, Healthcare provider, Financial services..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Form Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Business Process
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Describe your business process in detail. For example: 'Create an employee expense reimbursement form with receipt uploads, approval workflow, integration with accounting system, and automatic budget validation...'"
                    className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Be specific about workflows, approvals, integrations, and compliance requirements
                  </div>
                </div>

                {/* Advanced Features Toggle */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Mexaly Features
                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAdvancedFeatures ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {showAdvancedFeatures && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Process Automation</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">AI Insights</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Audit Trails</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Role-based Access</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {selectedPromptType && (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {businessSolutions.find(s => s.id === selectedPromptType)?.name} selected
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedPromptType || !userInput.trim() || isGenerating}
                    className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center ${
                      !selectedPromptType || !userInput.trim() || isGenerating
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Mexaly AI Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate with Mexaly AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && generatedSchema && (
          <div ref={formRef} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            {/* Schema Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{generatedSchema.title}</h2>
                  <p className="text-gray-600 text-lg">{generatedSchema.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✓ AI Generated
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Mexaly Enhanced
                  </span>
                </div>
              </div>
              
              {/* Mexaly Features Display */}
              {generatedSchema.mexalyFeatures && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {generatedSchema.mexalyFeatures.integrations && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <Database className="w-4 h-4 mr-2" />
                        Integrations
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(generatedSchema.mexalyFeatures.integrations).map(([key, enabled]) => (
                          enabled && (
                            <span key={key} className="inline-block text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded mr-1">
                              {key.toUpperCase()}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generatedSchema.mexalyFeatures.security && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Security & Compliance
                      </h4>
                      <div className="space-y-1">
                        {generatedSchema.mexalyFeatures.security.complianceFrameworks.map((framework, i) => (
                          <span key={i} className="inline-block text-xs bg-green-200 text-green-800 px-2 py-1 rounded mr-1">
                            {framework}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generatedSchema.mexalyFeatures.aiInsights && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-2" />
                        AI Insights
                      </h4>
                      <div className="space-y-1">
                        {generatedSchema.mexalyFeatures.aiInsights.analytics.slice(0, 2).map((analytic, i) => (
                          <span key={i} className="inline-block text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded mr-1">
                            {analytic.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Preview */}
            <form className="space-y-8">
              {generatedSchema.fields.map((field, index) => (
                <div key={index} className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    {field.aiEnhanced && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Enhanced
                      </span>
                    )}
                  </label>
                  {field.description && (
                    <p className="text-sm text-gray-600">{field.description}</p>
                  )}
                  {renderField(field, index)}
                  {field.validation && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      Validation: {JSON.stringify(field.validation, null, 1)}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex space-x-4 pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg flex items-center"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  {generatedSchema.submitText}
                </button>
                <button
                  type="reset"
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  {generatedSchema.resetText}
                </button>
              </div>
            </form>

            {/* Workflow Preview */}
            {generatedSchema.mexalyFeatures?.workflow && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <GitBranch className="w-6 h-6 mr-3 text-blue-600" />
                  Intelligent Workflow
                </h3>
                <div className="flex space-x-6 overflow-x-auto pb-4">
                  {generatedSchema.mexalyFeatures.workflow.stages.map((stage, index) => (
                    <div key={index} className="min-w-80 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Fields</h5>
                          <div className="space-y-1">
                            {stage.fields.map((fieldName, i) => {
                              const field = generatedSchema.fields.find(f => f.name === fieldName);
                              return (
                                <div key={i} className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                  {field?.label || fieldName}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {stage.approvers && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Approvers</h5>
                            <div className="space-y-1">
                              {stage.approvers.map((approver, i) => (
                                <div key={i} className="flex items-center text-sm text-blue-600">
                                  <Users className="w-3 h-3 mr-2" />
                                  {approver.replace(/_/g, ' ')}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {stage.automation && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Automation</h5>
                            <div className="flex space-x-2">
                              {stage.automation.email && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Email</span>
                              )}
                              {stage.automation.webhook && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Webhook</span>
                              )}
                              {stage.automation.dataSync && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Data Sync</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Schema JSON */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Code className="w-6 h-6 mr-3 text-purple-600" />
                Mexaly Schema Export
              </h3>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                  <span className="text-gray-300 text-sm font-medium">schema.json</span>
                  <button className="text-gray-400 hover:text-white text-sm">Copy</button>
                </div>
                <pre className="text-green-400 p-6 overflow-x-auto text-sm leading-relaxed">
                  {JSON.stringify(generatedSchema, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Mexaly Platform Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Workflow,
              title: 'Smart Automation',
              description: 'Reduce manual tasks by up to 80% with intelligent process automation',
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: Shield,
              title: 'Enterprise Security',
              description: 'SOC 2, HIPAA, GDPR compliant with advanced threat protection',
              color: 'from-red-500 to-red-600'
            },
            {
              icon: BarChart3,
              title: 'AI Insights',
              description: 'Predictive analytics and real-time monitoring with ML-powered insights',
              color: 'from-purple-500 to-purple-600'
            },
            {
              icon: Globe,
              title: 'Seamless Integration',
              description: 'Connect with existing systems via comprehensive API ecosystem',
              color: 'from-green-500 to-green-600'
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Business Outcomes */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Proven Business Outcomes</h3>
            <p className="text-xl opacity-90">Transform your organization with Mexaly's intelligent platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: '80%', label: 'Reduction in Manual Tasks', icon: Clock },
              { metric: '60%', label: 'Faster Time-to-Market', icon: TrendingUp },
              { metric: '40%', label: 'Cost Optimization', icon: DollarSign },
              { metric: '99.9%', label: 'System Reliability', icon: Shield }
            ].map((outcome, index) => {
              const IconComponent = outcome.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-8 h-8 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{outcome.metric}</div>
                  <div className="text-sm opacity-90">{outcome.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MexalyAIFormBuilder;