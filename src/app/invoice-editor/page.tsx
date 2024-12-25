'use client';

import BasicInfoForm from '@/components/invoice/BasicInfoForm';
import InvoiceItemList from '@/components/invoice/InvoiceItemList';
import ItemSelector from '@/components/invoice/ItemSelector';
import { useState } from 'react';
import { InvoiceItem } from '@/components/invoice/types';
import { useInvoiceTotals } from '@/hooks/useInvoiceTotals';

export default function InvoiceEditorPage() {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const totals = useInvoiceTotals(items);

  const handleSelectItem = (item: { id: string; title: string; price: number; type: 'product' | 'option' }) => {
    const newItem: Omit<InvoiceItem, 'id' | 'groupOrder' | 'itemOrder'> = {
      title: item.title,
      quantity: 1,
      unitPrice: item.price,
      type: item.type
    };
    handleAddItem(newItem);
  };

  const handleAddItem = (newItem: Omit<InvoiceItem, 'id' | 'groupOrder' | 'itemOrder'>) => {
    const id = crypto.randomUUID();
    setItems(prev => [...prev, {
      ...newItem,
      id,
      groupOrder: prev.length,
      itemOrder: 0
    }]);
  };

  const handleRemoveItem = (id: string) => {
    if (id === 'all') {
      setItems([]);
    } else {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-[1920px]">
          <h1 className="text-2xl font-bold text-gray-900">請求書の作成</h1>
        </div>
      </div>

      <div className="px-4 py-6 mx-auto max-w-[1920px]">
        <div className="grid grid-cols-12 gap-6">
          {/* 左カラム: 基本情報 */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">基本情報</h2>
              <BasicInfoForm />
            </div>
          </div>

          {/* 中央カラム: 明細 */}
          <div className="col-span-7">
            <div className="bg-white rounded-lg shadow p-6">
              {/* 合計金額表示エリア */}
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <div className="mb-2">
                  <h3 className="text-base font-semibold text-gray-900">合計金額</h3>
                </div>
                
                {/* 合計金額 - 3通貨表示 */}
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    <div className="text-xs text-gray-600 mb-0.5">CNY（メイン）</div>
                    <div className="text-lg font-bold text-gray-900">¥{totals.total.toFixed(2)}</div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    <div className="text-xs text-gray-600 mb-0.5">USD</div>
                    <div className="text-lg font-bold text-gray-900">$0.00</div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    <div className="text-xs text-gray-600 mb-0.5">JPY</div>
                    <div className="text-lg font-bold text-gray-900">￥0</div>
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

                {/* カテゴリ別内訳（デフォルトは非表示） */}
                {showBreakdown && (
                  <div className="mt-2">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white p-2 rounded-md shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">商品</span>
                          <span className="font-medium text-gray-900">
                            ¥{totals.product.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-md shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">検品</span>
                          <span className="font-medium text-gray-900">
                            ¥{totals.inspection.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-md shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">作業</span>
                          <span className="font-medium text-gray-900">
                            ¥{totals.work.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-md shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">包装</span>
                          <span className="font-medium text-gray-900">
                            ¥{totals.packaging.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-md shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">運送</span>
                          <span className="font-medium text-gray-900">
                            ¥{totals.shipping.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 明細リスト */}
              <InvoiceItemList
                items={items}
                onRemoveItem={handleRemoveItem}
                onUpdateItems={setItems}
              />
            </div>
          </div>

          {/* 右カラム: 商品/オプション選択 */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">商品/オプション選択</h2>
              <ItemSelector onSelectItem={handleSelectItem} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
