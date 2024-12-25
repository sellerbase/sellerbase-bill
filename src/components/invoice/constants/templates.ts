import { InvoiceTemplate } from '../types';

// 基本テンプレート
export const BASIC_TEMPLATE: InvoiceTemplate = {
  id: 'basic',
  name: '基本テンプレート',
  description: '標準的な明細項目を含むテンプレート',
  columns: [
    { type: 'title', label: '名目', width: 4, required: true },
    { type: 'quantity', label: '数量', width: 2, required: true },
    { type: 'unitPrice', label: '単価', width: 2, required: true },
    { type: 'subtotal', label: '小計', width: 2, required: true },
    { type: 'operation', label: '操作', width: 2, required: true }
  ]
};

// 税込みテンプレート
export const TAX_INCLUDED_TEMPLATE: InvoiceTemplate = {
  id: 'tax-included',
  name: '税込みテンプレート',
  description: '税率と税額を含むテンプレート',
  columns: [
    { type: 'title', label: '名目', width: 3, required: true },
    { type: 'quantity', label: '数量', width: 1, required: true },
    { type: 'unitPrice', label: '単価', width: 2, required: true },
    { type: 'taxRate', label: '税率', width: 1, required: true },
    { type: 'taxAmount', label: '税額', width: 1, required: true },
    { type: 'subtotal', label: '小計', width: 2, required: true },
    { type: 'operation', label: '操作', width: 2, required: true }
  ]
};

// 分割請求テンプレート
export const SPLIT_BILLING_TEMPLATE: InvoiceTemplate = {
  id: 'split-billing',
  name: '分割請求テンプレート',
  description: '請求金額の分割に対応したテンプレート',
  columns: [
    { type: 'title', label: '名目', width: 3, required: true },
    { type: 'quantity', label: '数量', width: 1, required: true },
    { type: 'unitPrice', label: '単価', width: 2, required: true },
    { type: 'splitRatio', label: '分割比率', width: 1, required: true },
    { type: 'subtotal', label: '小計', width: 2, required: true },
    { type: 'note', label: '備考', width: 1 },
    { type: 'operation', label: '操作', width: 2, required: true }
  ]
};

// カテゴリ分類テンプレート
export const CATEGORY_TEMPLATE: InvoiceTemplate = {
  id: 'category',
  name: 'カテゴリ分類テンプレート',
  description: 'カテゴリと日付で管理するテンプレート',
  columns: [
    { type: 'date', label: '日付', width: 2, required: true },
    { type: 'category', label: 'カテゴリ', width: 2, required: true },
    { type: 'title', label: '名目', width: 2, required: true },
    { type: 'quantity', label: '数量', width: 1, required: true },
    { type: 'unitPrice', label: '単価', width: 2, required: true },
    { type: 'subtotal', label: '小計', width: 1, required: true },
    { type: 'operation', label: '操作', width: 2, required: true }
  ]
};

// デフォルトのテンプレート一覧
export const DEFAULT_TEMPLATES = [
  BASIC_TEMPLATE,
  TAX_INCLUDED_TEMPLATE,
  SPLIT_BILLING_TEMPLATE,
  CATEGORY_TEMPLATE
]; 