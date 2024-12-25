'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { InvoiceItem } from './types';
import { useColorMap } from './hooks/useColorMap';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useOptionUngroup } from './hooks/useOptionUngroup';

type InvoiceItemListProps = {
  items: InvoiceItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItems: (items: InvoiceItem[]) => void;
};

export default function InvoiceItemList({ items, onRemoveItem, onUpdateItems }: InvoiceItemListProps) {
  // デバッグ用にitemsの内容を確認
  console.log('Items:', items.map(item => ({
    id: item.id,
    type: item.type,
    title: item.title,
    parentId: item.parentId,
    groupOrder: item.groupOrder
  })));

  const { getItemColor } = useColorMap(items);
  const { handleDragEnd } = useDragAndDrop(items, onUpdateItems);
  const { handleUngroup } = useOptionUngroup(items, onUpdateItems);

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
            明細がありません。商品/オプション一覧から項目を選択してください。
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
                            ${item.type === 'option' ? 'bg-gray-50' : 'bg-white'}
                            border-l-[6px] border-l-transparent
                            ${getItemColor(item)}
                            relative
                          `}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="col-span-1 cursor-move text-gray-400 hover:text-gray-600"
                            onDoubleClick={() => handleUngroup(item)}
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