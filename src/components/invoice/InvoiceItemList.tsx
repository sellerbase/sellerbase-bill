'use client';

import { useState } from 'react';
import { InvoiceItem, InvoiceData } from '@/types/invoice';
import { DEFAULT_TEMPLATES } from './constants/templates';
import BasicTemplate from './templates/basic/BasicTemplate';
import WithTaxTemplate from './templates/with-tax/WithTaxTemplate';
import SplitPaymentTemplate from './templates/split-payment/SplitPaymentTemplate';
import { useInvoiceTotals } from '@/hooks/useInvoiceTotals';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useInvoiceDraft } from '@/hooks/useInvoiceDraft';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface InvoiceItemListProps {
  items: InvoiceItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItems: (items: InvoiceItem[]) => void;
  onTemplateChange: (templateId: string) => void;
  invoiceData: InvoiceData;
}

export default function InvoiceItemList({ 
  items, 
  onRemoveItem, 
  onUpdateItems, 
  onTemplateChange,
  invoiceData,
}: InvoiceItemListProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const totals = useInvoiceTotals(items, selectedTemplateId);
  const { saveDraft } = useInvoiceDraft();

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    onTemplateChange(templateId);
  };

  const handleSaveDraft = async () => {
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: invoiceData.invoiceNumber || '無題の請求書',
          items: items,
          template_id: selectedTemplateId,
          sender_id: invoiceData.sender?.id,
          recipient_id: invoiceData.recipient?.id,
          payment_method_id: invoiceData.payment_method?.id,
          issue_date: invoiceData.issue_date,
          payment_deadline: invoiceData.payment_deadline,
        }),
      });

      if (!response.ok) throw new Error('下書きの保存に失敗しました');
      
      const data = await response.json();
      console.log('下書きを保存しました:', data);
      alert('下書きを保存しました');
    } catch (error) {
      console.error('下書きの保存に失敗しました:', error);
      alert('下書きの保存に失敗しました');
    }
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