import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  IdCardIcon,
  Mail,
  TicketIcon,
} from "lucide-react";
import { InvoiceItem, Invoice } from "@/types/invoice";
import InvoiceItemDisplay from "./invoice-item-display";
import { Station } from "@/types/station";

interface InvoiceSummaryCardProps {
  invoice: Invoice;
  expandedInvoice: string;
  toggleInvoice: (invoiceID: string) => void;
  invoiceItems: Record<string, InvoiceItem[]>;
  stations: Station[];
  searchTerm?: string;
}

const InvoiceSummaryCard = ({
  invoice,
  expandedInvoice,
  toggleInvoice,
  invoiceItems,
  stations,
  searchTerm,
}: InvoiceSummaryCardProps) => {
  const highlightMatch = (text: string, highlight: string | undefined) => {
    if (!highlight?.trim()) {
      return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-yellow-200 font-bold rounded-sm">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <>
      <Card
        className={`gap-2 py-6 border-2 ${
          expandedInvoice === invoice.invoiceId
            ? "border-blue-600 border-3 border-b-0 rounded-bl-none rounded-br-none"
            : "border-blue-200 rounded-xl"
        }`}
      >
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="flex items-center text-2xl">
                Invoice Details
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="mr-2 size-4" />
                Purchased on {formatDate(new Date(invoice.purchasedAt))}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 px-4 py-2 rounded-md text-right">
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(invoice.totalPrice)}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-100 px-4 py-3 rounded-md">
            <div className="space-y-1">
              <h3 className="text-md font-bold text-muted-foreground">
                Passenger Information
              </h3>
              <p className="flex items-center">
                <IdCardIcon className="mr-1 size-5" />
                <span className="font-bold mr-1">Passenger ID:</span>
                {invoice.passengerId}
              </p>
              <p className="flex items-center">
                <Mail className="mr-1 size-5" />
                <span className="font-bold mr-1">Email:</span>
                {invoice.email}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-md font-bold text-muted-foreground">
                Invoice Details
              </h3>
              <p className="flex items-center font-mono text-md">
                <TicketIcon className="mr-1 size-5" />
                <span className="font-bold mr-1">Ticket ID:</span>
                {highlightMatch(invoice.invoiceId, searchTerm)}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-1">
          <Button
            className={`w-full ${
              expandedInvoice === invoice.invoiceId
                ? "bg-primary text-white hover:bg-primary/70"
                : ""
            }`}
            variant="outline"
            size="sm"
            onClick={() => toggleInvoice(invoice.invoiceId)}
          >
            {expandedInvoice === invoice.invoiceId ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide purchased tickets
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                View purchased tickets
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {expandedInvoice === invoice.invoiceId && (
        <InvoiceItemDisplay
          invoice={invoice}
          invoiceItems={invoiceItems}
          stations={stations}
        />
      )}
    </>
  );
};

export default InvoiceSummaryCard;
