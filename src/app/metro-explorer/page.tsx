"use client";

import { useState } from "react";
import {
  TrainFront,
  Map,
  Search,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/common/app-header";
import { UserDropdownMenu } from "@/components/common/user-dropdown-menu";
import { MetroExplorer } from "./_components/metro-explorer";
import { MetroSearch } from "./_components/metro-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { metroLines, metroRoutes, stations } from "@/data/metro-data";
import { formatCurrency } from "@/lib/utils";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useCartStore } from "@/store/cart-store";

export default function MetroExplorerPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const { isOpen, openCart, closeCart } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader onCartClick={openCart} />
      <CartSheet
        open={isOpen}
        onOpenChange={(open) => (open ? openCart() : closeCart())}
      />

      <div className="flex-1 container mx-auto py-8 px-4">
        <Tabs
          defaultValue="explore"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
          <TabsContent value="explore">
            <MetroExplorer />
          </TabsContent>
          <TabsContent value="search">
            <MetroSearch />
          </TabsContent>
          <TabsContent value="schedule">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Metro Schedule</h2>
              <p className="text-muted-foreground mb-6">
                View the complete schedule for all metro lines
              </p>
              <Button>View Full Schedule</Button>
            </div>
          </TabsContent>
          <TabsContent value="status">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Service Status</h2>
              <p className="text-muted-foreground mb-6">
                Check the current status of all metro lines
              </p>
              <Button>View Service Status</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
