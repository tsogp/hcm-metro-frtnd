"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Search,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { getAllStations } from "@/action/stations";
import { Station } from "@/types/station";

export function MetroExplorer() {
  const [expandedStations, setExpandedStations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
          <h2 className="text-xl font-bold">Metro Stations</h2>
          <p className="text-sm text-muted-foreground">
            Explore all metro stations
          </p>
        </div>
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Station List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
              {filteredStations.map((station) => (
                <Collapsible 
                  key={station.id} 
                  open={expandedStations.includes(station.id)}
                  onOpenChange={() => toggleStation(station.id)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{station.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {station.address}
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
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Coordinates:</span>
                        <span>{station.latitude}, {station.longitude}</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 