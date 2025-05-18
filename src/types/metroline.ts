export interface MetroLine {
  metroLine: {
    id: string;
    name: string;
    firstArrival: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    trainFrequency: number;
    totalDuration: number;
    stationOrder: string[];
    createdAt: string;
    updatedAt: string;
  };

  firstStation: {
    id: string;
    name: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };

  lastStation: {
    id: string;
    name: string;
    address: string;
    createdAt: string;
    updatedAt: string;
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




// export type MetroRoute = {
//   id: string;
//   fromStation: string;
//   toStation: string;
//   lineId: string;
//   duration: number;
//   price: number;
//   stops: string[];
// };

// export type MetroTicket = {
//   id: string;
//   routeId: string;
//   fromStation: string;
//   toStation: string;
//   price: number;
//   type: 'single' | 'day' | 'week' | 'month';
// };

// export type SuspensionType = "EMERGENCY" | "MAINTAINENCE";

// export type Station = {
//   id: string;
//   name: string;
//   address: string;
//   created_at: string;
//   updated_at: string;
// };

// export type Schedule = {
//   metro_line_id: string;
//   station_id: string;
//   order: number;
//   arrival_time: string;
//   created_at: string;
//   updated_at: string;
// };

// export type AlertStation = {
//   alert_id: string;
//   station_id: string;
// };

// export type SuspensionAlert = {
//   id: string;
//   suspension_type: SuspensionType;
//   metro_line_id: string;
//   type: string;
//   description: string;
//   expected_restore_time: string;
//   created_at: string;
//   updated_at: string;
// }; 