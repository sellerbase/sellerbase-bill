import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Bars3Icon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { InvoiceItem } from '../../types';
import { Column } from '../../templates/types';
import { useColorMap } from '../../hooks/useColorMap';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useOptionUngroup } from '../../hooks/useOptionUngroup';
import { useInvoiceTotals } from '../../../../hooks/useInvoiceTotals';

export function useInvoiceTemplate(
  items: InvoiceItem[],
  onUpdateItems: (items: InvoiceItem[]) => void,
  onRemoveItem: (id: string) => void,
  templateId: string
) {
  const [openNotes, setOpenNotes] = useState<{ [key: string]: boolean }>({});

  const toggleNotes = (id: string) => {
    setOpenNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const { getItemColor } = useColorMap(items);
  const { handleDragEnd } = useDragAndDrop(items, onUpdateItems);
  const { handleUngroup } = useOptionUngroup(items, onUpdateItems);
  const totals = useInvoiceTotals(items, templateId);

  const inputBaseStyle = "w-full px-2 py-1 text-sm border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  // 分割比率のオプションを定義（10%単位）
  const splitRatioOptions = Array.from({ length: 10 }, (_, i) => ((i + 1) * 0.1));

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdateItems(updatedItems);
  };

  const renderDraggableItem = (items: InvoiceItem[], columns: Column[], totalWidth: number) => {
    if (items.length === 0) {
      return (
        <div className="p-4 text-center text-gray-600">
          明細がありません。商品/オプション一覧から項目を選択してください。
        </div>
      );
    }

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="invoice-items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        grid gap-1 items-center px-1 py-3
                        ${item.type === 'option' ? 'bg-gray-50' : 'bg-white'}
                        border-l-[6px] border-l-transparent
                        ${getItemColor(item)}
                        relative
                      `}
                      style={{
                        ...provided.draggableProps.style,
                        gridTemplateColumns: columns.map(col => `${(col.width / totalWidth) * 100}%`).join(' ')
                      }}
                    >
                      {columns.map(column => {
                        switch (column.type) {
                          case 'title':
                            return (
                              <div key={column.type} className="flex items-center">
                                {column.type === columns[0].type && (
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mr-2 cursor-move text-gray-400 hover:text-gray-600"
                                    onDoubleClick={() => handleUngroup(item)}
                                  >
                                    <Bars3Icon className="h-5 w-5" />
                                  </div>
                                )}
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                                  className={`${inputBaseStyle} text-gray-900`}
                                />
                              </div>
                            );
                          case 'quantity':
                            return (
                              <div key={column.type}>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                  onFocus={(e) => e.target.select()}
                                  className={`${inputBaseStyle} text-gray-600 text-right`}
                                  min="0"
                                />
                              </div>
                            );
                          case 'unitPrice':
                            return (
                              <div key={column.type}>
                                <input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                                  onFocus={(e) => e.target.select()}
                                  className={`${inputBaseStyle} text-gray-600 text-right`}
                                  min="0"
                                />
                              </div>
                            );
                          case 'subtotal':
                            const itemSubtotal = item.quantity * item.unitPrice;
                            const itemTaxRate = templateId === 'with-tax' ? (item.taxRate || 0) : 0;
                            const itemSplitRatio = templateId === 'split-payment' ? (item.splitRatio || 1) : 1;
                            const itemTaxAmount = itemSubtotal * (itemTaxRate / 100);
                            const itemTotalWithTax = itemSubtotal + itemTaxAmount;
                            const itemSplitAmount = itemTotalWithTax * itemSplitRatio;
                            return (
                              <div key={column.type} className="px-2 py-1 text-right">
                                <span className="text-gray-600">{totals.formatCurrency(itemSplitAmount)}</span>
                              </div>
                            );
                          case 'taxRate':
                            return (
                              <div key={column.type}>
                                <input
                                  type="number"
                                  value={item.taxRate || 0}
                                  onChange={(e) => handleItemChange(item.id, 'taxRate', Number(e.target.value))}
                                  onFocus={(e) => e.target.select()}
                                  className={`${inputBaseStyle} text-gray-600 text-right`}
                                  min="0"
                                  step="1"
                                />
                              </div>
                            );
                          case 'splitRatio':
                            return (
                              <div key={column.type}>
                                <select
                                  value={item.splitRatio || 1}
                                  onChange={(e) => handleItemChange(item.id, 'splitRatio', Number(e.target.value))}
                                  className={`${inputBaseStyle} text-gray-600 text-right`}
                                >
                                  {splitRatioOptions.map((ratio) => (
                                    <option key={ratio} value={ratio}>
                                      {(ratio * 100).toFixed(0)}%
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          case 'operation':
                            return (
                              <div key={column.type} className="flex items-center justify-center gap-2 h-full">
                                <button
                                  type="button"
                                  onClick={() => toggleNotes(item.id)}
                                  className="flex items-center gap-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  <span className="text-sm">備考</span>
                                  {openNotes[item.id] ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRemoveItem(item.id)}
                                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 focus:outline-none whitespace-nowrap"
                                >
                                  削除
                                </button>
                              </div>
                            );
                          default:
                            return <div key={column.type} className="truncate"></div>;
                        }
                      })}
                      {openNotes[item.id] && (
                        <div className="col-span-full mt-2 pl-[42px]">
                          <textarea
                            value={item.notes || ''}
                            onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                            placeholder="備考を入力してください"
                            className="w-[95%] h-24 px-2 py-2 text-sm border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return {
    getItemColor,
    handleDragEnd,
    handleUngroup,
    handleItemChange,
    inputBaseStyle,
    renderDraggableItem,
  };
} 