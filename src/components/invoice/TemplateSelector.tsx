import { InvoiceTemplate } from './types';

type TemplateSelectorProps = {
  templates: InvoiceTemplate[];
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
};

export default function TemplateSelector({
  templates,
  selectedTemplateId,
  onSelect
}: TemplateSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        テンプレート選択
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`
              p-4 rounded-lg border text-left transition-colors
              ${
                template.id === selectedTemplateId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }
            `}
          >
            <h3 className="font-medium text-gray-900 mb-1">
              {template.name}
            </h3>
            <p className="text-sm text-gray-500">
              {template.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {template.columns.map(column => (
                <span
                  key={column.type}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {column.label}
                  {column.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 