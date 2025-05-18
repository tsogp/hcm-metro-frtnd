import { Info, MapPin, Train } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Navigation } from "lucide-react";
import React from "react";

interface StationExpandItemProps {
  stationId: string;
  getStationById: (stationId: string) => any;
  toggleStation: (stationId: string) => void;
  expandedStations: string[];
  index: number;
  selectedMetroLine: any;
}

function StationExpandItem({
  stationId,
  getStationById,
  toggleStation,
  expandedStations,
  index,
  selectedMetroLine,
}: StationExpandItemProps) {
  const station = getStationById(stationId);
  if (!station) return null;

  const isFirst = index === 0;
  const isLast = index === selectedMetroLine.metroLine.stationOrder.length - 1;
  const isStationExpanded = expandedStations.includes(stationId);

  return (
    <div className="mb-6 relative">
      <div
        className={`absolute left-0 top-2 size-5 rounded-full border-2 border-primary flex items-center justify-center z-10 ${
          isFirst || isLast ? "bg-primary" : "bg-white"
        }`}
      >
        {(isFirst || isLast) && (
          <div className="size-2 rounded-full bg-white" />
        )}
      </div>

      <div className="ml-10">
        <div
          className="flex items-center justify-between cursor-pointer hover:bg-muted/20 rounded-md pt-[6px] transition-colors"
          onClick={() => toggleStation(stationId)}
        >
          <div>
            <div className="font-bold">{station.name}</div>
            <div className="text-xs text-muted-foreground">
              {station.address}
            </div>
          </div>
          <ChevronRight
            className={`size-5 text-muted-foreground transition-transform ${
              isStationExpanded ? "rotate-90" : ""
            }`}
          />
        </div>

        {isStationExpanded && (
          <div className="py-3 pr-2 bg-muted/10 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <Train className="size-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Position
                    </div>
                    <div className="text-sm">
                      {`Station ${index + 1} of ${
                        selectedMetroLine.metroLine.stationOrder.length
                      }`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <Info className="size-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Station ID
                    </div>
                    <div className="text-sm font-mono">{station.id}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <Navigation className="size-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Coordinates
                    </div>
                    <div className="text-sm font-mono">
                      {station.latitude}, {station.longitude}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <MapPin className="size-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Address
                    </div>
                    <div className="text-sm">{station.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StationExpandItem;
