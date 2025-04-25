"use client";

import {
  AlertTriangle,
  Minus,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TICKET_TYPES } from "./ticket-list";

type TicketType = (typeof TICKET_TYPES)[keyof typeof TICKET_TYPES];

interface Ticket {
  id: number;
  line: string;
  startStation: string;
  endStation: string;
  type: TicketType;
  price: number;
  suspended: boolean;
}

interface TicketItemProps {
  ticket: Ticket;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
  index: number;
}

export function TicketItem({
  ticket,
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
  index,
}: TicketItemProps) {
  // Determine tilt direction based on index (odd = left, even = right)
  const tiltDirection = index % 2 === 0 ? "right" : "left";
  const tiltClass =
    tiltDirection === "left"
      ? "hover:rotate-[-2deg] hover:rotate-y-[-5deg]"
      : "hover:rotate-[2deg] hover:rotate-y-[5deg]";

  // Extract ticket type components
  const getTicketTypeParts = () => {
    const typeName = ticket.type.name;

    // Handle special case for "Free (Disability)"
    if (typeName === "Free") {
      return {
        period: "Free",
        userType: "Privileged",
      };
    }

    // Extract period (One Way, Daily, Three Day, Monthly)
    let period = "";
    if (typeName.includes("One Way")) period = "One Way";
    else if (typeName.includes("Daily")) period = "Daily";
    else if (typeName.includes("Three Day")) period = "Three Day";
    else if (typeName.includes("Monthly")) period = "Monthly";

    // Extract user type (Student, Adult)
    let userType = "";
    if (typeName.includes("Student")) userType = "Student";
    else if (typeName.includes("Adult")) userType = "Adult";

    return { period, userType };
  };

  const { period, userType } = getTicketTypeParts();

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 transform-gpu perspective-[1000px] 
                 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 ${tiltClass}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <CardContent>
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className="font-medium text-sm">
            {period}
          </Badge>

          {userType && (
            <Badge
              variant="secondary"
              className={"bg-green-100 text-green-800 hover:bg-green-100"}
            >
              {userType.toUpperCase()}
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{ticket.line}</h3>
              <p className="text-sm text-muted-foreground">
                Expires: {ticket.type.expiryInterval}
              </p>
            </div>
            <div className="text-xl font-bold">
              {ticket.price === 0 ? "FREE" : `$${ticket.price.toFixed(2)}`}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="font-medium">From:</span>
                <div className="flex items-center ml-2">
                  <span>{ticket.startStation}</span>
                  {ticket.suspended && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="size-4 text-red-500 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-accent-foreground border-2 border-red-500 text-xs text-red-500 font-bold mb-1">
                          <p>Service suspended at this station</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium">To:</span>
                <span className="ml-2">{ticket.endStation}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDecrement()}
            className="text-secondary hover:bg-secondary/10 hover:text-secondary"
            disabled={quantity === 0}
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onIncrement()}
            className="text-secondary hover:bg-secondary/10 hover:text-secondary"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <Button
          className="hover:bg-secondary/70"
         onClick={onAddToCart} disabled={quantity === 0}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
