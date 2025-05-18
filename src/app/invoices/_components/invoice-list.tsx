import InvoiceSummaryCard from "./invoice-summary-card";

export interface Invoice {
  invoiceID: string;
  passengerID: string;
  email: string;
  totalPrice: number;
  purchasedAt: Date;
  passenger: string;
}

export interface InvoiceItem {
  invoiceItemId: string;
  invoiceId: string;
  ticketName: string;
  ticketType: string;
  price: number;
  activatedAt: Date;
  expiredAt: Date;
  lineId: string;
  lineName: string;
  startStation: string;
  endStation: string;
  duration: number;
}

interface InvoiceCardListProps {
  invoices: Invoice[];
  expandedInvoice: string;
  toggleInvoice: (invoiceID: string) => void;
  invoiceItems: Record<string, InvoiceItem[]>;
}

const InvoiceCardList = ({
  invoices,
  expandedInvoice,
  toggleInvoice,
  invoiceItems,
}: InvoiceCardListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {invoices.map((invoice) => (
        <div key={invoice.invoiceID} className="space-y-2">
          <InvoiceSummaryCard
            invoice={invoice}
            expandedInvoice={expandedInvoice}
            toggleInvoice={toggleInvoice}
            invoiceItems={invoiceItems}
          />
        </div>
      ))}
    </div>
  );
};

export default InvoiceCardList;
