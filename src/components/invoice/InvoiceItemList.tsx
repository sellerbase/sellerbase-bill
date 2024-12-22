'use client';

import { useState } from 'react';
import InvoiceItemForm from './InvoiceItemForm';

type InvoiceItem = {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  splitRatio?: number;
  remainingAmount?: number;
  notes?: string;
};

export default function InvoiceItemList() {
  const [type, setType] = useState<'standard' | 'split_payment'>('standard');
  const [items, setItems] = useState<InvoiceItem[]>([]);

  const addItem = () => {
    setItems([...items, {
      id: crypto.randomUUID(),
      title: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      splitRatio: type === 'split_payment' ? 10 : undefined,
      remainingAmount: type === 'split_payment' ? 0 : undefined,
      notes: ''
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // テンプレートタイプを切り替える際に、既存の明細をクリア
  const handleTypeChange = (newType: 'standard' | 'split_payment') => {
    if (items.length > 0) {
      if (confirm('テンプレートを切り替えると、現在の明細がクリアされます。よろしいですか？')) {
        setItems([]);
        setType(newType);
      }
    } else {
      setType(newType);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">明細</h2>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => handleTypeChange('standard')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                type === 'standard'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              標準
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('split_payment')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                type === 'split_payment'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              分割請求
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          明細を追加
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* ヘッダー */}
        <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="col-span-3 text-sm font-medium text-gray-700">名目</div>
          <div className="col-span-2 text-sm font-medium text-gray-700">数量</div>
          <div className="col-span-2 text-sm font-medium text-gray-700">単価</div>
          {type === 'split_payment' && (
            <div className="col-span-2 text-sm font-medium text-gray-700">分割割合</div>
          )}
          <div className={`${type === 'split_payment' ? 'col-span-2' : 'col-span-4'} text-sm font-medium text-gray-700`}>小計</div>
          <div className="col-span-1 text-sm font-medium text-gray-700 text-right">操作</div>
        </div>

        {/* 明細リスト */}
        {items.length === 0 ? (
          <div className="p-4 text-center text-gray-600">
            明細がありません。「明細を追加」ボタンをクリックして明細を追加してください。
          </div>
        ) : (
          <div>
            {items.map(item => (
              <InvoiceItemForm
                key={item.id}
                type={type}
                onDelete={() => removeItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 