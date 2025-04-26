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
  color: string;
  stations: MetroStation[];
  operatingHours: {
    start: string;
    end: string;
  };
  frequency: number; // in minutes
  status: 'operational' | 'maintenance' | 'planned';
};

export type MetroRoute = {
  id: string;
  fromStation: string;
  toStation: string;
  lineId: string;
  duration: number; // in minutes
  distance: number; // in kilometers
  price: number;
  stops: string[];
};

export type MetroTicket = {
  id: string;
  routeId: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  type: 'single' | 'day' | 'week' | 'month';
  validUntil: string;
  isAvailable: boolean;
}; 