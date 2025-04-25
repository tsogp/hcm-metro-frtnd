export type SearchTicketFormValues = {
  departure: string;
  destination: string;
  departureDate: Date;
  departureTime: string;
};

export type RecentSearch = {
  id: string;
  departure: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  createdAt: number;
};  
