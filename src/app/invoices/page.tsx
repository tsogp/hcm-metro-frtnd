"use client";

import { useEffect, useState } from "react";
import InvoiceList from "./_components/invoice-list";
import type { Invoice, InvoiceItem } from "@/types/invoice";
import { getMyInvoices } from "@/action/invoice";
import { getAllStations } from "@/action/station";
import type { Station } from "@/types/station";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InvoicesPage() {
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<
    Record<string, InvoiceItem[]>
  >({});
  const [stations, setStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await getMyInvoices();
      setInvoices(
        invoices.sort(
          (a, b) =>
            new Date(b.purchasedAt).getTime() -
            new Date(a.purchasedAt).getTime()
        )
      );
      setFilteredInvoices(invoices);
      setInvoiceItems(
        invoices.reduce(
          (acc, invoice) => ({
            ...acc,
            [invoice.invoiceId]: invoice.items,
          }),
          {} as Record<string, InvoiceItem[]>
        )
      );
    };
    fetchInvoices();

    const fetchStations = async () => {
      const stations = await getAllStations();
      setStations(stations);
    };
    fetchStations();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter((invoice) =>
        invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, invoices]);

  const toggleInvoice = (invoiceID: string) => {
    if (expandedInvoice === invoiceID) {
      setExpandedInvoice(null);
    } else {
      setExpandedInvoice(invoiceID);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg border">
          <h1 className="text-2xl font-bold">Invoices</h1>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search invoices by ID..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <Alert className="my-4 border-amber-200 bg-amber-50">
          <AlertDescription className="flex items-center">
            No invoices found matching "{searchTerm}". Try a different search
            term.
          </AlertDescription>
        </Alert>
      ) : (
        <InvoiceList
          invoices={filteredInvoices}
          expandedInvoice={expandedInvoice ?? ""}
          toggleInvoice={toggleInvoice}
          invoiceItems={invoiceItems}
          stations={stations}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
}
