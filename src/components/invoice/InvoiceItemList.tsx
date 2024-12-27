'use client';

import { useState } from 'react';
import { InvoiceItem } from './types';
import { DEFAULT_TEMPLATES } from './constants/templates';
import BasicTemplate from './templates/basic/BasicTemplate';
import WithTaxTemplate from './templates/with-tax/WithTaxTemplate';
import SplitPaymentTemplate from './templates/split-payment/SplitPaymentTemplate';
import { useInvoiceTotals } from '@/hooks/useInvoiceTotals';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface InvoiceItemListProps {
  items: InvoiceItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItems: (items: InvoiceItem[]) => void;
  onTemplateChange: (templateId: string) => void;
}

export default function InvoiceItemList({ items, onRemoveItem, onUpdateItems, onTemplateChange }: InvoiceItemListProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const totals = useInvoiceTotals(items, selectedTemplateId);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    onTemplateChange(templateId);
  };

  const handleSaveDraft = () => {
    // TODO: 下書き保存の処理を実装
    console.log('下書き保存');
  };

  const renderTemplateSelector = () => (
    <div className="mb-4 flex justify-between items-end">
      <div>
        <label htmlFor="template-selector" className="block text-sm font-medium text-gray-700 mb-1">
          テンプレート
        </label>
        <select
          id="template-selector"
          value={selectedTemplateId}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="mt-1 w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 bg-white"
        >
          {DEFAULT_TEMPLATES.map((template) => (
            <option 
              key={template.id} 
              value={template.id}
              className="text-gray-900 bg-white"
            >
              {template.name} - {template.description}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSaveDraft}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-gray-500" />
        下書き保存
      </button>
    </div>
  );

  const renderTemplate = () => {
    const props = { items, onRemoveItem, onUpdateItems };

    switch (selectedTemplateId) {
      case 'basic':
        return <BasicTemplate {...props} />;
      case 'with-tax':
        return <WithTaxTemplate {...props} />;
      case 'split-payment':
        return <SplitPaymentTemplate {...props} />;
      default:
        return <div>テンプレートが選択されていません。</div>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">明細</h2>
      </div>

      {renderTemplateSelector()}
      {renderTemplate()}
    </div>
  );
} 