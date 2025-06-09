import React from 'react';
import { FileText, ExternalLink, Code, Download } from 'lucide-react';
import { Resource } from '../types/course';

interface LessonResourcesProps {
  resources: Resource[];
}

export const LessonResources: React.FC<LessonResourcesProps> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText size={16} className="text-red-500" />;
      case 'link':
        return <ExternalLink size={16} className="text-blue-500" />;
      case 'code':
        return <Code size={16} className="text-green-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
        <Download size={18} className="mr-2" />
        Lesson Resources
      </h3>
      <div className="space-y-2">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              {getResourceIcon(resource.type)}
              <div>
                <div className="font-medium text-gray-900 group-hover:text-primary-600">
                  {resource.title}
                </div>
                {resource.size && (
                  <div className="text-sm text-gray-500">{resource.size}</div>
                )}
              </div>
            </div>
            <ExternalLink size={16} className="text-gray-400 group-hover:text-primary-500" />
          </a>
        ))}
      </div>
    </div>
  );
};