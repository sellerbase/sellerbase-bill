'use client';

import BasicInfoForm from '@/components/invoice/BasicInfoForm';
import InvoiceItemList from '@/components/invoice/InvoiceItemList';
import ItemSelector from '@/components/invoice/ItemSelector';
import { useState } from 'react';
import { InvoiceItem } from '@/components/invoice/types';
import { useInvoiceTotals } from '@/hooks/useInvoiceTotals';
import InvoiceTotals from '@/components/invoice/InvoiceTotals';
import DraftListPanel from '@/components/invoice/DraftListPanel';

export default function InvoiceEditorPage() {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('basic');
  const totals = useInvoiceTotals(items, selectedTemplateId);

  const handleSelectItem = (newItems: Array<{
    id: string;
    title: string;
    price: number;
    type: 'parent_product' | 'child_product' | 'option';
    parentId?: string;
  }>) => {
    // 既存の親商品のIDを取得
    const existingParentIds = items
      .filter(item => item.type === 'parent_product')
      .map(item => item.id);

    // 新しい項目を処理
    const itemsToAdd = newItems.map(item => {
      const baseItem: Omit<InvoiceItem, 'id' | 'groupOrder' | 'itemOrder'> = {
        title: item.title,
        quantity: 1,
        unitPrice: item.price,
        type: item.type,
        parentId: item.parentId
      };

      // 親商品が既に存在する場合は追加しない
      if (item.type === 'parent_product' && existingParentIds.includes(item.id)) {
        return null;
      }

      return {
        ...baseItem,
        id: item.id,
        groupOrder: items.length,
        itemOrder: 0
      };
    }).filter((item): item is InvoiceItem => item !== null);

    if (itemsToAdd.length > 0) {
      // 子商品が含まれている場合、適切な位置に挿入
      if (itemsToAdd.some(item => item.type === 'child_product')) {
        const newItems = [...items];
        
        itemsToAdd.forEach(item => {
          if (item.type === 'parent_product') {
            // 親商品は最後に追加
            newItems.push(item);
          } else if (item.type === 'child_product' && item.parentId) {
            // 親商品のインデックスを探す
            const parentIndex = newItems.findIndex(existing => 
              existing.id === item.parentId
            );

            if (parentIndex !== -1) {
              // 親商品の子商品の最後の位置を探す
              let insertIndex = parentIndex + 1;
              while (
                insertIndex < newItems.length && 
                newItems[insertIndex].type === 'child_product' &&
                newItems[insertIndex].parentId === item.parentId
              ) {
                insertIndex++;
              }
              // 子商品を親商品の子商品グループの最後に挿入
              newItems.splice(insertIndex, 0, item);
            } else {
              // 親商品が見つからない場合は最後に追加
              newItems.push(item);
            }
          } else {
            // その他のアイテムは最後に追加
            newItems.push(item);
          }
        });

        // グループ順序と項目順序の更新
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          groupOrder: index,
          itemOrder: index
        }));

        setItems(updatedItems);
      } else {
        // 子商品が含まれていない場合は単純に追加
        setItems(prev => [...prev, ...itemsToAdd]);
      }
    }
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
      <DraftListPanel />
      <div className="px-4 py-6 mx-auto max-w-[1920px]">
        <div className="grid grid-cols-12 gap-6">
          {/* 左カラム: 基本情報 */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-6 ml-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">基本情報</h2>
              <BasicInfoForm />
            </div>
          </div>

          {/* 中央カラム: 明細 */}
          <div className="col-span-7">
            <div className="bg-white rounded-lg shadow p-6">
              {/* 合計金額表示エリア */}
              <InvoiceTotals items={items} templateId={selectedTemplateId} />

              {/* 明細リスト */}
              <InvoiceItemList
                items={items}
                onRemoveItem={handleRemoveItem}
                onUpdateItems={setItems}
                onTemplateChange={setSelectedTemplateId}
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
