'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Train, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getAllStations } from "@/action/stations";
import type { Station } from "@/types/station";
import Link from "next/link";
import { toast } from "sonner";

interface StationWithDistance extends Station {
  distance: string;
}

// Default location (Ben Thanh Station)
const DEFAULT_LOCATION = {
  lat: 10.7797,
  lng: 106.6989
};

export function NearestStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(DEFAULT_LOCATION);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's location
  useEffect(() => {
    const getLocation = async () => {
      setLocationLoading(true);
      setLocationError(null);

      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        setUserLocation(DEFAULT_LOCATION);
        setLocationLoading(false);
        return;
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Validate coordinates
        if (isNaN(newLocation.lat) || isNaN(newLocation.lng)) {
          throw new Error("Invalid coordinates received");
        }

        setUserLocation(newLocation);
        toast.success("Location updated successfully");
      } catch (error) {
        console.error("Error getting location:", error);
        setLocationError("Unable to get your location. Using default location.");
        setUserLocation(DEFAULT_LOCATION);
        toast.error("Using default location (Ben Thanh Station)");
      } finally {
        setLocationLoading(false);
      }
    };

    getLocation();
  }, []);

  // Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getAllStations();
        setStations(data);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
        toast.error("Failed to fetch stations");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Calculate distances and sort stations
  const nearbyStations: StationWithDistance[] = stations
    .map(station => ({
      ...station,
      distance: `${calculateDistance(
        userLocation.lat,
        userLocation.lng,
        station.latitude,
        station.longitude
      ).toFixed(1)} km`
    }))
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    .slice(0, 3);

  if (loading || locationLoading) {
    return (
      <Card className="border-2 rounded-xl shadow-sm mt-12">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">
              Nearest Stations
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
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">
            Nearest Stations
          </h2>
          {locationError && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <span>{locationError}</span>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {nearbyStations.map((station) => (
            <div
              key={station.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium text-gray-900 dark:text-white">{station.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {station.distance}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    <span>{station.address}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-secondary hover:text-secondary/90"
              >
                View Schedule
              </Button>
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
            View All Stations
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 