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

    // グループのマッピングを作成
    const groups = items.reduce<Array<{
      id: string;
      startIndex: number;
      endIndex: number;
      items: InvoiceItem[];
    }>>((acc, item, index) => {
      if (item.type === 'parent_product') {
        const groupItems = [item];
        let nextIndex = index + 1;
        
        while (nextIndex < items.length && items[nextIndex].type !== 'parent_product') {
          if (items[nextIndex].parentId === item.id) {
            groupItems.push(items[nextIndex]);
          }
          nextIndex++;
        }
        
        acc.push({
          id: item.id,
          startIndex: index,
          endIndex: nextIndex - 1,
          items: groupItems
        });
      } else if (!item.parentId) {
        acc.push({
          id: item.id,
          startIndex: index,
          endIndex: index,
          items: [item]
        });
      }
      return acc;
    }, []);

    const sourceGroup = groups[sourceIndex];
    if (!sourceGroup) return;

    // グループ内の移動（子商品の並び替え）
    if (sourceIndex === destinationIndex && sourceGroup.items.length > 1) {
      const newItems = [...items];
      const itemToMove = newItems[result.source.index];
      
      // 親商品グループ内での移動のみ許可
      if (
        itemToMove.type === 'child_product' &&
        result.destination.index > sourceGroup.startIndex &&
        result.destination.index <= sourceGroup.endIndex
      ) {
        newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, itemToMove);

        const updatedItems = newItems.map((item, index) => ({
          ...item,
          groupOrder: index,
          itemOrder: index
        }));

        onUpdateItems(updatedItems);
      }
      return;
    }

    // グループ全体の移動
    const newItems: InvoiceItem[] = [];
    const remainingGroups = groups.filter((_, index) => index !== sourceIndex);

    // 移動先の位置までのグループを追加
    remainingGroups.slice(0, destinationIndex).forEach(group => {
      group.items.forEach(item => {
        newItems.push(item);
      });
    });

    // 移動するグループを追加
    sourceGroup.items.forEach(item => {
      newItems.push(item);
    });

    // 残りのグループを追加
    remainingGroups.slice(destinationIndex).forEach(group => {
      group.items.forEach(item => {
        newItems.push(item);
      });
    });

    // インデックスを更新
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      groupOrder: index,
      itemOrder: index
    }));

    onUpdateItems(updatedItems);
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
            明細がありません。右の商品/オプション一覧から項目を選択してください。
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
                  {items.reduce<Array<{ id: string; items: InvoiceItem[] }>>((groups, item, index) => {
                    if (item.type === 'parent_product') {
                      // 親商品の場合、新しいグループを作成
                      const groupItems = [item];
                      let nextIndex = index + 1;
                      
                      // 次の親商品が来るまで、子商品とオプションを収集
                      while (nextIndex < items.length && items[nextIndex].type !== 'parent_product') {
                        if (items[nextIndex].parentId === item.id) {
                          groupItems.push(items[nextIndex]);
                        }
                        nextIndex++;
                      }
                      
                      groups.push({ id: item.id, items: groupItems });
                    } else if (!item.parentId) {
                      // 親商品に紐付いていない項目は単独でグループ化
                      groups.push({ id: item.id, items: [item] });
                    }
                    return groups;
                  }, []).map((group, groupIndex) => (
                    <Draggable
                      key={group.id}
                      draggableId={group.id}
                      index={groupIndex}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="group"
                        >
                          {group.items.map((item, itemIndex) => (
                            <div
                              key={item.id}
                              className={`
                                grid grid-cols-12 gap-4 items-center px-4 py-3
                                ${item.type === 'child_product' || (item.type === 'option' && item.parentId) ? 'ml-6' : ''}
                                ${item.type === 'option' ? 'bg-gray-50' : 'bg-white'}
                                ${itemIndex === 0 ? 'group-first:border-t-0' : ''}
                              `}
                            >
                              <div
                                {...(itemIndex === 0 ? provided.dragHandleProps : {})}
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
                          ))}
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