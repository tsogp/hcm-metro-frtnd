"use client";

import * as React from "react";
import {
  format,
  formatDate,
  getMonth,
  getYear,
  parseISO,
  setMonth,
  setYear,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface DatePickerProps {
  className?: string;
  startYear?: number;
  endYear?: number;
  date?: Date;
  setDate?: (date: Date) => void;
  dateRestriction?: "past" | "future" | "none";
}

export function DatePicker({
  className,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  date: externalDate,
  setDate: setExternalDate,
  dateRestriction = "none",
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    undefined
  );

  // Use external date if provided, otherwise use internal state
  const date = externalDate ?? internalDate;
  const setDate = setExternalDate || setInternalDate;

  const currentDate = new Date();
  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate);
  const currentDay = currentDate.getDate();

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  ).filter((year) => {
    if (dateRestriction === "past") return year >= currentYear;
    if (dateRestriction === "future") return year <= currentYear;
    return true;
  });

  const isPastDate = (selectedDate: Date) => {
    if (dateRestriction === "none") return false;

    const year = getYear(selectedDate);
    const month = getMonth(selectedDate);
    const day = selectedDate.getDate();

    if (dateRestriction === "past") {
      return (
        year < currentYear ||
        (year === currentYear && month < currentMonth) ||
        (year === currentYear && month === currentMonth && day < currentDay)
      );
    } else if (dateRestriction === "future") {
      return (
        year > currentYear ||
        (year === currentYear && month > currentMonth) ||
        (year === currentYear && month === currentMonth && day > currentDay)
      );
    }

    return false;
  };

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    if (!isPastDate(newDate)) {
      setDate(newDate);
    }
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year));
    if (!isPastDate(newDate)) {
      setDate(newDate);
    }
  };

  const handleSelect = (selectedData: Date | undefined) => {
    // console.log("selectedData", selectedData);
    if (selectedData && !isPastDate(selectedData)) {
      setDate(selectedData);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          {/* {JSON.stringify(date)} */}
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={date ? months[getMonth(date)] : undefined}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={date ? getYear(date).toString() : undefined}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={date ?? currentDate}
          onMonthChange={setDate}
          disabled={isPastDate}
        />
      </PopoverContent>
    </Popover>
  );
}
