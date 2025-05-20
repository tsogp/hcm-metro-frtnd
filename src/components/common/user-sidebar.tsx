"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Home,
  Map,
  Menu,
  Info,
  TicketCheck,
  DollarSign,
  User,
  UserPlus,
  LogIn,
  Ticket,
  Barcode,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ROUTES } from "@/config/routes";
import { useUserStore } from "@/store/user-store";

type RouteItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

type RouteGroup = {
  title: string;
  items: RouteItem[];
};

export function UserSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser } = useUserStore();

  const mainFeatures: RouteGroup = {
    title: "MAIN FEATURES",
    items: [
      {
        title: "Dashboard",
        href: ROUTES.DASHBOARD,
        icon: Home,
      },
      {
        title: "Metro Explorer",
        href: ROUTES.METRO_EXPLORER.ROOT,
        icon: Map,
      },
      {
        title: "Ticket Activation",
        href: ROUTES.ACTIVATION.ROOT,
        icon: Barcode,
      },
      {
        title: "Payment Process",
        href: ROUTES.PAYMENT.ROOT,
        icon: DollarSign,
      },
      {
        title: "About Us",
        href: ROUTES.ABOUT,
        icon: Info,
      },
    ],
  };

  const passengerOnly: RouteGroup = {
    title: "PASSENGER-ONLY",
    items: [
      {
        title: "Purchased Tickets",
        href: ROUTES.TICKET.ROOT,
        icon: Ticket,
      },
      {
        title: "Invoice History",
        href: ROUTES.INVOICE.ROOT,
        icon: Receipt,
      },
      {
        title: "Edit Profile",
        href: ROUTES.PROFILE.ROOT,
        icon: User,
      },
    ],
  };

  const joinUs: RouteGroup = {
    title: "JOIN US",
    items: [
      {
        title: "Register",
        href: ROUTES.AUTH.REGISTER,
        icon: UserPlus,
      },
      {
        title: "Login",
        href: ROUTES.AUTH.LOGIN,
        icon: LogIn,
      },
    ],
  };

  const routes = [
    mainFeatures,
    ...(currentUser ? [passengerOnly] : []),
    ...(currentUser ? [] : [joinUs]),
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
                <h3 className="mb-2 px-4 text-md font-bold text-secondary">
                  {route.title}
                </h3>
                <div className="space-y-1">
                  {route.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start ${
                          isActive
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
