import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronUpIcon, ChevronDownIcon, TrashIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { InvoiceItem } from '../types';
import { useColorMap } from './useColorMap';
import { useDragAndDrop } from './useDragAndDrop';

type Column = {
  type: string;
  label: string;
  width: number;
  required?: boolean;
};

export function useInvoiceTemplate(
  items: InvoiceItem[],
  onUpdateItems: (items: InvoiceItem[]) => void,
  onRemoveItem: (id: string) => void,
  templateId: string
) {
  const { getItemColor } = useColorMap(items);
  const { handleDragEnd } = useDragAndDrop(items, onUpdateItems);
  const [showNotesMap, setShowNotesMap] = useState<{ [key: string]: boolean }>({});

  const handleUngroup = (parentId: string) => {
    const updatedItems = items.filter(item => item.id !== parentId && item.parentId !== parentId);
    onUpdateItems(updatedItems);
  };

  const handleItemChange = (updatedItem: InvoiceItem) => {
    const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
    onUpdateItems(updatedItems);
  };

  const toggleNotes = (itemId: string) => {
    setShowNotesMap(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderDraggableItem = (items: InvoiceItem[], columns: Column[], totalWidth: number) => {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="invoice-items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative ${getItemColor(item)}`}
                    >
                      <div className="grid gap-2 items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
                           style={{ gridTemplateColumns: columns.map(col => {
                             if (item.type === 'parent_product') {
                               if (col.type === 'title') return '80%';
                               if (col.type === 'operation') return '20%';
                               return '0';
                             }
                             return `${(col.width / totalWidth) * 100}%`;
                           }).join(' ') }}>
                        {columns.map(column => {
                          if (item.type === 'parent_product') {
                            if (column.type === 'title') {
                              return (
                                <div key={column.type} className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps}>
                                    <Bars3Icon className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => handleItemChange({ ...item, title: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                  />
                                </div>
                              );
                            }
                            if (column.type === 'operation') {
                              return (
                                <div key={column.type} className="flex justify-end items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleNotes(item.id)}
                                    className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
                                  >
                                    <span className="text-sm mr-1">備考</span>
                                    {showNotesMap[item.id] ? (
                                      <ChevronUpIcon className="h-5 w-5" />
                                    ) : (
                                      <ChevronDownIcon className="h-5 w-5" />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUngroup(item.id)}
                                    className="inline-flex items-center p-1 border border-transparent rounded-full text-red-400 hover:text-red-500"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              );
                            }
                            return <div key={column.type} />;
                          }

                          switch (column.type) {
                            case 'title':
                              return (
                                <div key={column.type} className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps}>
                                    <Bars3Icon className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => handleItemChange({ ...item, title: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                  />
                                </div>
                              );
                            case 'quantity':
                              return (
                                <div key={column.type} className="text-right">
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange({ ...item, quantity: Number(e.target.value) })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 text-right"
                                  />
                                </div>
                              );
                            case 'unitPrice':
                              return (
                                <div key={column.type} className="text-right">
                                  <input
                                    type="number"
                                    min="0"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange({ ...item, unitPrice: Number(e.target.value) })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 text-right"
                                  />
                                </div>
                              );
                            case 'taxRate':
                              if (templateId !== 'with-tax') {
                                return <div key={column.type} />;
                              }
                              return (
                                <div key={column.type} className="text-right">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={item.taxRate || 0}
                                    onChange={(e) => handleItemChange({ ...item, taxRate: Number(e.target.value) })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 text-right"
                                  />
                                </div>
                              );
                            case 'subtotal':
                              const subtotal = item.quantity * item.unitPrice;
                              const withTax = templateId === 'with-tax' ? (1 + (item.taxRate || 0) / 100) : 1;
                              return (
                                <div key={column.type} className="text-right font-medium">
                                  ¥{(subtotal * withTax).toFixed(2)}
                                </div>
                              );
                            case 'operation':
                              return (
                                <div key={column.type} className="flex justify-end items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleNotes(item.id)}
                                    className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
                                  >
                                    <span className="text-sm mr-1">備考</span>
                                    {showNotesMap[item.id] ? (
                                      <ChevronUpIcon className="h-5 w-5" />
                                    ) : (
                                      <ChevronDownIcon className="h-5 w-5" />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onRemoveItem(item.id)}
                                    className="inline-flex items-center p-1 border border-transparent rounded-full text-red-400 hover:text-red-500"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                      {showNotesMap[item.id] && (
                        <div className="px-4 py-2">
                          <textarea
                            value={item.notes || ''}
                            onChange={(e) => handleItemChange({ ...item, notes: e.target.value })}
                            rows={3}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            placeholder="備考を入力"
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
    renderDraggableItem,
  };
} 