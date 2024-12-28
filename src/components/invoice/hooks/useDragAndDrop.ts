import { DropResult } from '@hello-pangea/dnd';
import { InvoiceItem } from '../types';

export function useDragAndDrop(
  items: InvoiceItem[],
  onUpdateItems: (items: InvoiceItem[]) => void
) {
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
        destinationIndex <= parentIndex || // 親商品より���には移動不可
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

      // 移動先が他の親商品グループの中でないかチェック
      const destinationItem = items[destinationIndex];
      if (destinationItem && destinationItem.parentId) {
        return; // 他の親商品の子商品の間への移動は不可
      }

      // 移動先の前後の親商品を確認
      let prevParentIndex = -1;
      let nextParentIndex = items.length;

      for (let i = destinationIndex - 1; i >= 0; i--) {
        if (items[i].type === 'parent_product') {
          prevParentIndex = i;
          break;
        }
      }

      for (let i = destinationIndex; i < items.length; i++) {
        if (i !== sourceIndex && items[i].type === 'parent_product') {
          nextParentIndex = i;
          break;
        }
      }

      // 移動先が他の親商品グループの中にある場合は移動を禁止
      const isWithinOtherGroup = prevParentIndex !== -1 && nextParentIndex < items.length &&
        items[prevParentIndex].id !== itemToMove.id &&
        items[nextParentIndex].id !== itemToMove.id;

      if (isWithinOtherGroup) {
        return;
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

      // 移動先の位置から最も近い親商品とその範囲を探す
      for (let i = destinationIndex - 1; i >= 0; i--) {
        if (newItems[i].type === 'parent_product') {
          const currentParentId = newItems[i].id;
          // この親商品の範囲の終わりを見つける
          const groupEndIndex = newItems.findIndex((item, index) => 
            index > i && item.type === 'parent_product'
          );
          
          // 移動先が親商品グループの範囲内にある場合
          if (groupEndIndex === -1 || destinationIndex <= groupEndIndex) {
            targetParentId = currentParentId;
          }
          break;
        }
      }

      // オプションを移動
      newItems.splice(destinationIndex, 0, {
        ...itemToMove,
        parentId: targetParentId // 親商品グループ内に移動した場合のみ紐付け
      });

      // インデックスを更新
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        groupOrder: index,
        itemOrder: index
      }));

      onUpdateItems(updatedItems);
      return;
    }
  };

  return { handleDragEnd };
} 