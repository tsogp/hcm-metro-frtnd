"use client";

import { useEffect, useState } from "react";
import InvoiceList from "./_components/invoice-list";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { getMyInvoices } from "@/action/invoice";
import { getAllStations } from "@/action/stations";
import { Station } from "@/types/station";
export default function InvoicesPage() {
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<
    Record<string, InvoiceItem[]>
  >({});
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await getMyInvoices();
      setInvoices(invoices);
      setInvoiceItems(
        invoices.reduce(
          (acc, invoice) => ({
            ...acc,
            [invoice.invoiceID]: invoice.items,
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

  const toggleInvoice = (invoiceID: string) => {
    if (expandedInvoice === invoiceID) {
      setExpandedInvoice(null);
    } else {
      setExpandedInvoice(invoiceID);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4 bg-slate-100 p-4 rounded-lg border">
        <h1 className="text-2xl font-bold">Invoices</h1>
      </div>

      <InvoiceList
        invoices={invoices}
        expandedInvoice={expandedInvoice ?? ""}
        toggleInvoice={toggleInvoice}
        invoiceItems={invoiceItems}
        stations={stations}
        />
    </div>
  );
}
