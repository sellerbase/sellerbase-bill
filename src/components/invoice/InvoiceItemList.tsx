'use client';

import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import InvoiceItemForm from './InvoiceItemForm';
import { InvoiceItem, DraggableProvided, DroppableProvided } from './types';

type InvoiceItemListProps = {
  items: InvoiceItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItems: (items: InvoiceItem[]) => void;
};

export default function InvoiceItemList({ items, onRemoveItem, onUpdateItems }: InvoiceItemListProps) {
  const [type, setType] = useState<'standard' | 'split_payment'>('standard');

  // 明細をグループ化
  const groupedItems = useMemo(() => {
    // 親商品（グループ）ごとに明細をグループ化
    const groups = items.reduce((acc, item) => {
      const groupId = item.parentId || item.id;
      if (!acc[groupId]) {
        acc[groupId] = {
          id: groupId,
          order: item.groupOrder,
          items: []
        };
      }
      acc[groupId].items.push(item);
      return acc;
    }, {} as Record<string, { id: string; order: number; items: InvoiceItem[] }>);

    // グループを�����ート
    return Object.values(groups)
      .sort((a, b) => a.order - b.order)
      .map(group => ({
        ...group,
        items: group.items.sort((a, b) => a.itemOrder - b.itemOrder)
      }));
  }, [items]);

  // テラッグ&ドロップの処理
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedItems = [...items];

    // グループ間の移動
    if (result.type === 'group') {
      const groups = [...groupedItems];
      const [removed] = groups.splice(source.index, 1);
      groups.splice(destination.index, 0, removed);

      // グループの順序を更新
      const newItems = groups.flatMap((group, groupIndex) =>
        group.items.map(item => ({
          ...item,
          groupOrder: groupIndex,
          parentId: group.id === item.id ? null : group.id
        }))
      );

      onUpdateItems(newItems);
      return;
    }

    // グループ内のアイテムの移動
    const sourceGroup = source.droppableId;
    const destGroup = destination.droppableId;

    const sourceItems = groupedItems.find(g => g.id === sourceGroup)?.items || [];
    const [removed] = sourceItems.splice(source.index, 1);

    if (sourceGroup === destGroup) {
      // 同じグループ内での移動
      sourceItems.splice(destination.index, 0, removed);
      const newItems = items.map(item =>
        item.id === removed.id
          ? { ...item, itemOrder: destination.index }
          : item.parentId === sourceGroup && item.itemOrder >= destination.index
          ? { ...item, itemOrder: item.itemOrder + 1 }
          : item
      );
      onUpdateItems(newItems);
    } else {
      // 異なるグループ間での移動
      const destItems = groupedItems.find(g => g.id === destGroup)?.items || [];
      destItems.splice(destination.index, 0, { ...removed, parentId: destGroup });
      const newItems = items.map(item =>
        item.id === removed.id
          ? { ...item, parentId: destGroup, itemOrder: destination.index }
          : item.parentId === destGroup && item.itemOrder >= destination.index
          ? { ...item, itemOrder: item.itemOrder + 1 }
          : item
      );
      onUpdateItems(newItems);
    }
  };

  // テンプレートタイプを切り替える際に、既存の明細をクリア
  const handleTypeChange = (newType: 'standard' | 'split_payment') => {
    if (items.length > 0) {
      if (confirm('テンプレートを切り替えると、現在の明細がクリアされます。よろしいですか？')) {
        onRemoveItem('all');
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
            明細がありません。右の商品/オプション一覧から項目を選択してください。
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="groups" type="group">
              {(provided: DroppableProvided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {groupedItems.map((group, index) => (
                    <Draggable key={group.id} draggableId={group.id} index={index}>
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <Droppable droppableId={group.id} type="item">
                            {(provided: DroppableProvided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef}>
                                {group.items.map((item, itemIndex) => (
                                  <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                                    {(provided: DraggableProvided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <InvoiceItemForm
                                          type={type}
                                          item={item}
                                          onDelete={() => onRemoveItem(item.id)}
                                          onChange={(updatedItem) => {
                                            const newItems = items.map(i =>
                                              i.id === updatedItem.id ? updatedItem : i
                                            );
                                            onUpdateItems(newItems);
                                          }}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
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