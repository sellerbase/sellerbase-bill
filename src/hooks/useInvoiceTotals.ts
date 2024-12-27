import { useMemo } from 'react';
import { InvoiceItem } from '../components/invoice/types';

type InvoiceTotals = {
  product: number;
  inspection: number;
  work: number;
  packaging: number;
  shipping: number;
  subtotal: number;
  taxAmount: number;
  totalWithTax: number;
  splitTotal: number;
  formatCurrency: (amount: number) => string;
};

export const useInvoiceTotals = (items: InvoiceItem[], templateId?: string): InvoiceTotals => {
  return useMemo(() => {
    // カテゴリ別の集計を行う
    const categoryTotals = items.reduce((acc, item) => {
      const subtotal = item.quantity * item.unitPrice;
      // 税込テンプレートの場合のみ税率を計算
      const taxRate = templateId === 'with-tax' ? (item.taxRate || 0) : 0;
      // 分割支払いテンプレートの場合のみ分割比率を適用
      const splitRatio = templateId === 'split-payment' ? (item.splitRatio || 1) : 1;
      const taxAmount = subtotal * (taxRate / 100);
      const totalWithTax = subtotal + taxAmount;
      const splitAmount = totalWithTax * splitRatio;

      // カテゴリ別の集計（分割後の金額で集計）
      if (item.type === 'child_product') {
        acc.product += splitAmount;
      } else if (item.type === 'option') {
        if (item.title.includes('検品')) {
          acc.inspection += splitAmount;
        } else if (item.title.includes('作業')) {
          acc.work += splitAmount;
        } else if (
          item.title.includes('OPP袋') || 
          item.title.includes('PE袋') || 
          item.title.includes('ラッピング') || 
          item.title.includes('包装')
        ) {
          acc.packaging += splitAmount;
        } else if (item.title.includes('配送') || item.title.includes('運送')) {
          acc.shipping += splitAmount;
        }
      }

      // 全体の集計
      acc.subtotal += subtotal;
      acc.taxAmount += taxAmount;
      acc.totalWithTax += totalWithTax;
      acc.splitTotal += splitAmount;

      return acc;
    }, {
      product: 0,
      inspection: 0,
      work: 0,
      packaging: 0,
      shipping: 0,
      subtotal: 0,
      taxAmount: 0,
      totalWithTax: 0,
      splitTotal: 0
    });

    // 分割支払いテンプレートの場合は分割金額を合計として返す
    const finalTotal = templateId === 'split-payment' ? categoryTotals.splitTotal : categoryTotals.totalWithTax;

    return {
      ...categoryTotals,
      totalWithTax: finalTotal,
      // 金額を整形するヘルパー関数
      formatCurrency: (amount: number) => `¥${amount.toFixed(2)}`
    };
  }, [items, templateId]);
}; 