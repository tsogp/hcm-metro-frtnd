import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Map, MapPin, Train } from "lucide-react";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { formatTime } from "@/lib/utils";
import StationDetailList from "./station-detail-list";
import { Station } from "@/types/station";
import dynamic from "next/dynamic";

const DynamicStationMap = dynamic(
  () =>
    import("@/components/map/metroline-map").then((mod) => mod.MetrolineMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-muted/20 animate-pulse flex items-center justify-center">
        <Map className="size-8 text-muted-foreground" />
      </div>
    ),
  }
);

interface MetrolineDetailTabProps {
  selectedMetroLine: any;
  getStationById: (stationId: string) => any;
  toggleStation: (stationId: string) => void;
  expandedStations: string[];
}
function MetrolineDetailTab({
  selectedMetroLine,
  getStationById,
  toggleStation,
  expandedStations,
}: MetrolineDetailTabProps) {
  const getLineStationCordinates = (stationIds: string[]): Station[] => {
    return stationIds
      .map((id) => getStationById(id))
      .filter((station): station is Station => station !== undefined);
  };

  return (
    <div className="md:col-span-2 h-full">
      <Card className="border shadow-sm h-full flex flex-col">
        {selectedMetroLine ? (
          <>
            <CardHeader className="border-b px-4 py-3">
              <CardTitle className="text-lg flex items-center gap-2 font-bold">
                <Info className="h-5 w-5 text-primary" />
                {selectedMetroLine.metroLine.name} Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto z-0">
              <div className="mb-4 rounded-md border">
                <DynamicStationMap
                  stationCordinateList={getLineStationCordinates(
                    selectedMetroLine.metroLine.stationOrder
                  )}
                  height="500px"
                />
              </div>

              <StationDetailList
                selectedMetroLine={selectedMetroLine}
                getStationById={getStationById}
                toggleStation={toggleStation}
                expandedStations={expandedStations}
              />
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Train className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No line selected</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Select a metro line from the left panel to view its details.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default MetrolineDetailTab;
