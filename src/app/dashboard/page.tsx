import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TicketList } from "@/components/ticket/ticket-list";
import SearchForm from "@/app/dashboard/components/search-ticket-form";

export default function Dashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 mb-20">
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

      {/* Search Section */}
      <section>
        <SearchForm />
      </section>

      {/* Tickets Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">
          Your Tickets
        </h2>
        <TicketList />
      </section>
    </div>
  );
}
