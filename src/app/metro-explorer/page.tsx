"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, AlertTriangle, MapPin, Train, ChevronRight, ChevronLeft, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { metroLines, stations, schedules, suspensionAlerts, alertStations } from "@/data/metro-data";
import { useCartStore } from "@/store/cart-store";
import { TICKET_TYPES } from "@/components/ticket/ticket-list";
import { Station, MetroLine, AlertStation } from "@/types/metro";

// Predefined colors for metro lines
const LINE_COLORS: Record<string, string> = {
  "550e8400-e29b-41d4-a716-446655440000": "#E63946", // Line 1 - Red
  "550e8400-e29b-41d4-a716-446655440001": "#457B9D", // Line 2 - Blue
  "line3": "#2A9D8F", // Line 3 - Teal
  "line4": "#E9C46A", // Line 4 - Yellow
};

export default function MetroExplorerPage() {
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [showMap, setShowMap] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<keyof typeof TICKET_TYPES>("ONE_WAY");
  const [selectedStationForTicket, setSelectedStationForTicket] = useState<Station | null>(null);
  const [selectedLineForTicket, setSelectedLineForTicket] = useState<MetroLine | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Generate stable platform numbers for each station
  const stationPlatforms = useMemo(() => {
    const platforms: Record<string, number> = {};
    stations.forEach(station => {
      platforms[station.id] = Math.floor(Math.random() * 4) + 1;
    });
    return platforms;
  }, []); // Empty dependency array means this only runs once

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLineSchedules = (lineId: string) => {
    return schedules.filter(schedule => schedule.metro_line_id === lineId)
      .sort((a, b) => a.order - b.order);
  };

  const getLineAlerts = (lineId: string) => {
    return suspensionAlerts.filter(alert => alert.metro_line_id === lineId);
  };

  const handleLineSelect = (lineId: string) => {
    setIsLoading(true);
    setSelectedLine(lineId);
    setSelectedStation("");
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
  };

  const getLineColor = (lineId: string) => {
    return LINE_COLORS[lineId] || "#3b82f6"; // Default to blue if no color defined
  };

  const handleBuyTicket = (station: Station, line: MetroLine) => {
    setSelectedStationForTicket(station);
    setSelectedLineForTicket(line);
    setShowTicketDialog(true);
  };

  const handleConfirmTicket = () => {
    if (selectedStationForTicket && selectedLineForTicket) {
      const ticket = {
        id: `${selectedStationForTicket.id}-${selectedLineForTicket.id}-${Date.now()}`,
        name: `${selectedStationForTicket.name} Station Ticket`,
        price: getTicketPrice(selectedTicketType),
        quantity: 1,
        line: selectedLineForTicket.name,
        startStation: selectedStationForTicket.name,
        endStation: "Any Station",
        type: TICKET_TYPES[selectedTicketType],
        suspended: false
      };

      addItem(ticket);
      openCart();
      setShowTicketDialog(false);
    }
  };

  const getTicketPrice = (type: keyof typeof TICKET_TYPES): number => {
    switch (type) {
      case "ONE_WAY":
        return 2.50;
      case "DAILY":
        return 5.00;
      case "THREE_DAY":
        return 12.00;
      case "MONTHLY_STUDENT":
        return 45.00;
      case "MONTHLY_ADULT":
        return 60.00;
      case "FREE_DISABILITY":
        return 0.00;
      default:
        return 2.50;
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters Bar */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full md:w-auto">
                <Select value={selectedLine} onValueChange={handleLineSelect}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Choose a line" />
                  </SelectTrigger>
                  <SelectContent>
                    {metroLines.map((line) => (
                      <SelectItem key={line.id} value={line.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getLineColor(line.id) }}
                          />
                          {line.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search stations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
              >
                {showMap ? (
                  <>
                    <ChevronLeft className="h-4 w-4" />
                    Hide Map
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    Show Map
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Metro Map */}
          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Metro Map
                    </h2>
                  </div>
                  <div className="aspect-[2/1] bg-gray-100 rounded-lg relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">Metro Map Visualization</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Schedule and Alerts */}
          <Card className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : selectedLine ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${getLineColor(selectedLine)}20` }}
                    >
                      <Train 
                        className="h-6 w-6"
                        style={{ color: getLineColor(selectedLine) }}
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {metroLines.find(l => l.id === selectedLine)?.name}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          First Arrival: {metroLines.find(l => l.id === selectedLine)?.first_arrival}
                        </span>
                        <span className="flex items-center gap-1">
                          <Train className="h-4 w-4" />
                          Frequency: {metroLines.find(l => l.id === selectedLine)?.train_frequency}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getLineAlerts(selectedLine).length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="destructive" className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Service Alerts
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] bg-white border-2 border-red-200">
                          <div className="space-y-2">
                            {getLineAlerts(selectedLine).map((alert) => (
                              <div key={alert.id} className="text-sm">
                                <div className="font-medium text-red-600">{alert.type}</div>
                                <p className="text-red-500">{alert.description}</p>
                                <p className="text-xs text-red-400">
                                  Expected restore: {new Date(alert.expected_restore_time).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div className="space-y-4">
                  {getLineSchedules(selectedLine).map((schedule) => {
                    const station = stations.find(s => s.id === schedule.station_id);
                    const isSelected = selectedStation === schedule.station_id;
                    const stationAlerts = suspensionAlerts.filter(alert => 
                      alert.metro_line_id === selectedLine && 
                      alertStations.some((as: AlertStation) => as.alert_id === alert.id && as.station_id === schedule.station_id)
                    );
                    
                    return (
                      <motion.div
                        key={schedule.station_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-white border-gray-200'
                        }`}
                        onClick={() => handleStationSelect(schedule.station_id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${getLineColor(selectedLine)}20` }}
                          >
                            <span 
                              className="font-medium"
                              style={{ color: getLineColor(selectedLine) }}
                            >
                              {schedule.order}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{station?.name}</h3>
                              {stationAlerts.length > 0 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <AlertTriangle className="h-4 w-4 text-red-500" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[300px] bg-white border-2 border-red-200">
                                      <div className="space-y-2">
                                        {stationAlerts.map((alert) => (
                                          <div key={alert.id} className="text-sm">
                                            <div className="font-medium text-red-600">{alert.type}</div>
                                            <p className="text-red-500">{alert.description}</p>
                                            <p className="text-xs text-red-400">
                                              Expected restore: {new Date(alert.expected_restore_time).toLocaleString()}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{station?.address}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="font-medium">{schedule.arrival_time}</p>
                            <p className="text-sm text-gray-500">Platform {stationPlatforms[schedule.station_id]}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (station && selectedLine) {
                                const line = metroLines.find(l => l.id === selectedLine);
                                if (line) {
                                  handleBuyTicket(station, line);
                                }
                              }
                            }}
                            className="whitespace-nowrap"
                          >
                            Buy Ticket
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Train className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Metro Line</h3>
                <p className="text-gray-500">Choose a line from the dropdown to view its schedule</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Ticket Type Selection Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Ticket Type</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              {Object.entries(TICKET_TYPES).map(([key, type]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedTicketType === key
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTicketType(key as keyof typeof TICKET_TYPES)}
                >
                  <div>
                    <h4 className="font-medium">{type.name}</h4>
                    <p className="text-sm text-gray-500">{type.expiryInterval}</p>
                  </div>
                  <div className="text-lg font-bold">
                    {getTicketPrice(key as keyof typeof TICKET_TYPES) === 0
                      ? "FREE"
                      : `$${getTicketPrice(key as keyof typeof TICKET_TYPES).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTicketDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTicket}>
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 