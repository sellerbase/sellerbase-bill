'use client';

import { useState } from 'react';
import { TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { InvoiceItem } from './types';

type InvoiceItemFormProps = {
  type: 'standard' | 'split_payment';
  item: InvoiceItem;
  onDelete: () => void;
  onChange: (updatedItem: InvoiceItem) => void;
};

export default function InvoiceItemForm({ type, item: initialItem, onDelete, onChange }: InvoiceItemFormProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [item, setItem] = useState<InvoiceItem>({
    ...initialItem,
    notes: initialItem.notes || '',
    splitRatio: type === 'split_payment' ? (initialItem.splitRatio || 10) : undefined,
    remainingAmount: type === 'split_payment' ? (initialItem.remainingAmount || 0) : undefined,
  });

  // 小計を計算
  const calculateSubtotal = (quantity: number, unitPrice: number, splitRatio?: number) => {
    const total = quantity * unitPrice;
    if (splitRatio && type === 'split_payment') {
      const splitAmount = total * (splitRatio / 100);
      const remaining = total - splitAmount;
      const updatedItem = {
        ...item,
        quantity,
        unitPrice,
        splitRatio,
        subtotal: Number(splitAmount.toFixed(2)),
        remainingAmount: Number(remaining.toFixed(2))
      };
      setItem(updatedItem);
      onChange(updatedItem);
    } else {
      const updatedItem = {
        ...item,
        quantity,
        unitPrice,
        subtotal: Number(total.toFixed(2))
      };
      setItem(updatedItem);
      onChange(updatedItem);
    }
  };

  // 数量変更時の処理
  const handleQuantityChange = (value: string) => {
    const quantity = Number(value);
    calculateSubtotal(quantity, item.unitPrice, item.splitRatio);
  };

  // 単価変更時の処理
  const handleUnitPriceChange = (value: string) => {
    const unitPrice = Number(value);
    calculateSubtotal(item.quantity, unitPrice, item.splitRatio);
  };

  // 分割割合変更時の処理
  const handleSplitRatioChange = (value: string) => {
    const splitRatio = Number(value);
    calculateSubtotal(item.quantity, item.unitPrice, splitRatio);
  };

  // タイトル変更時の処理
  const handleTitleChange = (value: string) => {
    const updatedItem = { ...item, title: value };
    setItem(updatedItem);
    onChange(updatedItem);
  };

  // 備考変更時の処理
  const handleNotesChange = (value: string) => {
    const updatedItem = { ...item, notes: value };
    setItem(updatedItem);
    onChange(updatedItem);
  };

  return (
    <div className="px-4 py-3 border-b border-gray-200 last:border-b-0">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* 名目 */}
        <div className="col-span-3">
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="名目を入力"
          />
        </div>

        {/* 数量 */}
        <div className="col-span-2">
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* 単価 */}
        <div className="col-span-2">
          <input
            type="number"
            step="1"
            value={item.unitPrice}
            onChange={(e) => handleUnitPriceChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* 分割割合（分割支払いの場合のみ表示） */}
        {type === 'split_payment' && (
          <div className="col-span-2">
            <select
              value={item.splitRatio}
              onChange={(e) => handleSplitRatioChange(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            >
              {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map(ratio => (
                <option key={ratio} value={ratio}>{ratio}%</option>
              ))}
            </select>
          </div>
        )}

        {/* 小計 */}
        <div className={`${type === 'split_payment' ? 'col-span-2' : 'col-span-4'}`}>
          <div className="text-lg font-bold text-gray-900">
            ¥{(item.quantity * item.unitPrice).toFixed(2)}
            {type === 'split_payment' && item.remainingAmount !== undefined && (
              <div className="text-sm font-normal text-gray-600">
                残金: ¥{item.remainingAmount.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* 操作ボタン */}
        <div className="col-span-1 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
          >
            {showNotes ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center p-1 border border-transparent rounded-full text-red-400 hover:text-red-500"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 備考欄 */}
      {showNotes && (
        <div className="mt-4">
          <textarea
            value={item.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="備考を入力"
          />
        </div>
      )}
    </div>
  );
} 