import { InvoiceItem } from '../types';

export function useOptionUngroup(
  items: InvoiceItem[],
  onUpdateItems: (items: InvoiceItem[]) => void
) {
  const handleUngroup = (item: InvoiceItem) => {
    if (item.type === 'option' && item.parentId) {
      // 一旦対象のオプションを除外
      const itemsWithoutOption = items.filter(currentItem => currentItem.id !== item.id);
      
      // グループ解除したオプションを最後に追加
      const updatedItems = [
        ...itemsWithoutOption,
        { ...item, parentId: undefined }
      ].map((currentItem, index) => ({
        ...currentItem,
        groupOrder: index,
        itemOrder: index
      }));

      onUpdateItems(updatedItems);
    }
  };

  return { handleUngroup };
} 