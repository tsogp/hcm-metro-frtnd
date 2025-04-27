import { searchFormSchema } from "@/schemas/search-ticket-form";
import { z } from "zod";

export type SearchTicketFormValues = z.infer<typeof searchFormSchema>;

export type RecentSearch = {
  id: string;
  departure: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  createdAt: number;
};  
