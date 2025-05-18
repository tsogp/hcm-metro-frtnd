"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Train, AlertCircle } from "lucide-react";
import { getAllStations } from "@/action/stations";
import { getAllMetrolines } from "@/action/metroline";
import type { Station } from "@/types/station";
import type { MetroLine } from "@/types/metroline";
import { Skeleton } from "@/components/ui/skeleton";

import MetrolineListTab from "./search-tab/metroline-list-tab";
import MetrolineDetailTab from "./details-tab/metroline-detail-tab";

interface MetroExplorerProps {
  searchQuery?: string;
}

export function MetroExplorer({ searchQuery = "" }: MetroExplorerProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [metroLines, setMetroLines] = useState<MetroLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [expandedStations, setExpandedStations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsData, metroLinesData] = await Promise.all([
          getAllStations(),
          getAllMetrolines(),
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
  }, [selectedLine]);

  const toggleStation = (stationId: string) => {
    setExpandedStations((prev) =>
      prev.includes(stationId)
        ? prev.filter((id) => id !== stationId)
        : [...prev, stationId]
    );
  };

  const getStationById = (stationId: string) => {
    return stations.find((station) => station.id === stationId);
  };

  const getFilteredMetroLines = () => {
    if (!localSearch) return metroLines;

    return metroLines.filter((line) => {
      if (
        line.metroLine.name.toLowerCase().includes(localSearch.toLowerCase())
      ) {
        return true;
      }

      // Only search in first and last station names
      const firstStationId = line.metroLine.stationOrder[0];
      const lastStationId =
        line.metroLine.stationOrder[line.metroLine.stationOrder.length - 1];

      const firstStation = getStationById(firstStationId);
      const lastStation = getStationById(lastStationId);

      const firstStationMatch = firstStation?.name
        .toLowerCase()
        .includes(localSearch.toLowerCase());

      const lastStationMatch = lastStation?.name
        .toLowerCase()
        .includes(localSearch.toLowerCase());

      return firstStationMatch || lastStationMatch;
    });
  };

  const filteredMetroLines = getFilteredMetroLines();
  const selectedMetroLine = metroLines.find(
    (line) => line.metroLine.id === selectedLine
  );

  if (filteredMetroLines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] p-6 bg-muted/20 rounded-lg border">
        <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Train className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No metro lines found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          No metro lines match your search criteria. Try adjusting your search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <MetrolineListTab
        filteredMetroLines={filteredMetroLines}
        selectedLine={selectedLine || ""}
        setSelectedLine={setSelectedLine}
      />

      <MetrolineDetailTab
        selectedMetroLine={selectedMetroLine}
        getStationById={getStationById}
        toggleStation={toggleStation}
        expandedStations={expandedStations}
      />
    </div>
  );
}
