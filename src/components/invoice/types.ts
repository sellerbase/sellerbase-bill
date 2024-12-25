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
  type: 'product' | 'option';
  notes?: string;
  splitRatio?: number;
  remainingAmount?: number;
  parentId?: string | null;
  groupOrder: number;
  itemOrder: number;
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