import { Invoice, InvoiceItem } from "@/types/invoice";
import InvoiceSummaryCard from "./invoice-summary-card";
import { Station } from "@/types/station";

interface InvoiceCardListProps {
  invoices: Invoice[];
  expandedInvoice: string;
  toggleInvoice: (invoiceID: string) => void;
  invoiceItems: Record<string, InvoiceItem[]>;
  stations: Station[];
}

const InvoiceCardList = ({
  invoices,
  expandedInvoice,
  toggleInvoice,
  invoiceItems,
  stations,
}: InvoiceCardListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {invoices.map((invoice) => (
        <div key={invoice.invoiceId} className="space-y-2">
          <InvoiceSummaryCard
            invoice={invoice}
            expandedInvoice={expandedInvoice}
            toggleInvoice={toggleInvoice}
            invoiceItems={invoiceItems}
            stations={stations}
          />
        </div>
      ))}
    </div>
  );
};

export default InvoiceCardList;
