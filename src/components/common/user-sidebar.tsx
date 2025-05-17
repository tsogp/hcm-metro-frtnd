"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Home, Map, Menu, Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: Home,
        },
        {
          title: "Metro Explorer",
          href: "/metro-explorer",
          icon: Map,
        },
      ],
    },
    {
      title: "Tickets",
      items: [
        {
          title: "Ticket History",
          href: "/tickets/history",
          icon: CreditCard,
        },
        {
          title: "Ticket Activation",
          href: "/tickets/activate",
          icon: Ticket,
        },
      ],
    },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 mr-2 text-white hover:bg-secondary-foreground/10"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] p-0 border-r-secondary">
          <SheetHeader className="p-4 border-b bg-secondary text-white">
            <SheetTitle className="flex items-center justify-between text-white">
              <span>HCM Metro Navigation</span>
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {routes.map((route) => (
              <div key={route.title} className="px-3 py-2">
                <h3 className="mb-2 px-4 text-sm font-semibold text-secondary">
                  {route.title}
                </h3>
                <div className="space-y-1">
                  {route.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start ${isActive
                            ? "bg-secondary text-white"
                            : "text-secondary hover:bg-secondary/10"
                          }`}
                        asChild
                        onClick={() => setOpen(false)}
                      >
                        <Link href={item.href}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
