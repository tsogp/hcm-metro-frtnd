"use client";

import { useEffect, useState } from "react";
import { TicketItemDisplay } from "./ticket-item-display";
import { useCartStore } from "@/store/cart-store";
import {
  getAllTicketTypes,
  getBestTicketTypes,
  TicketType,
} from "@/action/ticket-type";
import { MetrolineStationSchedule } from "@/types/metroline";
import { useServerCart } from "@/components/provider/cart-provider";
import { useUserStore } from "@/store/user-store";

interface TicketListProps {
  selectedTrip: MetrolineStationSchedule;
}

export function TicketList({ selectedTrip }: TicketListProps) {
  const { addCartItem, refreshCart } = useServerCart();
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const { currentUser } = useUserStore();

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        let types: TicketType[] = [];
        let metroLineId = selectedTrip.schedules[0].metroLineId;
        if (currentUser && currentUser.passengerEmail) {
          types = await getBestTicketTypes(
            currentUser.passengerEmail,
            metroLineId
          );
        } else {
          types = await getAllTicketTypes(metroLineId);
        }

        setTicketTypes(Array.isArray(types) ? types : []);

        // Initialize quantities after ticket types are fetched
        setQuantities(
          types.reduce(
            (acc, ticket) => ({ ...acc, [ticket.ticketType]: 0 }),
            {}
          )
        );
      } catch (error) {
        console.error("Error fetching ticket types:", error);
        setTicketTypes([]);
      }
    };
    fetchTicketTypes();
  }, [currentUser?.passengerEmail]);

  const addItem = useCartStore((state) => state.addItem);

  const handleIncrement = (ticketType: string) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketType]: (prev[ticketType] || 0) + 1,
    }));
  };

  const handleDecrement = (ticketType: string) => {
    if (quantities[ticketType] > 0) {
      setQuantities((prev) => ({
        ...prev,
        [ticketType]: prev[ticketType] - 1,
      }));
    }
  };

  const handleAddToCartStore = (ticketType: string) => {
    const ticketInTypes = ticketTypes.find((t) => t.ticketType === ticketType);
    if (!ticketInTypes) {
      return;
    }

    const isFreeTicket = ticketInTypes.ticketType === "FREE";
    const ticketQuantity = isFreeTicket ? 1 : quantities[ticketType];

    if (ticketQuantity > 0) {
      if (isFreeTicket) {
        handleIncrement("FREE");
      }

      addItem({
        lineId: selectedTrip.schedules[0].metroLineId,
        lineName: selectedTrip.schedules[0].metroLineName,
        startStationId: selectedTrip.schedules[0].stationId,
        startStationName: selectedTrip.schedules[0].stationName,
        endStationId:
          selectedTrip.schedules[selectedTrip.schedules.length - 1].stationId,
        endStationName:
          selectedTrip.schedules[selectedTrip.schedules.length - 1].stationName,
        ticketTypeName: ticketInTypes.ticketType,
        price: ticketInTypes.price,
        quantity: quantities[ticketType],
        expiryInterval: ticketInTypes.expiryDescription,
      });
    }
  };

  const handleAddToCart = (ticketType: string) => {
    const cartItemData = {
      lineId: selectedTrip.schedules[0].metroLineId,
      startStationId: selectedTrip.schedules[0].stationId,
      endStationId:
        selectedTrip.schedules[selectedTrip.schedules.length - 1].stationId,
      ticketType: ticketType,
      amount: quantities[ticketType],
    };

    handleAddToCartStore(ticketType);
    addCartItem(cartItemData);
    refreshCart();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ticketTypes.map((ticket, index) => (
        <TicketItemDisplay
          key={ticket.ticketType}
          ticket={{
            lineName: selectedTrip.schedules[0].metroLineName,
            startStationName: selectedTrip.schedules[0].stationName,
            endStationName:
              selectedTrip.schedules[selectedTrip.schedules.length - 1]
                .stationName,
            ticketTypeName: ticket.ticketType,
            price: ticket.price,
            expiryInterval: ticket.expiryDescription,
            // suspended: !ticket.active,
          }}
          quantity={quantities[ticket.ticketType]}
          onIncrement={() => handleIncrement(ticket.ticketType)}
          onDecrement={() => handleDecrement(ticket.ticketType)}
          onAddToCart={() => handleAddToCart(ticket.ticketType)}
          index={index}
        />
      ))}
    </div>
  );
}
