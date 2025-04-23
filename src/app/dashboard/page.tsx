import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Clock, MapPin, Ticket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const tickets = [
    {
      id: "1",
      title: "Single Journey Ticket",
      price: "$2.50",
      from: "Central Station",
      to: "Airport Terminal",
      date: "Valid for 2 hours",
      status: "Active",
    },
    {
      id: "2",
      title: "Day Pass",
      price: "$8.00",
      from: "Any Station",
      to: "Any Station",
      date: "Valid until midnight",
      status: "Active",
    },
    {
      id: "3",
      title: "Weekly Pass",
      price: "$35.00",
      from: "Any Station",
      to: "Any Station",
      date: "Valid for 7 days",
      status: "Expired",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 to-secondary/50 z-10" />
        <Image
          src="/images/METRO_MAP.png"
          alt="Ho Chi Minh City Metro Map"
          width={1200}
          height={400}
          priority
          className="w-full h-[250px] md:h-[350px] object-contain"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-4 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
            Your Journey Starts Here
          </h1>
          <p className="text-white/90 max-w-md mb-4 md:mb-6 text-sm md:text-base">
            Explore the city with our modern metro system. Fast, reliable, and
            convenient transportation at your fingertips.
          </p>
          <div>
            <Button className="bg-accent hover:bg-accent/90 text-white text-sm md:text-base">
              <Link href="/explorer" className="flex items-center">
                Book Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tickets Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-secondary">
            Your Tickets
          </h2>
          <Button
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary/10"
          >
            <Link href="/tickets/history">View All</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className={
                ticket.status === "Expired"
                  ? "border-muted-foreground/30"
                  : "border-secondary/50"
              }
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base md:text-lg text-secondary">
                    {ticket.title}
                  </CardTitle>
                  <div
                    className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.status === "Active"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                  >
                    {ticket.status}
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {ticket.price}
                </p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MapPin className="mr-2 h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">From: {ticket.from}</div>
                      <div className="font-medium">To: {ticket.to}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-secondary" />
                    <span>{ticket.date}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className={
                    ticket.status === "Active"
                      ? "bg-secondary hover:bg-secondary/90 text-white w-full"
                      : "bg-transparent border border-secondary text-secondary hover:bg-secondary/10 w-full"
                  }
                >
                  <Link
                    href={`/tickets/activate?id=${ticket.id}`}
                    className="flex items-center w-full justify-center"
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    {ticket.status === "Active"
                      ? "View Ticket"
                      : "Renew Ticket"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
