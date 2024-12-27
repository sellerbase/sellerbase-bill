import { InvoiceItem } from '../../types';
import { useMemo, useState } from 'react';

type BasicTotalsProps = {
  items: InvoiceItem[];
};

export default function BasicTotals({ items }: BasicTotalsProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const totals = useMemo(() => {
    const result = {
      product: 0,
      inspection: 0,
      work: 0,
      packaging: 0,
      shipping: 0,
      total: 0,
    };

    items.forEach(item => {
      const subtotal = item.quantity * item.unitPrice;
      result.total += subtotal;

      if (item.type === 'child_product') {
        result.product += subtotal;
      } else if (item.type === 'option') {
        if (item.title.includes('検品')) {
          result.inspection += subtotal;
        } else if (item.title.includes('作業')) {
          result.work += subtotal;
        } else if (
          item.title.includes('OPP袋') || 
          item.title.includes('PE袋') || 
          item.title.includes('ラッピング') || 
          item.title.includes('包装')
        ) {
          result.packaging += subtotal;
        } else if (item.title.includes('配送') || item.title.includes('運送')) {
          result.shipping += subtotal;
        }
      }
    });

    return result;
  }, [items]);

  const formatCurrency = (amount: number) => `¥${amount.toFixed(2)}`;

  return (
    <div className="mb-6 bg-gray-50 rounded-lg p-4">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-gray-900">合計金額（基本）</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-2">
        <div className="bg-white p-2 rounded-md shadow-sm">
          <div className="text-xs text-gray-600 mb-0.5">CNY（メイン）</div>
          <div className="text-lg font-bold text-gray-900">{formatCurrency(totals.total)}</div>
        </div>
        <div className="bg-white p-2 rounded-md shadow-sm">
          <div className="text-xs text-gray-600 mb-0.5">USD</div>
          <div className="text-lg font-bold text-gray-900">{formatCurrency(totals.total * 0.14)}</div>
        </div>
        <div className="bg-white p-2 rounded-md shadow-sm">
          <div className="text-xs text-gray-600 mb-0.5">JPY</div>
          <div className="text-lg font-bold text-gray-900">{formatCurrency(totals.total * 20.27)}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
      >
        内訳
        <svg
          className={`ml-1 h-3 w-3 transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showBreakdown && (
        <div className="mt-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">商品</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(totals.product)}
                </span>
              </div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">検品</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(totals.inspection)}
                </span>
              </div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">作業</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(totals.work)}
                </span>
              </div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">包装</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(totals.packaging)}
                </span>
              </div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">運送</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(totals.shipping)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 