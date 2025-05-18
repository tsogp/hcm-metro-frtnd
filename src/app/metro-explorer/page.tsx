"use client";

import { useState } from "react";
import { MetroExplorer } from "./_components/metro-explorer";
import { Input } from "@/components/ui/input";
import { Search, Train } from "lucide-react";

export default function MetroExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Train className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Metro Network Explorer</h1>
              <p className="text-sm text-muted-foreground">
                Explore metro lines and stations
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-120">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search metro lines or start/end stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </div>
        <MetroExplorer searchQuery={searchQuery} />
      </div>
    </div>
  );
}
