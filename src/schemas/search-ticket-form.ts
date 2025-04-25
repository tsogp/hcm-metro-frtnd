import { z } from "zod";

export const searchFormSchema = z
  .object({
    departure: z.string().min(1, "Location is required"),
    destination: z.string().min(1, "Location is required"),
    departureDate: z.date(),
    departureTime: z.string().min(1, "Time is required"),
  })
  .refine((data) => data.departure !== data.destination, {
    message: "Departure and destination cannot be the same",
    path: ["destination"],
  });

export type SearchFormValues = z.infer<typeof searchFormSchema>;
