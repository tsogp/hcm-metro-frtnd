import Image from "next/image";
import { Timer, Globe, Shield, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const benefitList = [
  {
    icon: <Timer className="h-5 w-5" />,
    title: "Fast & Reliable",
    description:
      "Avoid traffic congestion and reach your destination on time with our punctual service.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Fully Online System",
    description:
      "Book tickets, check schedules, and get updates all through our digital platforms.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Safe & Secure",
    description:
      "Modern security systems and trained staff ensure your safety throughout your journey.",
  },
  {
    icon: <BadgeCheck className="h-5 w-5" />,
    title: "Eco-Friendly",
    description:
      "Reduce your carbon footprint by choosing our energy-efficient public transportation.",
  },
];

function BenefitSection() {
  return (
    <section id="benefits" className="w-full py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/benefit-img.png"
              alt="Passengers using the Ho Chi Minh City Metro"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <Badge className="rounded-full bg-blue-100 px-4 py-1.5 text-sm text-blue-700">
                Benefits
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Why choose HCMC Metro?
              </h2>
            </div>
            <div className="space-y-6">
              {benefitList.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="rounded-full bg-blue-600 p-2 text-white group-hover:bg-blue-700 transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitSection;
