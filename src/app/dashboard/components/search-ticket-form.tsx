"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format, getYear } from "date-fns";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DatePicker } from "../../../components/input/date-picker-input";
import { TimePicker } from "../../../components/input/timer-picker.input";
import {
  RecentSearch,
  SearchTicketFormValues,
} from "@/types/search-ticket-form";
import RecentSearchList from "./recent-search-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchFormSchema } from "@/schemas/search-ticket-form";

// Types for our form

// Types for our location data
type Location = {
  id: string;
  name: string;
};

// Mock data
const MOCK_LOCATIONS: Location[] = [
  { id: "hcm", name: "TP. Hồ Chí Minh" },
  { id: "dl", name: "Đà Lạt" },
  { id: "ag", name: "An Giang" },
  { id: "br", name: "Bà Rịa" },
  { id: "vt", name: "Vũng Tàu" },
  { id: "hn", name: "Hà Nội" },
  { id: "dn", name: "Đà Nẵng" },
];

export default function SearchForm() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize form with react-hook-form
  const form = useForm<SearchTicketFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      departure: "",
      destination: "",
      departureDate: new Date(),
      departureTime: format(new Date(), "HH:mm"),
    },
  });

  // Fetch locations from server (simulated)
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a fetch to your API
        // await fetch('/api/locations')

        // Simulating API response
        setTimeout(() => {
          setLocations(MOCK_LOCATIONS);

          // Set default values after data is loaded
          form.setValue("departure", "");
          form.setValue("destination", "");

          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setIsLoading(false);
      }
    };

    const loadRecentSearches = () => {
      try {
        const savedSearches = localStorage.getItem("recentSearches");
        if (savedSearches) {
          const parsedSearches = JSON.parse(savedSearches) as RecentSearch[];

          const sortedSearches = parsedSearches.sort(
            (a, b) => b.createdAt - a.createdAt
          );
          // Get only the 4 most recent searches
          setRecentSearches(sortedSearches.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load recent searches:", error);
      }
    };

    fetchLocations();
    loadRecentSearches();
  }, [form]);

  // Handle swapping departure and destination
  const swapLocations = () => {
    const departure = form.getValues("departure");
    const destination = form.getValues("destination");
    form.setValue("departure", destination);
    form.setValue("destination", departure);
  };

  const selectRecentSearch = (search: RecentSearch) => {
    // Find the location IDs based on names
    const departureId =
      locations.find((loc) => loc.name === search.departure)?.id || "";
    const destinationId =
      locations.find((loc) => loc.name === search.destination)?.id || "";

    form.setValue("departure", departureId);
    form.setValue("destination", destinationId);

    // Parse the date
    const [day, month, year] = search.departureDate.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    form.setValue("departureDate", date);

    // Set the time
    form.setValue("departureTime", search.departureTime);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  const onSubmit = (data: SearchTicketFormValues) => {
    console.log(data);

    const existingSearchesJSON = localStorage.getItem("recentSearches");
    let existingSearches: RecentSearch[] = [];

    if (existingSearchesJSON) {
      try {
        existingSearches = JSON.parse(existingSearchesJSON);
      } catch (error) {
        console.error("Error parsing recent searches:", error);
      }
    }

    const updatedSearches = [
      {
        id: Date.now().toString(),
        departure:
          locations.find((loc) => loc.id === data.departure)?.name || "",
        destination:
          locations.find((loc) => loc.id === data.destination)?.name || "",
        departureDate: format(new Date(data.departureDate), "dd/MM/yyyy"),
        departureTime: data.departureTime,
        createdAt: Date.now(),
      },
      ...existingSearches,
    ];
    const limitedSearches = updatedSearches.slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(limitedSearches));

    setRecentSearches(limitedSearches.slice(0, 4));
  };

  return (
    <Card className="border-2 rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">
            Search ticket for your trip
          </h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 w-full flex-1 relative">
                {/* Departure Location */}
                <FormField
                  control={form.control}
                  name="departure"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel className="font-medium">Departure</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="!h-12 w-full">
                              <SelectValue placeholder="Select your departure" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-[66%] right-[50%] -translate-y-1/2 translate-x-1/2 z-10 rounded-full size-10"
                  onClick={swapLocations}
                >
                  <ArrowLeftRight className="size-4" />
                </Button>

                {/* Destination Location */}
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel className="font-medium">Destination</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="!h-12 w-full">
                              <SelectValue placeholder="Select your destination" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-2 w-full flex-1">
                {/* Departure Date */}
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel className="font-medium">Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          className="h-12"
                          date={field.value ? new Date(field.value) : undefined}
                          setDate={(date) => {
                            const isoDate = format(date, "yyyy-MM-dd");
                            form.setValue("departureDate", new Date(isoDate));
                            field.onChange(isoDate);
                          }}
                          startYear={getYear(new Date())}
                          dateRestriction="past"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Departure Time */}
                <FormField
                  control={form.control}
                  name="departureTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel className="font-medium">Time</FormLabel>
                      <FormControl>
                        <TimePicker
                          className="h-12"
                          time={field.value}
                          setTime={(time) => field.onChange(time)}
                          date={
                            form.getValues("departureDate")
                              ? new Date(form.getValues("departureDate"))
                              : undefined
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <RecentSearchList
          recentSearches={recentSearches}
          selectRecentSearch={selectRecentSearch}
          clearRecentSearches={clearRecentSearches}
        />
      </CardContent>

      <CardFooter className="relative flex lg:justify-end justify-center">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          className="absolute top-1/2 border-2 shadow-sm bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-6 rounded-full text-base"
        >
          Search available trips
        </Button>
      </CardFooter>
    </Card>
  );
}
