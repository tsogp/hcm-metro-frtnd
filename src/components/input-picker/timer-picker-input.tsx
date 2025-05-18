"use client";

import { Clock } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect, useCallback } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimePickerProps {
  className?: string;
  time?: string;
  setTime?: (time: string) => void;
  date?: Date;
}

export function TimePicker({
  className,
  time: externalTime,
  setTime: setExternalTime,
  date: externalDate,
}: TimePickerProps) {
  const date = externalDate || new Date();

  const currentTime = format(new Date(), "HH:mm");
  const [internalTime, setInternalTime] = useState<string>(currentTime);
  const time = externalTime || internalTime;
  const setTime = setExternalTime || setInternalTime;

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleTimeSelect = (hour: string, minute: string) => {
    const newTime = `${hour}:${minute}`;
    setTime(newTime);
  };

  // Parse the current time
  const [selectedHour, selectedMinute] = time.split(":").map(String);

  const isTimeDisabled = useCallback(
    (hour: string, minute: string) => {
      if (!date) return false;

      const currentDate = new Date();
      const selectedDate = new Date(date);
      selectedDate.setHours(parseInt(hour), parseInt(minute), 0, 0);

      return selectedDate < currentDate;
    },
    [date] // Depend on date prop
  );

  // Force component to re-render when date changes
  useEffect(() => {
    // Just a dependency trigger to re-render
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full font-normal justify-between",
            !time && "text-muted-foreground",
            className
          )}
        >
          <span>{time || <span>Pick a time</span>}</span>
          <Clock className="ml-auto size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3" align="start">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Hours</div>
            <div className="text-sm font-medium">Minutes</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ScrollArea className="h-[200px] rounded-md border">
              <div className="p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    variant={hour === selectedHour ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start font-normal",
                      isTimeDisabled(hour, selectedMinute) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() =>
                      !isTimeDisabled(hour, selectedMinute) &&
                      handleTimeSelect(hour, selectedMinute)
                    }
                    disabled={isTimeDisabled(hour, selectedMinute)}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            <ScrollArea className="h-[200px] rounded-md border">
              <div className="p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    variant={minute === selectedMinute ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start font-normal",
                      isTimeDisabled(selectedHour, minute) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() =>
                      !isTimeDisabled(selectedHour, minute) &&
                      handleTimeSelect(selectedHour, minute)
                    }
                    disabled={isTimeDisabled(selectedHour, minute)}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-center">
            <div className="text-2xl font-bold">
              {selectedHour}:{selectedMinute}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}