"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  ChevronDown,
} from "lucide-react";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { getAllStations } from "@/action/stations";
import { Station } from "@/types/station";

export function MetroSearch() {
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [stationOpen, setStationOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getAllStations();
        setStations(data);
      } catch (err) {
        setError("Failed to load stations. Please try again later.");
        console.error("Error fetching stations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading stations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center text-destructive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Find Station</h2>
          <p className="text-sm text-muted-foreground">
            Search for a specific station
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label htmlFor="station">Select Station</Label>
            <Popover open={stationOpen} onOpenChange={setStationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={stationOpen}
                  className="w-full justify-between"
                >
                  {selectedStation
                    ? stations.find((station) => station.id === selectedStation)?.name
                    : "Select a station"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search stations..." />
                  <CommandEmpty>No station found.</CommandEmpty>
                  <CommandGroup>
                    {stations.map((station) => (
                      <CommandItem
                        key={station.id}
                        value={station.name}
                        onSelect={() => {
                          setSelectedStation(station.id);
                          setStationOpen(false);
                        }}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {station.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedStation && (
            <div className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Station Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const station = stations.find(s => s.id === selectedStation);
                      if (!station) return null;
                      
                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{station.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {station.address}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Coordinates: </span>
                            <span>{station.latitude}, {station.longitude}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 