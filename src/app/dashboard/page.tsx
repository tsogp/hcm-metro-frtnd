"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TicketList } from "@/app/dashboard/_components/ticket/ticket-list";
import SearchForm from "@/app/dashboard/_components/search-ticket-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { MetrolineStationSchedule } from "@/types/metroline";

import { getAllTicketTypes, TicketType } from "@/action/ticket-type";
import { getMetrolineStationsSchedule } from "@/action/schedule-trip";
import ScheduleTripList from "@/app/dashboard/_components/schedule/schedule-trip-list";
import { useUserStore } from "@/store/user-store";
import { BookNowCarousel } from "./_components/BookNowCarousel";
import { UserFeedback } from './_components/UserFeedback';
import { NearestStations } from './_components/NearestStations';
import { ActiveMetrolines } from './_components/ActiveMetrolines';

export default function Dashboard() {
  const { currentUser, checkAuth } = useUserStore();
  const [metrolineTripSchedule, setMetrolineTripSchedule] = useState<
    MetrolineStationSchedule[]
  >([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      await checkAuth();
    };
    initializeUser();
  }, [checkAuth]);

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

          return "No available trips found for next 60 minutes";
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Book Now Carousel Section - Full Width */}
      <div className="w-full">
        <BookNowCarousel />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <section className="mt-10">
          <SearchForm onSearch={handleSearch} />
        </section>

        {/* Nearest Stations Section */}
        <div className="mt-8">
        <NearestStations />
      </div>

        {/* Active Metro Lines Section */}
        <div className="mt-8">
        <ActiveMetrolines />
      </div>
        {/* User Feedback Section */}
        <UserFeedback className="mt-26 mb-10" />

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
          <section className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">
              Your Tickets
            </h2>
            <TicketList selectedTrip={metrolineTripSchedule[selectedTripIndex]} />
          </section>
        )}
      </div>
    </div>
  );
}
