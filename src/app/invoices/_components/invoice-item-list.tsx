import { InvoiceItem, Invoice } from "@/types/invoice";
import InvoiceItemDisplay from "./invoice-item-display";

interface InvoiceItemListProps {
  invoice: Invoice;
  invoiceItems: Record<string, InvoiceItem[]>;
}

const InvoiceItemList = ({ invoice, invoiceItems }: InvoiceItemListProps) => {
  return (
    <div className="p-4 border-3 border-t-0 border-blue-600 rounded-b-xl space-y-2 animate-in slide-in-from-top-2 duration-300 origin-top">
      <div className="grid grid-cols-1 gap-4">
        {invoiceItems[invoice.invoiceId as keyof typeof invoiceItems]?.map(
          (item) => (
            <InvoiceItemDisplay
              key={item.invoiceItemId}
              invoice={invoice}
              invoiceItems={invoiceItems}
              stations={[]}
            />
          )
        )}
      </div>
    </div>
  );
};

export default InvoiceItemList;
