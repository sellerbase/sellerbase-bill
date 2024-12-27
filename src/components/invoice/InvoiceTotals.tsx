import { InvoiceItem } from './types';
import BasicTotals from './templates/basic/BasicTotals';
import WithTaxTotals from './templates/with-tax/WithTaxTotals';
import SplitPaymentTotals from './templates/split-payment/SplitPaymentTotals';

type InvoiceTotalsProps = {
  items: InvoiceItem[];
  templateId: string;
};

export default function InvoiceTotals({ items, templateId }: InvoiceTotalsProps) {
  switch (templateId) {
    case 'with-tax':
      return <WithTaxTotals items={items} />;
    case 'split-payment':
      return <SplitPaymentTotals items={items} />;
    default:
      return <BasicTotals items={items} />;
  }
} 