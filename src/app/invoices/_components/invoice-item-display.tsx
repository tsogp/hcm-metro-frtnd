import { InvoiceItem, Invoice } from "@/types/invoice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Ticket, Clock, CircleX, MapPin } from "lucide-react";
import { formatCurrency, formatDate, truncateText } from "@/lib/utils";
import { Station } from "@/types/station";
interface InvoiceItemDisplayProps {
  invoice: Invoice;
  invoiceItems: Record<string, InvoiceItem[]>;
  stations: Station[];
}

function InvoiceItemDisplay({
  invoice,
  invoiceItems,
  stations,
}: InvoiceItemDisplayProps) {
  const items = invoiceItems[invoice.invoiceID] || [];

  const startStationName =
    items.length > 0
      ? stations.find((station) => station.id === items[0].startStation)?.name
      : "";
  const endStationName =
    items.length > 0
      ? stations.find((station) => station.id === items[0].endStation)?.name
      : "";

  return (
    <div className="space-y-4 border-3 border-t-0 border-blue-600 rounded-t-none rounded-b-xl p-4">
      {items.map((item) => (
        <Card
          key={item.invoiceItemId}
          className="overflow-hidden border-2 border-l-slate-300"
        >
          <CardContent className="p-0 mx-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="bg-slate-100 md:w-1/3 p-4 rounded-md">
                <div className="flex items-start space-x-3">
                  <Ticket className="size-6 text-slate-600" />
                  <div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        ID: {item.invoiceItemId}
                      </p>
                    </div>
                    <p className="font-bold" title={item.lineName}>
                      {truncateText(item.lineName, 30)}
                    </p>
                    <Badge variant="outline" className="mt-1 text-sm border-2">
                      {item.ticketType}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-green-50 p-3 rounded-md flex items-center space-x-2">
                    <Tag className="size-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600">Price</p>
                      <p className="text-lg font-bold text-green-700">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-3 rounded-md">
                    <p className="text-xs text-slate-500">Line</p>
                    <p className="font-bold">{item.lineName} </p>
                  </div>

                  <div className="bg-slate-100 p-3 rounded-md">
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="font-bold">{item.duration} min</p>
                  </div>

                  <div className="col-span-2 md:col-span-3 bg-slate-100 p-3 rounded-md flex items-center">
                    <MapPin className="size-5 text-slate-500 mr-2" />
                    <div>
                      <p className="text-xs text-slate-500">Route</p>
                      <p className="font-medium">
                        {startStationName} → {endStationName}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 md:col-span-3 rounded-md grid grid-cols-2 gap-3">
                    <div className="flex items-center col-span-1 bg-slate-100 p-3 rounded-md">
                      <Clock className="size-5 text-slate-500 mr-2" />
                      <div>
                        <p className="text-xs text-slate-500">
                          Activation Date
                        </p>
                        <p className="font-medium">
                          {item.activatedAt
                            ? formatDate(item.activatedAt)
                            : "Inactive"}
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
                          {item.expiredAt
                            ? formatDate(item.expiredAt)
                            : "Inactive"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default InvoiceItemDisplay;
