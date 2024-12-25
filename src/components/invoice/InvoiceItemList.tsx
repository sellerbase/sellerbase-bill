'use client';

import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { InvoiceItem } from './types';

type InvoiceItemListProps = {
  items: InvoiceItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItems: (items: InvoiceItem[]) => void;
};

export default function InvoiceItemList({ items, onRemoveItem, onUpdateItems }: InvoiceItemListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const itemToMove = items[sourceIndex];

    // 子商品の移動制限
    if (itemToMove.type === 'child_product') {
      const parentId = itemToMove.parentId;
      if (!parentId) return;

      // 親商品の位置を特定
      const parentIndex = items.findIndex(item => 
        item.type === 'parent_product' && item.id === parentId
      );
      if (parentIndex === -1) return;

      // 次の親商品の位置を特定
      let nextParentIndex = items.findIndex((item, index) => 
        index > parentIndex && item.type === 'parent_product'
      );
      if (nextParentIndex === -1) nextParentIndex = items.length;

      // 移動可能な範囲をチェック
      if (
        destinationIndex <= parentIndex || // 親商品より上には移動不可
        destinationIndex >= nextParentIndex || // 次の親商品以降には移動不可
        items[destinationIndex]?.parentId !== parentId // 同じ親商品グループ内でのみ移動可能
      ) {
        return;
      }

      // 子商品の移動を実行
      const newItems = Array.from(items);
      newItems.splice(sourceIndex, 1);
      newItems.splice(destinationIndex, 0, itemToMove);

      const updatedItems = newItems.map((item, index) => ({
        ...item,
        groupOrder: index,
        itemOrder: index
      }));

      onUpdateItems(updatedItems);
      return;
    }

    // 親商品の移動
    if (itemToMove.type === 'parent_product') {
      // グループの範囲を特定
      const groupItems = [itemToMove];
      let nextIndex = sourceIndex + 1;
      while (nextIndex < items.length && items[nextIndex].type !== 'parent_product') {
        if (items[nextIndex].parentId === itemToMove.id) {
          groupItems.push(items[nextIndex]);
        }
        nextIndex++;
      }

      // グループ全体を一時的に削除
      const itemsWithoutGroup = items.filter((_, index) => {
        return index < sourceIndex || index >= nextIndex;
      });

      // グループを新しい位置に挿入
      const newItems = [...itemsWithoutGroup];
      newItems.splice(destinationIndex, 0, ...groupItems);

      // インデックスを更新
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        groupOrder: index,
        itemOrder: index
      }));

      onUpdateItems(updatedItems);
      return;
    }

    // オプションの移動
    if (itemToMove.type === 'option') {
      const newItems = Array.from(items);
      newItems.splice(sourceIndex, 1);

      // 移動先の親商品を特定
      let targetParentId: string | undefined = undefined;
      let isWithinParentGroup = false;

      // 移動先の位置から最も近い親商品を探す
      for (let i = destinationIndex - 1; i >= 0; i--) {
        if (newItems[i].type === 'parent_product') {
          // 次の親商品までの範囲をチェック
          const nextParentIndex = newItems.findIndex((item, index) => 
            index > i && item.type === 'parent_product'
          );
          
          if (nextParentIndex === -1 || destinationIndex < nextParentIndex) {
            targetParentId = newItems[i].id;
            isWithinParentGroup = true;
          }
          break;
        }
      }

      // オプションを移動
      newItems.splice(destinationIndex, 0, {
        ...itemToMove,
        parentId: isWithinParentGroup ? targetParentId : undefined
      });

      // インデックスを更新
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        groupOrder: index,
        itemOrder: index
      }));

      onUpdateItems(updatedItems);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">明細</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* ヘッダー */}
        <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="col-span-1"></div>
          <div className="col-span-4 text-sm font-medium text-gray-700">名目</div>
          <div className="col-span-2 text-sm font-medium text-gray-700">数量</div>
          <div className="col-span-2 text-sm font-medium text-gray-700">単価</div>
          <div className="col-span-2 text-sm font-medium text-gray-700">小計</div>
          <div className="col-span-1 text-sm font-medium text-gray-700 text-right">操作</div>
        </div>

        {/* 明細リスト */}
        {items.length === 0 ? (
          <div className="p-4 text-center text-gray-600">
            ���細がありません。右の商品/オプション一覧から項目を選択してください。
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="invoice-items">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="divide-y divide-gray-200"
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`
                            grid grid-cols-12 gap-4 items-center px-4 py-3
                            ${item.type === 'child_product' || (item.type === 'option' && item.parentId) ? 'ml-6' : ''}
                            ${item.type === 'option' ? 'bg-gray-50' : 'bg-white'}
                          `}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="col-span-1 cursor-move text-gray-400 hover:text-gray-600"
                          >
                            <Bars3Icon className="h-5 w-5" />
                          </div>
                          <div className="col-span-4">
                            <span className="text-gray-900">{item.title}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">{item.quantity}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">¥{item.unitPrice.toFixed(2)}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">¥{(item.quantity * item.unitPrice).toFixed(2)}</span>
                          </div>
                          <div className="col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
} 