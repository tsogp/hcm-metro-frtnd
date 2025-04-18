import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Ticket, Wallet } from "lucide-react";

const featureCards = [
  {
    icon: <Ticket className="h-8 w-8 text-blue-600" />,
    title: "Online Ticket Booking",
    description:
      "Book your tickets in advance through our website or mobile app. Skip the queues and enjoy a seamless journey.",
  },
  {
    icon: <Wallet className="h-8 w-8 text-blue-600" />,
    title: "Multiple Payment Options",
    description:
      "Pay with credit cards, e-wallets, or mobile banking. Convenient and secure payment methods for everyone.",
  },
  {
    icon: <MapPin className="h-8 w-8 text-blue-600" />,
    title: "Real-time Tracking",
    description:
      "Track train locations and estimated arrival times in real-time through our booking application.",
  },
];

function FeatureSection() {
  return (
    <section id="features" className="w-full py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="space-y-2">
            <Badge className="rounded-full bg-blue-100 px-4 py-1.5 text-sm text-blue-700">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Modern Transit Experience
            </h2>
            <p className="max-w-[700px] text-gray-600 text-lg">
              Discover the convenient features that make HCMC Metro the
              preferred choice for urban transportation
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-2">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg w-fit group-hover:bg-blue-100 transition-colors duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
