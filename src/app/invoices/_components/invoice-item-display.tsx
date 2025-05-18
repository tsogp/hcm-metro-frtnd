import { InvoiceItem } from "./invoice-list";
import { Invoice } from "./invoice-list";
import { formatCurrency, formatDate, truncateText } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Ticket, Clock, CircleX, MapPin } from "lucide-react";

interface InvoiceItemDisplayProps {
  invoice: Invoice;
  invoiceItems: Record<string, InvoiceItem[]>;
}

const InvoiceItemDisplay = ({
  invoice,
  invoiceItems,
}: InvoiceItemDisplayProps) => {
  return (
    <div className="p-4 border-3 border-t-0 border-blue-600 rounded-b-xl space-y-2 animate-in slide-in-from-top-2 duration-300 origin-top">
      {/* Invoice Items */}
      <div className="grid grid-cols-1 gap-4">
        {invoiceItems[invoice.invoiceID as keyof typeof invoiceItems]?.map(
          (item) => (
            <Card
              key={item.invoiceItemId}
              className="overflow-hidden border-2 border-l-slate-300"
            >
              <CardContent className="p-0 mx-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Left column - Ticket info with colored background */}
                  <div className="bg-slate-100 md:w-1/3 p-4 rounded-md">
                    <div className="flex items-start space-x-3">
                      <Ticket className="size-6 text-slate-600" />
                      <div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            ID: {item.invoiceItemId}
                          </p>
                        </div>
                        <p className="font-bold" title={item.ticketName}>
                          {truncateText(item.ticketName, 30)}
                        </p>
                        <Badge variant="outline" className="mt-1 text-sm border-2">
                          {item.ticketType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Details */}
                  <div className="md:w-2/3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Price */}
                      <div className="bg-green-50 p-3 rounded-md flex items-center space-x-2">
                        <Tag className="size-5 text-green-600" />
                        <div>
                          <p className="text-xs text-green-600">Price</p>
                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Line */}
                      <div className="bg-slate-100 p-3 rounded-md">
                        <p className="text-xs text-slate-500">Line</p>
                        <p className="font-bold">{item.lineName} </p>
                      </div>

                      {/* Duration */}
                      <div className="bg-slate-100 p-3 rounded-md">
                        <p className="text-xs text-slate-500">Duration</p>
                        <p className="font-bold">{item.duration} min</p>
                      </div>

                      <div className="col-span-2 md:col-span-3 bg-slate-100 p-3 rounded-md flex items-center">
                        <MapPin className="size-5 text-slate-500 mr-2" />
                        <div>
                          <p className="text-xs text-slate-500">Route</p>
                          <p className="font-medium">
                            {item.startStation} → {item.endStation}
                          </p>
                        </div>
                      </div>

                      {/* Valid Period */}
                      <div className="col-span-2 md:col-span-3 rounded-md grid grid-cols-2 gap-3">
                        <div className="flex items-center col-span-1 bg-slate-100 p-3 rounded-md">
                          <Clock className="size-5 text-slate-500 mr-2" />
                          <div>
                            <p className="text-xs text-slate-500">
                              Activation Date
                            </p>
                            <p className="font-medium">
                              {formatDate(item.activatedAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center col-span-1 bg-slate-100 p-3 rounded-md">
                          <CircleX className="size-5 text-slate-500 mr-2" />
                          <div>
                            <p className="text-xs text-slate-500">
                              Expiration Date
                            </p>
                            <p className="font-medium">
                              {formatDate(item.expiredAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default InvoiceItemDisplay;
