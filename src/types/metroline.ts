export type MetroStation = {
  id: string;
  name: string;
  code: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  isTransferStation: boolean;
  transferLines?: string[];
};

export type MetroLine = {
  id: string;
  name: string;
  first_arrival: string;
  train_frequency: string;
  total_duration: string;
  created_at: string;
  updated_at: string;
};

export type MetroRoute = {
  id: string;
  fromStation: string;
  toStation: string;
  lineId: string;
  duration: number;
  price: number;
  stops: string[];
};

export type MetroTicket = {
  id: string;
  routeId: string;
  fromStation: string;
  toStation: string;
  price: number;
  type: 'single' | 'day' | 'week' | 'month';
};

export type SuspensionType = "EMERGENCY" | "MAINTAINENCE";

export type Station = {
  id: string;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export type Schedule = {
  metro_line_id: string;
  station_id: string;
  order: number;
  arrival_time: string;
  created_at: string;
  updated_at: string;
};

export type AlertStation = {
  alert_id: string;
  station_id: string;
};

export type SuspensionAlert = {
  id: string;
  suspension_type: SuspensionType;
  metro_line_id: string;
  type: string;
  description: string;
  expected_restore_time: string;
  created_at: string;
  updated_at: string;
}; 