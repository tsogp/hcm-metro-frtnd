'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Train, Info, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getAllMetrolines } from "@/action/metroline";
import type { MetroLine } from "@/types/metroline";
import Link from "next/link";
import { toast } from "sonner";
import { formatTime } from "@/lib/utils";

export function ActiveMetrolines() {
  const [metrolines, setMetrolines] = useState<MetroLine[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch metrolines
  useEffect(() => {
    const fetchMetrolines = async () => {
      try {
        const data = await getAllMetrolines();
        setMetrolines(data);
      } catch (error) {
        console.error("Failed to fetch metro lines:", error);
        toast.error("Failed to fetch metro lines");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrolines();
  }, []);

  if (loading) {
    return (
      <Card className="border-2 rounded-xl shadow-sm mt-12">
        <CardContent>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">
              Active Metro Lines
            </h2>
          </div>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
              >
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 rounded-xl shadow-sm mt-12">
      <CardContent>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">
            Active Metro Lines
          </h2>
        </div>
        <div className="mt-4 space-y-4">
          {metrolines.map((line) => (
            <div
              key={line.metroLine.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Train className="h-4 w-4 text-primary" />
                  <span className="font-medium text-gray-900 dark:text-white">{line.metroLine.name}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    <span>{line.firstStation.name} → {line.lastStation.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>First train: {formatTime(line.metroLine.firstArrival)}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {line.metroLine.trainFrequency} min
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="relative flex lg:justify-start justify-center">
        <Link href="/metro-explorer">
          <Button
            type="button"
            className="absolute top-1/2 border-2 shadow-sm bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-6 rounded-full text-base"
          >
            View All Metro Lines
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 