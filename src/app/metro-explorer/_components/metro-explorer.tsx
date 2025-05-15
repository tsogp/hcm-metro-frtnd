"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Train, 
  MapPin, 
  Clock, 
  Info, 
  Search,
  Navigation,
  AlertTriangle
} from "lucide-react";
import { metroLines, stations, schedules, suspensionAlerts } from "@/data/metro-data";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

export function MetroExplorer() {
  const [selectedLine, setSelectedLine] = useState<string | null>(metroLines[0].id);
  const [expandedStations, setExpandedStations] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const toggleStation = (stationId: string) => {
    setExpandedStations(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId) 
        : [...prev, stationId]
    );
  };

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLineAlerts = (lineId: string) => {
    return suspensionAlerts.filter(alert => alert.metro_line_id === lineId);
  };

  const getLineSchedules = (lineId: string) => {
    return schedules.filter(schedule => schedule.metro_line_id === lineId)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Metro Network</h2>
          <p className="text-sm text-muted-foreground">
            Explore stations and schedules
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
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
      </div>
      
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5" />
              Metro Lines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metroLines.map((line) => {
                const lineSchedules = getLineSchedules(line.id);
                const lineAlerts = getLineAlerts(line.id);
                
                return (
                  <div key={line.id} className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{line.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {line.train_frequency} frequency
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          First Arrival: {line.first_arrival} | Total Duration: {line.total_duration}
                        </span>
                      </div>
                      
                      {lineAlerts.length > 0 && (
                        <div className="mt-2">
                          {lineAlerts.map(alert => (
                            <div key={alert.id} className="flex items-start gap-2 p-2 bg-destructive/10 rounded-md">
                              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                              <div>
                                <div className="font-medium text-destructive">{alert.type}</div>
                                <div className="text-sm text-muted-foreground">{alert.description}</div>
                                <div className="text-xs text-muted-foreground">
                                  Expected restore: {alert.expected_restore_time}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium mb-4">Stations & Schedule</h3>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-2">
                            {lineSchedules.map((schedule, index) => {
                              const station = stations.find(s => s.id === schedule.station_id);
                              if (!station) return null;
                              
                              return (
                                <Collapsible 
                                  key={schedule.station_id} 
                                  open={expandedStations.includes(schedule.station_id)}
                                  onOpenChange={() => toggleStation(schedule.station_id)}
                                >
                                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-md hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full mb-1 bg-primary" />
                                        {index < lineSchedules.length - 1 && (
                                          <div className="w-0.5 h-6 bg-primary" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium">{station.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          Arrival: {schedule.arrival_time}
                                        </div>
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent className="pl-8 pr-2 py-2">
                                    <div className="space-y-3 text-sm">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{station.address}</span>
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Quick Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Schedule Information</h3>
                <div className="space-y-2">
                  {metroLines.map((line) => (
                    <div key={line.id} className="flex items-center justify-between text-sm">
                      <span>{line.name}</span>
                      <span className="text-muted-foreground">
                        First: {line.first_arrival} | Every: {line.train_frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 