import { useMemo } from 'react';
import { InvoiceItem } from '@/components/invoice/types';

export type InvoiceTotals = {
  product: number;
  inspection: number;
  work: number;
  packaging: number;
  shipping: number;
  total: number;
};

export function useInvoiceTotals(items: InvoiceItem[]): InvoiceTotals {
  return useMemo(() => {
    // 各項目の合計を計算する関数
    const calculateTotal = (items: InvoiceItem[]): number => {
      return items.reduce((sum, item) => {
        const amount = item.quantity * item.unitPrice;
        if (item.splitRatio) {
          // 分割支払いの場合は、分割比率に応じた金額を計算
          return sum + (amount * (item.splitRatio / 100));
        }
        return sum + amount;
      }, 0);
    };

    // 商品の合計
    const productItems = items.filter(item => item.type === 'product');
    const productTotal = calculateTotal(productItems);

    // オプションの種類ごとの合計
    const optionItems = items.filter(item => item.type === 'option');
    const inspectionTotal = calculateTotal(
      optionItems.filter(item => item.title.includes('検品'))
    );
    const workTotal = calculateTotal(
      optionItems.filter(item => item.title.includes('作業'))
    );
    const packagingTotal = calculateTotal(
      optionItems.filter(item => 
        item.title.includes('OPP袋') || 
        item.title.includes('PE袋') || 
        item.title.includes('ラッピング') || 
        item.title.includes('包装')
      )
    );
    const shippingTotal = calculateTotal(
      optionItems.filter(item => item.title.includes('配送') || item.title.includes('運送'))
    );

    // 総合計を計算
    const grandTotal = productTotal + inspectionTotal + workTotal + packagingTotal + shippingTotal;

    return {
      product: Number(productTotal.toFixed(2)),
      inspection: Number(inspectionTotal.toFixed(2)),
      work: Number(workTotal.toFixed(2)),
      packaging: Number(packagingTotal.toFixed(2)),
      shipping: Number(shippingTotal.toFixed(2)),
      total: Number(grandTotal.toFixed(2))
    };
  }, [items]);
} 