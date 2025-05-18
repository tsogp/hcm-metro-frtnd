"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Search,
  Train,
  Clock,
  Navigation,
  ChevronRight,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { getAllStations } from "@/action/stations";
import { getAllMetrolines } from "@/action/metroline";
import { Station } from "@/types/station";
import { MetroLine } from "@/types/metroline";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const LINE_COLORS: { [key: string]: string } = {
  "550e8400-e29b-41d4-a716-446655440000": "#E30613", // Red
  "550e8400-e29b-41d4-a716-446655440001": "#0098D4", // Blue
  "line3": "#F9A01B", // Yellow
  "line4": "#00AEEF", // Light Blue
};

export function MetroExplorer() {
  const [expandedStations, setExpandedStations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [metroLines, setMetroLines] = useState<MetroLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsData, metroLinesData] = await Promise.all([
          getAllStations(),
          getAllMetrolines()
        ]);
        setStations(stationsData);
        setMetroLines(metroLinesData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleStation = (stationId: string) => {
    setExpandedStations(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId) 
        : [...prev, stationId]
    );
  };

  const getStationLines = (stationId: string) => {
    return metroLines.filter(line => 
      line.metroLine.stationOrder.includes(stationId)
    );
  };

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Train className="h-6 w-6 text-primary" />
            Metro Stations
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore all metro stations in the network
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      <Card className="border-2 overflow-hidden">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Station Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {filteredStations.map((station, index) => {
                const stationLines = getStationLines(station.id);
                return (
                  <Collapsible 
                    key={station.id} 
                    open={expandedStations.includes(station.id)}
                    onOpenChange={() => toggleStation(station.id)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-semibold text-lg truncate text-left">{station.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 text-left">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate text-left">{station.address}</span>
                          </div>
                          {stationLines.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {stationLines.map(line => (
                                <Badge 
                                  key={line.metroLine.id}
                                  className="text-xs"
                                  style={{ 
                                    backgroundColor: LINE_COLORS[line.metroLine.id] || '#666',
                                    color: 'white'
                                  }}
                                >
                                  {line.metroLine.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${expandedStations.includes(station.id) ? 'rotate-90' : ''}`} />
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-6 py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
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
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Train className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0 text-left">
                                <div className="font-medium text-sm text-muted-foreground text-left">Serving Lines</div>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {stationLines.map(line => (
                                    <Badge 
                                      key={line.metroLine.id}
                                      className="text-xs"
                                      style={{ 
                                        backgroundColor: LINE_COLORS[line.metroLine.id] || '#666',
                                        color: 'white'
                                      }}
                                    >
                                      {line.metroLine.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0 text-left">
                                <div className="font-medium text-sm text-muted-foreground text-left">Station ID</div>
                                <div className="mt-1 text-left">
                                  <Badge variant="secondary">{station.id}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 