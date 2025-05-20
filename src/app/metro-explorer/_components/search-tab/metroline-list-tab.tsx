import { Train } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface MetrolineListTabProps {
  filteredMetroLines: any[];
  selectedLine: string;
  setSelectedLine: (lineId: string) => void;
  searchQuery?: string;
}

function MetrolineListTab({
  filteredMetroLines,
  selectedLine,
  setSelectedLine,
  searchQuery = "",
}: MetrolineListTabProps) {
  const highlightMatch = (text: string, highlight: string, isSelected: boolean) => {
    if (!highlight?.trim()) {
      return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span 
              key={i} 
              className={`bg-yellow-200 font-bold rounded-sm ${
                isSelected ? "text-slate-800" : ""
              }`}
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  if (filteredMetroLines.length === 0) {
    return <div>No metro lines found</div>;
  }

  return (
    <div className="md:col-span-1 h-full">
      <Card className="border shadow-sm h-full flex flex-col gap-0">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2 font-bold">
            <Train className="size-6 text-primary" />
            <span className="text-lg">Metro Lines</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 flex-1 overflow-hidden flex flex-col gap-2">
          {filteredMetroLines.map((line) => {
            const isSelected = selectedLine === line.metroLine.id;
            return (
              <div
                key={line.metroLine.id}
                className={`p-3 rounded-md cursor-pointer transition-colors border-1 ${
                  isSelected
                    ? "bg-primary/95 text-primary-foreground"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedLine(line.metroLine.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isSelected
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {line.metroLine.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg truncate">
                      {highlightMatch(line.metroLine.name, searchQuery, isSelected)}
                    </div>
                    <div
                      className={`truncate text-sm ${
                        isSelected
                          ? "text-primary-foreground"
                          : "text-muted-foreground" 
                      }`}
                    >
                      Route: {highlightMatch(line.firstStation.name, searchQuery, isSelected)} → {highlightMatch(line.lastStation.name, searchQuery, isSelected)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <div
                    className={`px-3 py-1 rounded-full font-bold ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {line.metroLine.stationOrder.length} stations
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export default MetrolineListTab;
