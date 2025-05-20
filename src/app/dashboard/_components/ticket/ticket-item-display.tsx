"use client";

import { AlertTriangle, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { SuspensionMetrolineWithDetails } from "@/action/metroline";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";

interface TicketForDisplayingSelectedTrip {
  lineName: string;
  startStationName: string;
  endStationName: string;
  ticketTypeName: string;
  price: number;
  expiryInterval: string;
  // suspended: boolean;
}

interface TicketItemProps {
  ticket: TicketForDisplayingSelectedTrip;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
  index: number;
  suspensionMetrolineList: SuspensionMetrolineWithDetails[];
}

export function TicketItemDisplay({
  ticket,
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
  index,
  suspensionMetrolineList,
}: TicketItemProps) {
  const tiltDirection = index % 2 === 0 ? "right" : "left";
  const tiltClass =
    tiltDirection === "left"
      ? "hover:rotate-[-2deg] hover:rotate-y-[-5deg]"
      : "hover:rotate-[2deg] hover:rotate-y-[5deg]";

  const getTicketTypeParts = () => {
    const ticketTypeName = ticket.ticketTypeName;

    if (ticketTypeName === "FREE") {
      return {
        period: "Free",
        userType: "Privileged",
      };
    }

    let period = "";
    if (ticketTypeName.includes("ONE_WAY")) period = "One Way";
    else if (ticketTypeName.includes("DAILY")) period = "Daily";
    else if (ticketTypeName.includes("THREE_DAY")) period = "Three Day";
    else if (ticketTypeName.includes("MONTHLY")) period = "Monthly";

    let userType = "";
    if (ticketTypeName.includes("STUDENT")) userType = "Student";
    else if (ticketTypeName.includes("ADULT")) userType = "Adult";

    return { period, userType };
  };

  const { period, userType } = getTicketTypeParts();

  const isStationSuspended = () => {
    return suspensionMetrolineList.some(
      (suspension) => suspension.metroLineName === ticket.lineName
    );
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 transform-gpu perspective-[1000px] hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 ${tiltClass}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <CardContent>
        <div className="flex justify-between items-start mb-4">
          <Badge
            variant="outline"
            className="font-medium text-sm border-blue-400 border-1"
          >
            {period}
          </Badge>

          {userType ? (
            <Badge
              variant="secondary"
              className={"bg-green-100 text-green-800 hover:bg-green-300"}
            >
              {userType.toUpperCase()}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="font-medium bg-blue-100 text-blue-800 hover:bg-blue-300"
            >
              NORMAL
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center">
                <h3 className="font-semibold text-lg">{ticket.lineName}</h3>
                {isStationSuspended() && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="size-4 text-red-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-accent-foreground border-2 border-red-500 text-xs text-red-500 font-bold mb-1">
                        <p>Service suspended at this line</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[36px]">
                Expires: {ticket.expiryInterval}
              </p>
            </div>
            <div className="text-xl font-bold">
              {ticket.price === 0 ? (
                "FREE"
              ) : (
                <span>{formatCurrency(ticket.price)}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="font-medium">From:</span>
                <div className="flex items-center ml-2">
                  <span>{ticket.startStationName}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium">To:</span>
                <span className="ml-2">{ticket.endStationName}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        {ticket.ticketTypeName == "FREE" ? (
          <div className="flex justify-end w-full">
            <Button
              className="hover:bg-secondary/70"
              onClick={() => onAddToCart()}
              disabled={quantity === 1}
            >
              Add to Cart
            </Button>
          </div>
        ) : (
          <>
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
              onClick={() => onAddToCart()}
              disabled={quantity === 0}
            >
              Add to Cart
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default TicketItemDisplay;
