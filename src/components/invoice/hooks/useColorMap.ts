import { useMemo } from 'react';
import { InvoiceItem } from '../types';

// カラーパレットの定義（10色）
export const GROUP_COLORS = [
  'border-l-[6px] !border-l-blue-500',
  'border-l-[6px] !border-l-green-500',
  'border-l-[6px] !border-l-yellow-500',
  'border-l-[6px] !border-l-red-500',
  'border-l-[6px] !border-l-purple-500',
  'border-l-[6px] !border-l-pink-500',
  'border-l-[6px] !border-l-indigo-500',
  'border-l-[6px] !border-l-orange-500',
  'border-l-[6px] !border-l-teal-500',
  'border-l-[6px] !border-l-cyan-500',
];

export function useColorMap(items: InvoiceItem[]) {
  // 親商品のIDと色の対応を保持する静的なマップ
  const staticColorMap = useMemo(() => {
    const map = new Map<string, string>();
    const seenParentIds = new Set<string>();
    
    // すべての親商品を処理
    items.forEach(item => {
      if (item.type === 'parent_product' && !seenParentIds.has(item.id)) {
        // 既に色が割り当てられている場合はその色を使用
        const existingColor = map.get(item.id);
        if (existingColor) {
          seenParentIds.add(item.id);
          return;
        }
        
        // 新しい親商品には未使用の色を割り当て
        const usedColors = new Set(map.values());
        const availableColor = GROUP_COLORS.find(color => !usedColors.has(color)) || GROUP_COLORS[0];
        
        seenParentIds.add(item.id);
        map.set(item.id, availableColor);
      }
    });
    
    return map;
  }, []); // 依存配列を空にして永続的に保持

  // アイテムのカラーを取得する関数
  const getItemColor = (item: InvoiceItem): string => {
    if (item.type === 'parent_product') {
      // 既存の色があればそれを使用、なければ新しい色を割り当て
      let color = staticColorMap.get(item.id);
      if (!color) {
        const usedColors = new Set(staticColorMap.values());
        color = GROUP_COLORS.find(c => !usedColors.has(c)) || GROUP_COLORS[0];
        staticColorMap.set(item.id, color);
      }
      return color;
    }
    if (item.parentId) {
      return staticColorMap.get(item.parentId) || '';
    }
    return '';
  };

  return { getItemColor };
} 