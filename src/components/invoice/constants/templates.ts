import { InvoiceTemplate } from '../types';

export const DEFAULT_TEMPLATES = [
  {
    id: 'basic',
    name: '基本',
    description: '基本的な明細項目のみ表示',
  },
  {
    id: 'with-tax',
    name: '税込み',
    description: '税率と税額を含む',
  },
  {
    id: 'split-payment',
    name: '分割支払い',
    description: '分割比率を含む',
  },
]; 