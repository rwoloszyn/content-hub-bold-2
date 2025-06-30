import React from 'react';
import { Wand2, FileText, Share2, Mail, Image, Video } from 'lucide-react';
import { AITemplate } from '../../types';

interface AITemplateSelectorProps {
  templates: AITemplate[];
  selectedTemplate: string | null;
  onTemplateSelect: (templateId: string) => void;
}

const categoryIcons = {
  social: Share2,
  blog: FileText,
  marketing: Mail,
  creative: Image,
  video: Video,
};

const categoryColors = {
  social: 'bg-blue-50 text-blue-700 border-blue-200',
  blog: 'bg-green-50 text-green-700 border-green-200',
  marketing: 'bg-purple-50 text-purple-700 border-purple-200',
  creative: 'bg-pink-50 text-pink-700 border-pink-200',
  video: 'bg-orange-50 text-orange-700 border-orange-200',
};

export function AITemplateSelector({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect 
}: AITemplateSelectorProps) {
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, AITemplate[]>);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Template</h3>
      
      <div className="space-y-6">
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons] || FileText;
          const colorClass = categoryColors[category as keyof typeof categoryColors] || 'bg-gray-50 text-gray-700 border-gray-200';
          
          return (
            <div key={category}>
              <div className="flex items-center space-x-2 mb-3">
                <Icon className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium text-gray-900 capitalize">{category}</h4>
                <span className={`px-2 py-1 text-xs rounded-full border ${colorClass}`}>
                  {categoryTemplates.length} template{categoryTemplates.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {categoryTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onTemplateSelect(template.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedTemplate === template.id 
                          ? 'bg-primary-100' 
                          : 'bg-gray-100'
                      }`}>
                        <Wand2 className={`w-4 h-4 ${
                          selectedTemplate === template.id 
                            ? 'text-primary-600' 
                            : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 mb-1">{template.name}</h5>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {template.variables.length} variable{template.variables.length !== 1 ? 's' : ''}
                          </span>
                          {template.variables.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {template.variables.slice(0, 3).map((variable) => (
                                <span
                                  key={variable}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {variable}
                                </span>
                              ))}
                              {template.variables.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{template.variables.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}