"use client";

import { useState } from "react";
import { TicketItemDisplay } from "./ticket-item-display";
import { useCartStore } from "@/store/cart-store";

// Define ticket types and their properties
export const TICKET_TYPES = {
  ONE_WAY: {
    name: "One Way",
    expiryInterval: "24h after purchased",
  },
  DAILY: {
    name: "Daily",
    expiryInterval: "24h after activation",
  },
  THREE_DAY: {
    name: "Three Day",
    expiryInterval: "3 days after activation",
  },
  MONTHLY_STUDENT: {
    name: "Monthly (Student)",
    expiryInterval: "30 days after activation",
  },
  MONTHLY_ADULT: {
    name: "Monthly (Adult)",
    expiryInterval: "30 days after activation",
  },
  FREE_DISABILITY: {
    name: "Free",
    expiryInterval: "Free",
  },
};

// Sample data for tickets
const tickets = [
  {
    id: 1,
    line: "Blue Line",
    startStation: "Central Station",
    endStation: "Harbor Terminal",
    type: TICKET_TYPES.ONE_WAY,
    price: 2.5,
    suspended: false,
  },
  {
    id: 2,
    line: "Red Line",
    startStation: "North Square",
    endStation: "South Market",
    type: TICKET_TYPES.DAILY,
    price: 5.0,
    suspended: true,
  },
  {
    id: 3,
    line: "Green Line",
    startStation: "East Park",
    endStation: "West Hills",
    type: TICKET_TYPES.THREE_DAY,
    price: 12.0,
    suspended: false,
  },
  {
    id: 4,
    line: "Yellow Line",
    startStation: "University",
    endStation: "Downtown",
    type: TICKET_TYPES.MONTHLY_STUDENT,
    price: 45.0,
    suspended: false,
  },
  {
    id: 5,
    line: "Purple Line",
    startStation: "Airport",
    endStation: "Business District",
    type: TICKET_TYPES.MONTHLY_ADULT,
    price: 60.0,
    suspended: true,
  },
  {
    id: 6,
    line: "Orange Line",
    startStation: "Hospital",
    endStation: "Community Center",
    type: TICKET_TYPES.FREE_DISABILITY,
    price: 0.0,
    suspended: false,
  },
];

export function TicketList() {
  const [quantities, setQuantities] = useState<Record<number, number>>(
    tickets.reduce((acc, ticket) => ({ ...acc, [ticket.id]: 0 }), {})
  );
  const addItem = useCartStore((state) => state.addItem);

  const handleIncrement = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id: number) => {
    if (quantities[id] > 0) {
      setQuantities((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    }
  };

  const handleAddToCart = (id: number) => {
    if (quantities[id] > 0) {
      const ticket = tickets.find((t) => t.id === id);
      if (ticket) {
        addItem({
          id: ticket.id.toString(),
          name: ticket.line,
          price: ticket.price,
          quantity: quantities[id],
          line: ticket.line,
          startStation: ticket.startStation,
          endStation: ticket.endStation,
          type: ticket.type,
          suspended: ticket.suspended,
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket, index) => (
        <TicketItemDisplay
          key={ticket.id}
          ticket={ticket}
          quantity={quantities[ticket.id]}
          onIncrement={() => handleIncrement(ticket.id)}
          onDecrement={() => handleDecrement(ticket.id)}
          onAddToCart={() => handleAddToCart(ticket.id)}
          index={index}
        />
      ))}
    </div>
  );
}
