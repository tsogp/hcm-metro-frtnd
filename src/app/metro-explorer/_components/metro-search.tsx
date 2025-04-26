"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Calendar, 
  Train,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Construction
} from "lucide-react";
import { metroLines, metroRoutes, stations } from "@/data/metro-data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useCartStore } from "@/store/cart-store";

export function MetroSearch() {
  const router = useRouter();
  const { openCart } = useCartStore();
  const [fromStation, setFromStation] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [expandedRoutes, setExpandedRoutes] = useState<string[]>([]);

  const toggleRoute = (routeId: string) => {
    setExpandedRoutes(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId) 
        : [...prev, routeId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "maintenance":
        return <Construction className="h-4 w-4 text-amber-500" />;
      case "planned":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleSearch = () => {
    if (!fromStation || !toStation) return;

    const results = metroRoutes.filter(route => 
      route.fromStation === fromStation && route.toStation === toStation
    );

    setSearchResults(results);
  };

  const handleBuyTicket = (routeId: string) => {
    const route = metroRoutes.find(r => r.id === routeId);
    if (route) {
      openCart();
      router.push(`/payment?from=${route.fromStation}&to=${route.toStation}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Metro Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Popover open={fromOpen} onOpenChange={setFromOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={fromOpen}
                    className="w-full justify-between"
                  >
                    {fromStation
                      ? stations.find((station) => station.id === fromStation)?.name
                      : "Select departure station"}
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
                            setFromStation(station.id);
                            setFromOpen(false);
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          {station.name}
                          {station.isTransferStation && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Transfer
                            </Badge>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Popover open={toOpen} onOpenChange={setToOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={toOpen}
                    className="w-full justify-between"
                  >
                    {toStation
                      ? stations.find((station) => station.id === toStation)?.name
                      : "Select destination station"}
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
                            setToStation(station.id);
                            setToOpen(false);
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          {station.name}
                          {station.isTransferStation && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Transfer
                            </Badge>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      if (date) {
                        setDate(date);
                        setDateOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleSearch}
            disabled={!fromStation || !toStation}
          >
            <Search className="mr-2 h-4 w-4" />
            Search Routes
          </Button>
        </CardContent>
      </Card>
      
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((route) => {
                const fromStationData = stations.find(s => s.id === route.fromStation);
                const toStationData = stations.find(s => s.id === route.toStation);
                const line = metroLines.find(l => l.id === route.lineId);
                const isExpanded = expandedRoutes.includes(route.id);
                
                return (
                  <Card key={route.id} className="overflow-hidden">
                    <div 
                      className="h-2" 
                      style={{ backgroundColor: line?.color }}
                    />
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: line?.color }}
                            />
                            <span className="font-medium">{line?.name}</span>
                            {line && getStatusIcon(line.status)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{fromStationData?.name}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{toStationData?.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{route.duration} min</span>
                            <span>•</span>
                            <span>{route.distance} km</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-lg font-bold">
                            {formatCurrency(route.price)}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleRoute(route.id)}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="mr-2 h-4 w-4" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="mr-2 h-4 w-4" />
                                  Show Details
                                </>
                              )}
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleBuyTicket(route.id)}
                            >
                              Buy Ticket
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Collapsible open={isExpanded}>
                        <CollapsibleContent className="pt-4">
                          <Separator className="mb-4" />
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium mb-2">Route Details</h3>
                              <div className="space-y-2">
                                {route.stops.map((stopId: string, index: number) => {
                                  const stop = stations.find(s => s.id === stopId);
                                  const isTransfer = stop?.isTransferStation;
                                  
                                  return (
                                    <div key={stopId} className="flex items-start gap-2">
                                      <div className="flex flex-col items-center pt-1">
                                        <div 
                                          className="w-2 h-2 rounded-full" 
                                          style={{ backgroundColor: line?.color }}
                                        />
                                        {index < route.stops.length - 1 && (
                                          <div 
                                            className="w-0.5 h-6" 
                                            style={{ backgroundColor: line?.color }}
                                          />
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">{stop?.name}</div>
                                        {isTransfer && (
                                          <div className="text-xs text-muted-foreground">
                                            Transfer Station
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium mb-2">Schedule</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Departure</div>
                                  <div className="font-medium">08:00</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Arrival</div>
                                  <div className="font-medium">08:25</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {searchResults.length === 0 && fromStation && toStation && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">No routes found</h3>
              <p className="text-muted-foreground">
                Try searching for a different route or check if there are any service disruptions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 