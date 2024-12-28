'use client';

import { useState } from 'react';
import { InvoiceItem, InvoiceData } from '@/types/invoice';
import { DEFAULT_TEMPLATES } from '@/components/invoice/constants/templates';
import DraftListPanel from '@/components/invoice/DraftListPanel';
import BasicInfoForm from '@/components/invoice/BasicInfoForm';
import InvoiceItemList from '@/components/invoice/InvoiceItemList';
import InvoiceTotals from '@/components/invoice/InvoiceTotals';
import ItemSelector from '@/components/invoice/ItemSelector';

export default function InvoiceEditorPage() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    sender: null,
    recipient: null,
    payment_method: null,
    issue_date: null,
    payment_deadline: null,
  });

  // 下書きデータを読み込む関数
  const handleLoadDraft = async (draftData: any) => {
    try {
      // 請求元企業の情報を取得
      let sender = null;
      if (draftData.sender_id) {
        const senderResponse = await fetch(`/api/companies/sender/${draftData.sender_id}`);
        if (senderResponse.ok) {
          sender = await senderResponse.json();
        }
      }

      // 請求先企業の情報を取得
      let recipient = null;
      if (draftData.recipient_id) {
        const recipientResponse = await fetch(`/api/companies/recipient/${draftData.recipient_id}`);
        if (recipientResponse.ok) {
          recipient = await recipientResponse.json();
        }
      }

      // 支払い方法の情報を取得
      let paymentMethod = null;
      if (draftData.payment_method_id) {
        const paymentMethodResponse = await fetch(`/api/payment-methods/${draftData.payment_method_id}`);
        if (paymentMethodResponse.ok) {
          paymentMethod = await paymentMethodResponse.json();
        }
      }

      setItems(draftData.items || []);
      setSelectedTemplateId(draftData.template_id || DEFAULT_TEMPLATES[0].id);
      setInvoiceData({
        invoiceNumber: draftData.title || '',
        sender,
        recipient,
        payment_method: paymentMethod,
        issue_date: draftData.issue_date || null,
        payment_deadline: draftData.payment_deadline || null,
      });
    } catch (error) {
      console.error('関連データの取得に失敗しました:', error);
      alert('関連データの取得に失敗しました');
    }
  };

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
      // オプションの場合は一意のIDを生成
      const itemId = item.type === 'option' ? 
        `${item.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : 
        item.id;

      const baseItem: InvoiceItem = {
        id: itemId,
        title: item.title,
        quantity: 1,
        unitPrice: item.price,
        subtotal: item.price,
        type: item.type,
        parentId: item.parentId,
        groupOrder: items.length,
        itemOrder: 0
      };

      // 親商品が既に存在する場合は追加しない
      if (item.type === 'parent_product' && existingParentIds.includes(item.id)) {
        return null;
      }

      return baseItem;
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
    <div className="h-screen flex overflow-hidden">
      <DraftListPanel onLoadDraft={handleLoadDraft} />
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-[calc(100vh-4.5rem)] grid grid-cols-12 gap-6">
          {/* 左カラム: 基本情報 */}
          <div className="col-span-2 h-[calc(100vh-4.5rem)]">
            <div className="bg-white rounded-lg shadow h-[calc(100%-2rem)] flex flex-col">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">基本情報</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <BasicInfoForm
                    invoiceData={invoiceData}
                    onUpdateInvoiceData={setInvoiceData}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 中央カラム: 明細 */}
          <div className="col-span-7 h-[calc(100vh-4.5rem)]">
            <div className="bg-white rounded-lg shadow h-[calc(100%-2rem)] flex flex-col">
              <div className="p-6 border-b">
                {/* 合計金額表示エリア */}
                <InvoiceTotals items={items} templateId={selectedTemplateId} />
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <InvoiceItemList
                    items={items}
                    onRemoveItem={handleRemoveItem}
                    onUpdateItems={setItems}
                    onTemplateChange={setSelectedTemplateId}
                    invoiceData={invoiceData}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右カラム: 商品/オプション選択 */}
          <div className="col-span-3 h-[calc(100vh-4.5rem)]">
            <div className="bg-white rounded-lg shadow h-[calc(100%-2rem)] flex flex-col">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">商品/オプション選択</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <ItemSelector onSelectItem={handleSelectItem} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
