import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import React from "react";
import {
  CircleDot,
  MapPinCheckInside,
  MapPinned,
  MapPinHouse,
  TrainFront,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { MetrolineStationSchedule } from "@/types/metroline";

interface ScheduleTripItemProps {
  trip: MetrolineStationSchedule;
  index: number;
  // handleSelectTrip: (index: number) => void;
}

function ScheduleTripItem({
  trip,
  index,
  // handleSelectTrip,
}: ScheduleTripItemProps) {
  const firstStation = trip.schedules[0];
  const lastStation = trip.schedules[trip.schedules.length - 1];

  return (
    <Card
      key={index}
      className="overflow-hidden hover:shadow-md transition-all"
    >
      <CardContent>
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold ">
                {formatTime(firstStation.arrivedAt)}
              </span>
              <CircleDot className="size-6 fill-green-700 stroke-background" />
            </div>

            <span className="text-lg font-medium">
              {firstStation.stationName}
            </span>
          </div>

          <div className="relative flex-1 flex flex-col items-center px-4 pt-4">
            <Button
              variant="link"
              className="text-xl -mt-4 -mb-4 z-10 bg-background font-bold text-primary"
            >
              {formatDuration(trip.totalArrivalDuration)}
            </Button>
            <div className="w-full h-[1px] bg-muted relative">
              <div className="absolute left-0 right-0 border-t border-dashed border-muted-foreground"></div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-end items-center gap-2">
              <MapPinCheckInside className="size-6 fill-background stroke-primary" />
              <span className="text-3xl font-bold">
                {formatTime(lastStation.arrivedAt)}
              </span>
            </div>

            <span className="text-lg font-medium text-right">
              {lastStation.stationName}
            </span>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="mt-6 space-y-3 ">
          <div className="flex items-center gap-2">
            <TrainFront className="size-5 text-muted-foreground shrink-0" />
            <span className="text-md font-medium text-muted-foreground min-w-28">
              Metro Line
            </span>
            <p className="text-base font-bold">{firstStation.metroLineName}</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPinHouse className="size-5 text-muted-foreground shrink-0" />
            <span className="text-md font-medium text-muted-foreground min-w-28">
              Start Station
            </span>
            <p className="text-base">{firstStation.stationAddress}</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPinned className="size-5 text-muted-foreground shrink-0" />
            <span className="text-md font-medium text-muted-foreground min-w-28">
              End Station
            </span>
            <p className="text-base">{lastStation.stationAddress}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-center bg-muted/20">
        <Button
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full"
          // onClick={() => handleSelectTrip(index)}
        >
          Select Trip
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ScheduleTripItem;
