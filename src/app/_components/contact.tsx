import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

import React from "react";

const contactOptions = [
  {
    icon: <Phone className="h-6 w-6 text-primary" />,
    title: "Phone",
    details: ["+84 28 1234 5678", "Mon-Fri: 8AM-8PM"],
  },
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: "Email",
    details: ["info@hcmcmetro.vn", "support@hcmcmetro.vn"],
  },
  {
    icon: <MapPin className="h-6 w-6 text-primary" />,
    title: "Address",
    details: ["702 Nguyễn Văn Linh, Tân Hưng, District 7, Ho Chi Minh"],
  },
];

function ContactSection() {
  return (
    <section id="contact" className="w-full py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="space-y-2">
            <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              Contact Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Get in Touch
            </h2>
            <p className="max-w-[700px] text-muted-foreground text-lg">
              Have questions or need assistance? Our customer service team is
              here to help.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {contactOptions.map((contact, index) => (
            <Card
              key={index}
              className="text-center group hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  {contact.icon}
                </div>
                <CardTitle className="mt-4">{contact.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {contact.details.map((detail, i) => (
                  <p key={i} className="text-muted-foreground">
                    {detail}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
