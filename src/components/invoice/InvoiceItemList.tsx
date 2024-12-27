'use client';

import { useState } from 'react';
import { InvoiceItem } from './types';
import { DEFAULT_TEMPLATES } from './constants/templates';
import BasicTemplate from './templates/basic/BasicTemplate';
import WithTaxTemplate from './templates/with-tax/WithTaxTemplate';
import SplitPaymentTemplate from './templates/split-payment/SplitPaymentTemplate';
import { useInvoiceTotals } from '@/hooks/useInvoiceTotals';

type InvoiceItemListProps = {
  items: InvoiceItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItems: (items: InvoiceItem[]) => void;
  onTemplateChange: (templateId: string) => void;
};

export default function InvoiceItemList({ items, onRemoveItem, onUpdateItems, onTemplateChange }: InvoiceItemListProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const totals = useInvoiceTotals(items, selectedTemplateId);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    onTemplateChange(templateId);
  };

  const renderTemplateSelector = () => (
    <div className="mb-4">
      <label htmlFor="template-selector" className="block text-sm font-medium text-gray-700 mb-1">
        テンプレート
      </label>
      <select
        id="template-selector"
        value={selectedTemplateId}
        onChange={(e) => handleTemplateChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {DEFAULT_TEMPLATES.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name} - {template.description}
          </option>
        ))}
      </select>
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