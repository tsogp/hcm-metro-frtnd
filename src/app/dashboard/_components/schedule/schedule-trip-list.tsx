"use client";

import { MetrolineStationSchedule } from "@/types/metroline";
import ScheduleTripItem from "./schedule-trip-item";

interface ScheduleTripListProps {
  metrolineTripSchedule: MetrolineStationSchedule[];
  // handleSelectTrip: (index: number) => void;
  hasSearched: boolean;
  isLoading: boolean;
  error: string | null;
}

function ScheduleTripList({
  metrolineTripSchedule,
  // handleSelectTrip,
  hasSearched,
  isLoading,
  error,
}: ScheduleTripListProps) {
  return (
    <>
      {hasSearched && (
        <section>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              <h3 className="font-medium">Error</h3>
              <p>{error}</p>
            </div>
          ) : metrolineTripSchedule.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">
                Available Trips
              </h2>
              <div className="space-y-2">
                {metrolineTripSchedule.map((trip, index) => (
                  <ScheduleTripItem
                    key={index}
                    trip={trip}
                    index={index}
                    // handleSelectTrip={handleSelectTrip}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
              <h3 className="font-medium">No trips found</h3>
              <p>
                No available trips were found for your search criteria. Please
                try different stations or times.
              </p>
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default ScheduleTripList;
