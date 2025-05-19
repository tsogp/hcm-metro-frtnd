"use client";

import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Station } from "@/types/station";

interface StationMapProps {
  stationCordinateList: Station[];
  height?: string;
  className?: string;
}

export function MetrolineMap({
  stationCordinateList,
  height = "500px",
  className = "",
}: StationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 13);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 15,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    if (stationCordinateList.length === 0) return;

    // Create markers for each station
    const markers: L.Marker[] = [];
    const coordinates: L.LatLngExpression[] = [];

    stationCordinateList.forEach((station, index) => {
      if (station.latitude && station.longitude) {
        const latLng: L.LatLngExpression = [
          station.latitude,
          station.longitude,
        ];
        coordinates.push(latLng);

        // Create custom icon
        const isEndpoint =
          index === 0 || index === stationCordinateList.length - 1;

        const icon = L.divIcon({
          className: `custom-div-icon ${isEndpoint ? "endpoint-marker" : ""}`,
          html: `
            <div class="marker-pin">
              <div class="marker-pin-head">${index + 1}</div>
              <div class="marker-pin-tail"></div>
            </div>
          `,
          iconSize: [36, 50],
          iconAnchor: [18, 50],
          popupAnchor: [0, -50],
        });

        // Create marker
        const marker = L.marker(latLng, { icon })
          .addTo(map)
          .bindPopup(
            `
            <strong>${station.name}</strong>
            <div>${station.address}</div>
            <div>
              ${
                index === 0
                  ? "First Station"
                  : index === stationCordinateList.length - 1
                  ? "Last Station"
                  : `Station ${index + 1}`
              }
            </div>
          `,
            {
              className: "custom-popup",
              maxWidth: 300,
              minWidth: 200,
              autoPan: true,
              closeButton: true,
              offset: [0, 0],
            }
          );

        markers.push(marker);
      }
    });

    // Create a polyline connecting all stations
    if (coordinates.length > 1) {
      const polyline = L.polyline(coordinates, {
        color: "var(--primary, #0070f3)",
        weight: 4,
        opacity: 1,
        lineJoin: "round",
      }).addTo(map);
    }

    if (markers.length > 0)  {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            mapInstanceRef.current?.removeLayer(layer);
          }
        });
      }
    };
  }, [stationCordinateList]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`station-map-container ${className}`}>
      <style jsx global>{`
        .station-map-container {
          width: 100%;
          position: relative;
        }

        .custom-div-icon {
          background: none;
          border: none;
        }

        .marker-pin {
          position: relative;
          width: 36px;
          height: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        .marker-pin-head {
          width: 36px;
          height: 36px;
          background: var(--primary, #0073cf);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
          z-index: 1;
        }

        .marker-pin-tail {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 12px solid var(--primary, #0073cf);
          margin-top: -3px;
          z-index: 0;
        }

        .endpoint-marker .marker-pin-head {
          background: #e74545;
        }

        .endpoint-marker .marker-pin-tail {
          border-top-color: #e74545;
        }

        .custom-popup .leaflet-popup-content-wrapper {
          padding: 10px;
          border-radius: 12px;
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
        }

        .custom-popup .leaflet-popup-content strong {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .custom-popup .leaflet-popup-content div {
          margin-bottom: 4px;
          font-size: 13px;
          color: #666;
        }

        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
      <div ref={mapRef} style={{ height, width: "100%" }} />
    </div>
  );
}

export default MetrolineMap;
