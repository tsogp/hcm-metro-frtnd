export interface MetroLine {
  metroLine: {
    id: string;
    name: string;
    firstArrival: string;
    trainFrequency: number;
    totalDuration: number | null;
    stationOrder: string[];
    createdAt: string;
    updatedAt: string;
  };

  firstStation: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    createdAt: string | null;
    updatedAt: string | null;
  };

  lastStation: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    createdAt: string | null;
    updatedAt: string | null;
  };
}

export interface MetrolineTripSchedule {
  totalArrivalDuration: number | null;
  schedules: MetrolineStationSchedule[];
}

export interface MetrolineStationSchedule {
  totalArrivalDuration: number | null;
  schedules: MetrolineStationScheduleItem[];
}

export interface MetrolineStationScheduleItem {
  metroLineId: string;
  metroLineName: string;
  stationId: string;
  stationName: string;
  stationAddress: string;
  arrivalDuration: number;
  arrivedAt: string;
}