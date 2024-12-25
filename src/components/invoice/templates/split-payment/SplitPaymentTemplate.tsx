'use client';

import { InvoiceItem } from '../../types';
import { InvoiceTemplateProps, Column } from '../../templates/types';
import { useInvoiceTemplate } from '../../templates/hooks/useInvoiceTemplate';

export default function SplitPaymentTemplate({ 
  items,
  onRemoveItem,
  onUpdateItems,
}: InvoiceTemplateProps) {
  const {
    getItemColor,
    handleDragEnd,
    handleUngroup,
    handleItemChange,
    inputBaseStyle,
    renderDraggableItem,
  } = useInvoiceTemplate(items, onUpdateItems, onRemoveItem);

  const columns = [
    { type: 'title' as const, label: '名目', width: 180, required: true },
    { type: 'quantity' as const, label: '数量', width: 50, required: true },
    { type: 'unitPrice' as const, label: '単価', width: 50, required: true },
    { type: 'splitRatio' as const, label: '分割比率', width: 50 },
    { type: 'subtotal' as const, label: '小計', width: 70 },
    { type: 'operation' as const, label: '操作', width: 100 },
  ];

  // 列の合計幅を計算
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* ヘダー */}
      <div className="grid gap-2 items-center px-4 py-3 border-b border-gray-200 bg-gray-50"
           style={{ gridTemplateColumns: columns.map(col => `${(col.width / totalWidth) * 100}%`).join(' ') }}>
        {columns.map(column => {
          let alignmentClass = '';
          switch (column.type) {
            case 'title':
              alignmentClass = 'text-left pl-8';
              break;
            case 'quantity':
            case 'unitPrice':
            case 'splitRatio':
              alignmentClass = 'text-right';
              break;
            case 'subtotal':
              alignmentClass = 'text-right';
              break;
            case 'operation':
              alignmentClass = 'text-center';
              break;
            default:
              alignmentClass = 'text-left';
          }
          return (
            <div 
              key={column.type} 
              className={`text-sm font-medium text-gray-700 truncate px-2 ${alignmentClass}`}
            >
              {column.label}
              {column.required && <span className="text-red-500 ml-1">*</span>}
            </div>
          );
        })}
      </div>

      {/* 明細リスト */}
      {renderDraggableItem(items, columns, totalWidth)}
    </div>
  );
} 