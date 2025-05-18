import { MapPin } from "lucide-react";
import StationExpandItem from "./station-expand-item";

interface StationDetailListProps {
  selectedMetroLine: any;
  getStationById: (stationId: string) => any;
  toggleStation: (stationId: string) => void;
  expandedStations: string[];
}
function StationDetailList({
  selectedMetroLine,
  getStationById,
  toggleStation,
  expandedStations,
}: StationDetailListProps) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <MapPin className="size-5 text-primary" />
        Stations ({selectedMetroLine.metroLine.stationOrder.length})
      </h3>

      <div className="relative">
        <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-primary/30 z-0"></div>

        {selectedMetroLine.metroLine.stationOrder.map(
          (stationId: string, index: number) => (
            <StationExpandItem
              key={stationId}
              stationId={stationId}
              getStationById={getStationById}
              toggleStation={toggleStation}
              expandedStations={expandedStations}
              index={index}
              selectedMetroLine={selectedMetroLine}
            />
          )
        )}
      </div>
    </div>
  );
}

export default StationDetailList;
