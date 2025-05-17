"use client";

import { MetroExplorer } from "./_components/metro-explorer";
import { MetroSearch } from "./_components/metro-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MetroExplorerPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs defaultValue="explorer" className="space-y-6">
        <TabsList>
          <TabsTrigger value="explorer">All Stations</TabsTrigger>
          <TabsTrigger value="search">Find Station</TabsTrigger>
        </TabsList>
        <TabsContent value="explorer">
          <MetroExplorer />
        </TabsContent>
        <TabsContent value="search">
          <MetroSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
}
