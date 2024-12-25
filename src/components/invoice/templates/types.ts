import { InvoiceItem } from '../types';

export type InvoiceTemplateProps = {
  items: InvoiceItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItems: (items: InvoiceItem[]) => void;
};

export type ColumnType = 
  | 'title'
  | 'quantity'
  | 'unitPrice'
  | 'taxRate'
  | 'splitRatio'
  | 'subtotal'
  | 'operation';

export type Column = {
  type: ColumnType;
  label: string;
  width: number;
  required?: boolean;
}; 