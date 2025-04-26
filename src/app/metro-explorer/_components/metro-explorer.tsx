"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Train, 
  MapPin, 
  Clock, 
  Info, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Construction,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building2,
  Wifi,
  ParkingCircle,
  Bus,
  Ticket,
  Navigation
} from "lucide-react";
import { metroLines, stations } from "@/data/metro-data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

export function MetroExplorer() {
  const [selectedLine, setSelectedLine] = useState<string | null>(metroLines[0].id);
  const [expandedStations, setExpandedStations] = useState<string[]>([]);
  const [showStationDetails, setShowStationDetails] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const router = useRouter();
  const { addItem, openCart } = useCartStore();

  const toggleStation = (stationId: string) => {
    setExpandedStations(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId) 
        : [...prev, stationId]
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
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "maintenance":
        return "Maintenance";
      case "planned":
        return "Planned";
      default:
        return "Unknown";
    }
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility) {
      case "elevator":
        return <Building2 className="h-4 w-4" />;
      case "escalator":
        return <Building2 className="h-4 w-4" />;
      case "restroom":
        return <Building2 className="h-4 w-4" />;
      case "ticket-counter":
        return <Ticket className="h-4 w-4" />;
      case "information-desk":
        return <Info className="h-4 w-4" />;
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "parking":
        return <ParkingCircle className="h-4 w-4" />;
      case "bus-connection":
        return <Bus className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const handleBuyTicket = (fromStation: string, toStation: string) => {
    const fromStationData = stations.find(s => s.id === fromStation);
    const toStationData = stations.find(s => s.id === toStation);
    const line = metroLines.find(l => l.id === selectedLine);
    
    if (fromStationData && toStationData && line) {
      // Create a ticket item
      const ticketItem = {
        id: `ticket-${fromStation}-${toStation}-${Date.now()}`,
        name: `${fromStationData.name} → ${toStationData.name}`,
        price: 5.00, // Default price, could be calculated based on distance
        quantity: 1,
        line: line.name,
        startStation: fromStationData.name,
        endStation: toStationData.name,
        type: {
          name: "Single Trip",
          expiryInterval: "24 hours"
        },
        suspended: false
      };
      
      // Add to cart and open the cart
      addItem(ticketItem);
      openCart();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Metro Lines</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2"
        >
          <Navigation className="h-4 w-4" />
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>
      
      {showMap && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-[300px] bg-muted">
              {/* Placeholder for Map API */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4">
                  <Navigation className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Map API will be implemented here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5" />
            Metro Lines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={metroLines[0].id} onValueChange={setSelectedLine}>
            <TabsList className="grid grid-cols-4 mb-4 h-auto p-1 gap-2">
              {metroLines.map((line) => (
                <TabsTrigger 
                  key={line.id} 
                  value={line.id}
                  className="flex items-center gap-2 py-3 text-base h-auto"
                >
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: line.color }}
                  />
                  {line.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {metroLines.map((line) => (
              <TabsContent key={line.id} value={line.id} className="mt-0">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 mt-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(line.status)}
                      <span className="text-sm font-medium">
                        {getStatusText(line.status)}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs w-fit">
                      {line.frequency} min frequency
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {line.operatingHours.start} - {line.operatingHours.end}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Stations</h3>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {line.stations.map((station, index) => (
                          <Collapsible 
                            key={station.id} 
                            open={expandedStations.includes(station.id)}
                            onOpenChange={() => toggleStation(station.id)}
                          >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col items-center">
                                  <div 
                                    className="w-2 h-2 rounded-full mb-1" 
                                    style={{ backgroundColor: line.color }}
                                  />
                                  {index < line.stations.length - 1 && (
                                    <div 
                                      className="w-0.5 h-6" 
                                      style={{ backgroundColor: line.color }}
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{station.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {station.isTransferStation && "Transfer Station"}
                                  </div>
                                </div>
                              </div>
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-8 pr-2 py-2">
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>Code: {station.code}</span>
                                </div>
                                <div>
                                  <div className="font-medium mb-1">Facilities:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {station.facilities.map((facility) => (
                                      <Badge key={facility} variant="secondary" className="text-xs">
                                        {facility.replace("-", " ")}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                {station.isTransferStation && station.transferLines && (
                                  <div>
                                    <div className="font-medium mb-1">Transfer to:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {station.transferLines.map((lineId) => {
                                        const transferLine = metroLines.find(l => l.id === lineId);
                                        return (
                                          <Badge 
                                            key={lineId} 
                                            variant="outline" 
                                            className="text-xs"
                                            style={{ 
                                              borderColor: transferLine?.color,
                                              color: transferLine?.color
                                            }}
                                          >
                                            {transferLine?.name}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedLine && (
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => setShowStationDetails(!showStationDetails)}>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Station Details
              </CardTitle>
              {showStationDetails ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {showStationDetails && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metroLines
                  .find(line => line.id === selectedLine)
                  ?.stations.map((station) => (
                    <Card key={station.id} className="overflow-hidden border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ 
                                backgroundColor: metroLines.find(line => line.id === selectedLine)?.color 
                              }}
                            />
                            <h3 className="font-medium text-lg">{station.name}</h3>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {station.code}
                          </Badge>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">
                              {station.coordinates.lat.toFixed(4)}, {station.coordinates.lng.toFixed(4)}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Facilities</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {station.facilities.map((facility) => (
                                <div key={facility} className="flex items-center gap-2 text-sm">
                                  {getFacilityIcon(facility)}
                                  <span className="capitalize">{facility.replace("-", " ")}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {station.isTransferStation && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Transfer Options</h4>
                              <div className="space-y-2">
                                {station.transferLines?.map((lineId) => {
                                  const transferLine = metroLines.find(l => l.id === lineId);
                                  const transferStations = transferLine?.stations.filter(
                                    s => s.id !== station.id
                                  );
                                  
                                  return (
                                    <div key={lineId} className="border rounded-md p-2">
                                      <div 
                                        className="flex items-center gap-2 font-medium mb-1"
                                        style={{ color: transferLine?.color }}
                                      >
                                        <div 
                                          className="w-3 h-3 rounded-full" 
                                          style={{ backgroundColor: transferLine?.color }}
                                        />
                                        <span>{transferLine?.name}</span>
                                      </div>
                                      <div className="pl-5 space-y-1">
                                        {transferStations?.slice(0, 3).map(s => (
                                          <div 
                                            key={s.id} 
                                            className="flex items-center justify-between text-sm"
                                          >
                                            <span>{s.name}</span>
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="h-6 px-2"
                                              onClick={() => handleBuyTicket(station.id, s.id)}
                                            >
                                              <Ticket className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ))}
                                        {transferStations && transferStations.length > 3 && (
                                          <div className="text-xs text-muted-foreground pl-1">
                                            +{transferStations.length - 3} more stations
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <Button 
                              className="w-full"
                              onClick={() => handleBuyTicket(station.id, station.id)}
                            >
                              Buy Ticket from this Station
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
} 