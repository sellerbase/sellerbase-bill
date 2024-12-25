import { CSSProperties, ReactNode } from 'react';

// 親商品（グループ）の型
export type ParentProduct = {
  id: string;
  name: string;
  customerId?: string;
};

// 子商品の型
export type ChildProduct = {
  id: string;
  parentId: string;
  name: string;
  price: number;
};

// オプションの型
export type Option = {
  id: string;
  name: string;
  price: number;
  category: string;
};

// 明細項目の型
export type InvoiceItem = {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  type: 'parent_product' | 'child_product' | 'option';
  notes?: string;
  splitRatio?: number;
  remainingAmount?: number;
  parentId?: string | null;
  groupOrder: number;
  itemOrder: number;
  isParent?: boolean;
};

// ドラッグ&ドロップのドロップ位置の型
export type DropPosition = {
  parentId?: string;
  index: number;
  type: 'group' | 'item';
};

export type DraggableProvided = {
  draggableProps: {
    style?: CSSProperties;
    [key: string]: any;
  };
  dragHandleProps: {
    [key: string]: any;
  } | null;
  innerRef: (element: HTMLElement | null) => void;
};

export type DroppableProvided = {
  droppableProps: {
    [key: string]: any;
  };
  innerRef: (element: HTMLElement | null) => void;
  placeholder?: ReactNode;
};

// テンプレートの列の型定義
export type InvoiceColumnType = 
  | 'title'      // 名目
  | 'quantity'   // 数量
  | 'unitPrice'  // 単価
  | 'subtotal'   // 小計
  | 'taxRate'    // 税率
  | 'taxAmount'  // 税額
  | 'note'       // 備考
  | 'date'       // 日付
  | 'category'   // カテゴリ
  | 'splitRatio' // 分割比率
  | 'discount'   // 値引き
  | 'operation'; // 操作

// 列の設定の型定義
export type InvoiceColumn = {
  type: InvoiceColumnType;
  label: string;
  width: number; // グリッドの列幅（12分割中の値）
  required?: boolean;
  format?: (value: any) => string;
};

// テンプレートの型定義
export type InvoiceTemplate = {
  id: string;
  name: string;
  description: string;
  columns: InvoiceColumn[];
}; 