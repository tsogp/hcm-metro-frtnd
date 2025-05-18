"use client";

import { useState } from "react";
import InvoiceList from "./_components/invoice-list";

const invoices = [
  {
    invoiceID: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    passengerID: "PASS-001",
    email: "john.doe@example.com",
    totalPrice: 125000,
    purchasedAt: new Date("2023-05-15T10:30:00"),
    passenger: "John Doe", // keeping this for display purposes
  },
  {
    invoiceID: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    passengerID: "PASS-002",
    email: "jane.smith@example.com",
    totalPrice: 78000,
    purchasedAt: new Date("2023-05-16T14:45:00"),
    passenger: "Jane Smith",
  },
  {
    invoiceID: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    passengerID: "PASS-003",
    email: "robert.j@example.com",
    totalPrice: 210000,
    purchasedAt: new Date("2023-05-17T09:15:00"),
    passenger: "Robert Johnson",
  },
  {
    invoiceID: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    passengerID: "PASS-004",
    email: "emily.davis@example.com",
    totalPrice: 45000,
    purchasedAt: new Date("2023-05-18T16:20:00"),
    passenger: "Emily Davis",
  },
  {
    invoiceID: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb",
    passengerID: "PASS-005",
    email: "michael.w@example.com",
    totalPrice: 156000,
    purchasedAt: new Date("2023-05-19T11:50:00"),
    passenger: "Michael Wilson",
  },
];

const invoiceItems = {
  "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d": [
    {
      invoiceItemId: "00000000-0000-0000-0000-000000000009",
      invoiceId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      ticketName: "Express Pass - Premium Business Class with Extra Legroom",
      ticketType: "One-way Business Class",
      price: 45000,
      activatedAt: new Date("2023-05-15T11:00:00"),
      expiredAt: new Date("2023-05-15T23:59:59"),
      lineId: "L1",
      lineName: "Blue Line",
      startStation: "Central Station",
      endStation: "Airport Terminal",
      duration: 30,
    },
    {
      invoiceItemId: "item-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d-2",
      invoiceId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      ticketName: "Day Pass",
      ticketType: "Unlimited",
      price: 80000,
      activatedAt: new Date("2023-05-16T08:00:00"),
      expiredAt: new Date("2023-05-16T23:59:59"),
      lineId: "ALL",
      lineName: "All Lines",
      startStation: "Any",
      endStation: "Any",
      duration: 0,
    },
  ],
  "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed": [
    {
      invoiceItemId: "item-1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed-1",
      invoiceId: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
      ticketName: "Standard Ticket",
      ticketType: "Round-trip",
      price: 78000,
      activatedAt: new Date("2023-05-16T15:00:00"),
      expiredAt: new Date("2023-05-17T15:00:00"),
      lineId: "L2",
      lineName: "Red Line",
      startStation: "Downtown",
      endStation: "Suburb Center",
      duration: 45,
    },
  ],
  "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b": [
    {
      invoiceItemId: "item-6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b-1",
      invoiceId: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
      ticketName: "Premium Pass",
      ticketType: "One-way",
      price: 65000,
      activatedAt: new Date("2023-05-17T10:00:00"),
      expiredAt: new Date("2023-05-17T23:59:59"),
      lineId: "L3",
      lineName: "Green Line",
      startStation: "North Terminal",
      endStation: "South Terminal",
      duration: 55,
    },
    {
      invoiceItemId: "item-6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b-2",
      invoiceId: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
      ticketName: "Express Pass",
      ticketType: "One-way",
      price: 45000,
      activatedAt: new Date("2023-05-18T11:00:00"),
      expiredAt: new Date("2023-05-18T23:59:59"),
      lineId: "L1",
      lineName: "Blue Line",
      startStation: "Airport Terminal",
      endStation: "Central Station",
      duration: 30,
    },
    {
      invoiceItemId: "item-6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b-3",
      invoiceId: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
      ticketName: "Weekend Pass",
      ticketType: "Unlimited",
      price: 100000,
      activatedAt: new Date("2023-05-20T00:00:00"),
      expiredAt: new Date("2023-05-21T23:59:59"),
      lineId: "ALL",
      lineName: "All Lines",
      startStation: "Any",
      endStation: "Any",
      duration: 0,
    },
  ],
  "d290f1ee-6c54-4b01-90e6-d701748f0851": [
    {
      invoiceItemId: "item-d290f1ee-6c54-4b01-90e6-d701748f0851-1",
      invoiceId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      ticketName: "Standard Ticket",
      ticketType: "One-way",
      price: 45000,
      activatedAt: new Date("2023-05-18T17:00:00"),
      expiredAt: new Date("2023-05-18T23:59:59"),
      lineId: "L4",
      lineName: "Yellow Line",
      startStation: "East Station",
      endStation: "West Station",
      duration: 40,
    },
  ],
  "e8fd159b-57c4-4d36-9bd7-a59ca13057bb": [
    {
      invoiceItemId: "item-e8fd159b-57c4-4d36-9bd7-a59ca13057bb-1",
      invoiceId: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb",
      ticketName: "Weekly Pass",
      ticketType: "Unlimited",
      price: 156000,
      activatedAt: new Date("2023-05-20T00:00:00"),
      expiredAt: new Date("2023-05-26T23:59:59"),
      lineId: "ALL",
      lineName: "All Lines",
      startStation: "Any",
      endStation: "Any",
      duration: 0,
    },
  ],
};

export default function InvoicesPage() {
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

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
      />
    </div>
  );
}
