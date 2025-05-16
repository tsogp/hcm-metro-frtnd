"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TicketList } from "@/app/dashboard/_components/ticket/ticket-list";
import SearchForm from "@/app/dashboard/_components/search-ticket-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { MetroLine, MetrolineStationSchedule } from "@/types/metroline";
import { getMetrolineById } from "@/action/metroline";
import {
  getAllTicketTypes,
  getBestTicketTypes,
  TicketType,
} from "@/action/ticket-type";
import { getMetrolineStationsSchedule } from "@/action/schedule-trip";
import ScheduleTripList from "@/app/dashboard/_components/schedule/schedule-trip-list";
import { useUserStore } from "@/store/user-store";

export default function Dashboard() {
  const { currentUser, checkAuth } = useUserStore();
  const [metrolineTripSchedule, setMetrolineTripSchedule] = useState<
    MetrolineStationSchedule[]
  >([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState<number | null>(
    null
  );
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      await checkAuth();
    };
    initializeUser();
  }, [checkAuth]);

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        let types: TicketType[] = [];

        // Only try to get best ticket types if we have a valid user with email
        // if (currentUser && currentUser.passengerEmail) {
        //   console.log(
        //     "Fetching best ticket types for user:",
        //     currentUser.passengerEmail
        //   );
        //   types = await getBestTicketTypes(currentUser.passengerEmail);
        // }

        types = await getAllTicketTypes();
        setTicketTypes(Array.isArray(types) ? types : []);
      } catch (error) {
        console.error("Error fetching ticket types:", error);
        setTicketTypes([]);
      }
    };
    fetchTicketTypes();
  }, [currentUser?.passengerEmail]);

  const handleSearch = async (
    startId: string,
    endId: string,
    dateTime: string
  ) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSelectedTripIndex(null);

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

          if (
            trips &&
            trips.length > 0 &&
            trips[0].schedules &&
            trips[0].schedules.length > 0
          ) {
            return "Available trips found for next 60 minutes";
          }
        },
        error: (error) => {
          console.error("Error fetching schedules:", error);
          return "Failed to find trip schedule";
        },
      });
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

  const handleSelectTrip = (index: number) => {
    setSelectedTripIndex(index);
    console.log(metrolineTripSchedule[index]);
    
  };

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto space-y-8 p-4 mb-20">
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
        handleSelectTrip={handleSelectTrip}
        hasSearched={hasSearched}
        isLoading={isLoading}
        error={error}
      />

      {/* Tickets Section */}
      {selectedTripIndex !== null && (
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">
            Your Tickets
          </h2>
          <TicketList
            selectedTrip={metrolineTripSchedule[selectedTripIndex]}
            ticketTypes={ticketTypes}
          />
        </section>
      )}
    </div>
  );
}
