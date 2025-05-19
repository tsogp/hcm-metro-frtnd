import { Button } from "@/components/ui/button";
import { RecentSearch } from "@/types/search-ticket-form";
import { Trash2 } from "lucide-react";
import React from "react";

interface RecentSearchListProps {
  recentSearches: RecentSearch[];
  selectRecentSearch: (search: RecentSearch) => void;
  clearRecentSearches: () => void;
}

function RecentSearchList({
  recentSearches,
  selectRecentSearch,
  clearRecentSearches,
}: RecentSearchListProps) {
  return (
    <div className="pt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Searches</h3>
        <Button variant="outline" onClick={() => clearRecentSearches()}>
          <Trash2 className="size-4" />
          Clear recent searches
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
        {recentSearches.length > 0 ? (
          recentSearches.map((search) => (
            <div
              key={search.id}
              onClick={() => selectRecentSearch(search)}
              className="border rounded-lg p-3 cursor-pointer hover:bg-secondary/10 transition-colors"
            >
              <div className="font-medium text-sm">
                {search.departure} - {search.destination}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {search.departureDate} • {search.departureTime}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No recent searches
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentSearchList;
