"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TicketList } from "@/components/ticket/ticket-list";
import SearchForm from "@/app/dashboard/_components/search-ticket-form";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { MetroLine, MetrolineStationSchedule } from "@/types/metroline";
import { getMetrolineById } from "@/action/metroline";
import { getAllTicketTypes } from "@/action/ticket-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getMetrolineStationsSchedule } from "@/action/schedule-trip";

import { formatCurrency } from "@/lib/utils";
import ScheduleTripList from "./_components/schedule/schedule-trip-list";

interface Ticket {
  ticketType: string;
  typeName: string;
  price: number;
  expiryDescription: string;
  requirementDescription: string;
  expiryInterval: {
    seconds: number;
    zero: boolean;
    nano: number;
    negative: boolean;
    positive: boolean;
    units: [
      {
        durationEstimated: boolean;
        timeBased: boolean;
        dateBased: boolean;
      }
    ];
  };
  active: boolean;
}

export default function Dashboard() {
  const [metrolineTripSchedule, setMetrolineTripSchedule] = useState<
    MetrolineStationSchedule[]
  >([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState<number | null>(
    null
  );
  const [selectedMetroLine, setSelectedMetroLine] = useState<MetroLine | null>(
    null
  );
  const [ticketTypes, setTicketTypes] = useState<Ticket[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isLoadingMetroLine, setIsLoadingMetroLine] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = async (
    startId: string,
    endId: string,
    dateTime: string
  ) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSelectedTripIndex(null);
    setSelectedMetroLine(null);
    setTicketTypes([]);
    setSelectedTicketType("");

    try {
      const onSearchingTripScheduleAction = getMetrolineStationsSchedule(
        startId,
        endId,
        dateTime
      );
      toast.promise(onSearchingTripScheduleAction, {
        loading: "Searching trip schedule...",
        success: async (trips) => {
          setMetrolineTripSchedule(trips);
          console.log("TRIPS: ", trips);

          if (
            trips &&
            trips.length > 0 &&
            trips[0].schedules &&
            trips[0].schedules.length > 0
          ) {
            const metroLineId = trips[0].schedules[0].metroLineId;
            const metroLineDetails = await getMetrolineById(metroLineId);
            console.log("METRO LINE DETAILS: ", metroLineDetails);
          }

          return "Available trips found for next 60 minutes";
        },
        error: (error) => {
          console.error("Error fetching schedules:", error);
          return "Failed to find trip schedule";
        },
      });

      console.log("SEARCHED METROLINE: ", onSearchingTripScheduleAction);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching schedules:", err);
      setMetrolineTripSchedule([]);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSelectTrip = async (index: number) => {
  //   setSelectedTripIndex(index);
  //   setQuantity(1);
  //   setIsDialogOpen(true);

  //   const selectedTrip = metrolineTripSchedule[index];
  //   const metroLineId = selectedTrip.schedules[0].metroLineId;

  //   // Fetch metro line details
  //   setIsLoadingMetroLine(true);
  //   try {
  //     const metroLine = await getMetrolineById(metroLineId);
  //     setSelectedMetroLine(metroLine);
  //   } catch (error) {
  //     console.error("Error fetching metro line details:", error);
  //     toast.error("Failed to load metro line details");
  //   } finally {
  //     setIsLoadingMetroLine(false);
  //   }

  //   // Fetch ticket types for this metro line
  //   setIsLoadingTickets(true);
  //   try {
  //     const tickets = await getAllTicketTypes(metroLineId);
  //     setTicketTypes(tickets);

  //     // Set default selected ticket type
  //     if (tickets.length > 0) {
  //       setSelectedTicketType(tickets[0].ticketType);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching ticket types:", error);
  //     toast.error("Failed to load ticket types");
  //   } finally {
  //     setIsLoadingTickets(false);
  //   }
  // };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (selectedTripIndex === null || !selectedMetroLine) return;

    const selectedTrip = metrolineTripSchedule[selectedTripIndex];
    const selectedTicket = ticketTypes.find(
      (t) => t.ticketType === selectedTicketType
    );

    console.log(selectedTicket);

    if (!selectedTicket) {
      toast.error("Please select a ticket type");
      return;
    }

    const firstStation = selectedTrip.schedules[0];
    const lastStation =
      selectedTrip.schedules[selectedTrip.schedules.length - 1];

    toast.success(
      `Added to cart: ${quantity} ${selectedTicket.typeName} ticket(s) for ${
        firstStation.metroLineName
      } from ${firstStation.stationName} to ${
        lastStation.stationName
      } - ${formatCurrency(selectedTicket.price * quantity)}`
    );

    setIsDialogOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 mb-20">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 to-secondary/50 z-10" />
        <Image
          src="/images/METRO_MAP.png"
          alt="Ho Chi Minh City Metro Map"
          width={1200}
          height={400}
          priority
          className="w-full h-[250px] md:h-[350px] object-contain"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-4 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
            Your Journey Starts Here
          </h1>
          <p className="text-white/90 max-w-md mb-4 md:mb-6 text-sm md:text-base">
            Explore the city with our modern metro system. Fast, reliable, and
            convenient transportation at your fingertips.
          </p>
          <div>
            <Button className="bg-accent hover:bg-accent/90 text-white text-sm md:text-base">
              <Link href="/explorer" className="flex items-center">
                Book Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section>
        <SearchForm onSearch={handleSearch} />
      </section>

      {/* Schedule Results Section - Only shown when there are results */}
      <ScheduleTripList
        metrolineTripSchedule={metrolineTripSchedule}
        // handleSelectTrip={handleSelectTrip}
        hasSearched={hasSearched}
        isLoading={isLoading}
        error={error}
      />


      {/* Tickets Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">
          Your Tickets
        </h2>
        <TicketList />
      </section>

      {/* Ticket Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Ticket Type</DialogTitle>
          </DialogHeader>

          {selectedTripIndex !== null && (
            <div className="space-y-4">
              {isLoadingMetroLine ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : selectedMetroLine ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Metro Line:</span>
                    <span>{selectedMetroLine.metroLine.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">From:</span>
                    <span>
                      {
                        metrolineTripSchedule[selectedTripIndex].schedules[0]
                          .stationName
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">To:</span>
                    <span>
                      {
                        metrolineTripSchedule[selectedTripIndex].schedules[
                          metrolineTripSchedule[selectedTripIndex].schedules
                            .length - 1
                        ].stationName
                      }
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-red-500">
                  Failed to load metro line details
                </div>
              )}

              {isLoadingTickets ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : ticketTypes.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-medium">Ticket Type:</label>
                    <Select
                      value={selectedTicketType}
                      onValueChange={setSelectedTicketType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketTypes.map((ticket) => (
                          <SelectItem
                            key={ticket.ticketType}
                            value={ticket.ticketType}
                          >
                            {ticket.typeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTicketType && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Expires:</span>
                          <span>
                            {ticketTypes.find(
                              (t) => t.ticketType === selectedTicketType
                            )?.expiryDescription || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-medium">Price:</span>
                          <span className="font-bold text-secondary">
                            {formatCurrency(
                              ticketTypes.find(
                                (t) => t.ticketType === selectedTicketType
                              )?.price || 0
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-medium">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleDecrement}
                              disabled={quantity <= 1}
                            >
                              <Minus className="size-4" />
                            </Button>
                            <span className="w-8 text-center">{quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleIncrement}
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-secondary">
                            {formatCurrency(
                              (ticketTypes.find(
                                (t) => t.ticketType === selectedTicketType
                              )?.price || 0) * quantity
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-amber-500">
                  No ticket types available for this metro line
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              onClick={handleAddToCart}
              disabled={
                isLoadingTickets ||
                isLoadingMetroLine ||
                !selectedTicketType ||
                !selectedMetroLine
              }
            >
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
