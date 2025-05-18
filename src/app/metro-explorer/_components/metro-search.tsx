"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  ChevronDown,
  Train,
  Navigation,
  Clock,
  Search,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Find Station
          </h2>
          <p className="text-sm text-muted-foreground">
            Search for a specific station in the network
          </p>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader className="bg-muted/50 border-b px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Train className="h-5 w-5 text-primary" />
            Station Search
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="station" className="text-base">Select Station</Label>
              <Popover open={stationOpen} onOpenChange={setStationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={stationOpen}
                    className="w-full justify-between h-12 text-base"
                  >
                    <span className="truncate text-left">
                      {selectedStation
                        ? stations.find((station) => station.id === selectedStation)?.name
                        : "Search for a station..."}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Type station name..." className="h-12" />
                    <CommandEmpty>No station found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {stations.map((station) => (
                        <CommandItem
                          key={station.id}
                          value={station.name}
                          onSelect={() => {
                            setSelectedStation(station.id);
                            setStationOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="font-medium truncate text-left">{station.name}</div>
                            <div className="text-sm text-muted-foreground truncate text-left">{station.address}</div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedStation && (
              <div className="mt-6">
                <Card className="border-2">
                  <CardHeader className="bg-muted/50 border-b px-6 py-4">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Station Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {(() => {
                        const station = stations.find(s => s.id === selectedStation);
                        if (!station) return null;
                        
                        return (
                          <>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
                                <Train className="h-6 w-6" />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <h3 className="text-xl font-bold truncate text-left">{station.name}</h3>
                                <Badge variant="secondary" className="mt-1">ID: {station.id}</Badge>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="font-medium text-sm text-muted-foreground text-left">Address</div>
                                    <div className="mt-1 break-words text-left">{station.address}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                  <Navigation className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="font-medium text-sm text-muted-foreground text-left">Coordinates</div>
                                    <div className="mt-1 text-left">{station.latitude}, {station.longitude}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 