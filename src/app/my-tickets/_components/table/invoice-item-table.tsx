"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import TablePagination from "../filter/table-pagination";

import type { Station } from "@/types/station";
import { Loader2, ExternalLink, ArrowRight } from "lucide-react";
import type { InvoiceItem } from "@/types/invoice";
import Link from "next/link";
import { getAllStations } from "@/action/station";
import { InvoiceStatus, type SortBy } from "@/action/invoice";
import { InvoiceItemTableHeader } from "../filter/table-header";

interface InvoiceItemTableProps {
  tickets: InvoiceItem[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  status: InvoiceStatus;
  page: number;
  size: number;
  sortBy: SortBy;
  sortDirection: "asc" | "desc";

  onPageChange: (page: number) => void;
  onSortChange: (sortBy: SortBy, sortDirection: "asc" | "desc") => void;
  onSizeChange?: (size: number) => void;
}

function InvoiceItemTable({
  tickets,
  loading,
  totalPages,
  status,
  page,
  size,
  sortBy,
  sortDirection,
  onPageChange,
  onSortChange,
  onSizeChange,
}: InvoiceItemTableProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentTickets, setCurrentTickets] = useState<InvoiceItem[]>(tickets);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationsData = await getAllStations();
        setStations(stationsData);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    setCurrentTickets(tickets);
  }, [tickets]);

  const onSearchChange = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setCurrentTickets(tickets);
      return;
    }

    const filteredTickets = tickets.filter((ticket) => {
      return ticket.invoiceItemId.includes(searchTerm.trim());
    });
    setCurrentTickets(filteredTickets);
  };

  const getStationName = (stationId: string) => {
    return (
      stations.find((station) => station.id === stationId)?.name || stationId
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case InvoiceStatus.ACTIVE:
        return "default";
      case InvoiceStatus.INACTIVE:
        return "secondary";
      case InvoiceStatus.EXPIRED:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTypeName = (type: string) => {
    switch (type.toUpperCase()) {
      case "ONE_WAY_4":
        return "One Way";
      case "ONE_WAY_8":
        return "One Way";
      case "ONE_WAY_X":
        return "One Way";
      case "DAILY":
        return "Daily";
      case "THREE_DAY":
        return "Three Day";
      case "MONTHLY_STUDENT":
        return "Monthly Student";
      case "MONTHLY_ADULT":
        return "Monthly Adult";
      default:
        return "Free";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <InvoiceItemTableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
        onSearchChange={onSearchChange}
        onSizeChange={onSizeChange}
        size={size}
      />

      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[180px] font-semibold">
                Ticket ID
              </TableHead>
              <TableHead className="font-semibold text-center">Type</TableHead>
              <TableHead className="font-semibold text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-center">Price</TableHead>
              <TableHead className="font-semibold text-center">Line</TableHead>
              <TableHead className="font-semibold text-center">Route</TableHead>
              {status === InvoiceStatus.INACTIVE && (
                <TableHead className="font-semibold text-center">
                  Expiration Time
                </TableHead>
              )}
              {status !== InvoiceStatus.INACTIVE && (
                <>
                  <TableHead className="font-semibold text-center">
                    Activation Date
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Expiration Date
                  </TableHead>
                </>
              )}
              {status === InvoiceStatus.INACTIVE && (
                <TableHead className="text-center font-semibold ">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={status === InvoiceStatus.INACTIVE ? 10 : 9}
                  className="h-24 text-center"
                >
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              currentTickets.map((ticket) => (
                <TableRow
                  key={ticket.invoiceItemId}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-medium border-l-4 border-primary">
                    {ticket.invoiceItemId}
                  </TableCell>
                  <TableCell className="text-center border-l-4 border-blue-400">
                    <div className="w-full max-w-[200px] px-2 py-1 bg-slate-100 rounded-md text-sm">
                      {getTypeName(ticket.ticketType)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center border-l-4 border-purple-400">
                    <Badge
                      variant={getStatusVariant(ticket.status)}
                      className={`
                        ${
                          ticket.status.toUpperCase() === "ACTIVE"
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        }
                        ${
                          ticket.status.toUpperCase() === "INACTIVE"
                            ? "bg-slate-500 hover:bg-slate-600"
                            : ""
                        }
                        ${
                          ticket.status.toUpperCase() === "EXPIRED"
                            ? "bg-red-500 hover:bg-red-600"
                            : ""
                        }
                      `}
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600 text-center border-l-4 border-green-400">
                    {formatCurrency(ticket.price)}
                  </TableCell>
                  <TableCell className="text-center border-l-4 border-amber-400">
                    {ticket.lineName}
                  </TableCell>
                  <TableCell className="border-l-4 border-teal-400">
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <span className="font-medium">
                        {getStationName(ticket.startStation)}
                      </span>
                      <ArrowRight className="size-4" />
                      <span className="font-medium">
                        {getStationName(ticket.endStation)}
                      </span>
                    </div>
                  </TableCell>
                  {status === InvoiceStatus.INACTIVE && (
                    <TableCell className="flex justify-center border-l-4 border-red-400">
                      {ticket.duration ? (
                        <div className="w-full max-w-[100px] text-sm text-center bg-red-50 text-red-700 px-2 py-1 rounded">
                          {ticket.duration > 1
                            ? `${ticket.duration} days`
                            : "1 day"}
                        </div> 
                      ) : (
                        <div className="text-sm text-slate-500">—</div>
                      )}
                    </TableCell>
                  )}

                  {status !== InvoiceStatus.INACTIVE && (
                    <>
                      <TableCell className="text-center border-l-4 border-emerald-400">
                        {ticket.activatedAt ? (
                          <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
                            {formatDate(new Date(ticket.activatedAt))}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-rose-400">
                        {ticket.expiredAt ? (
                          <span className="text-sm bg-red-50 text-red-700 px-2 py-1 rounded">
                            {formatDate(new Date(ticket.expiredAt))}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500">—</span>
                        )}
                      </TableCell>
                    </>
                  )}
                  {status === InvoiceStatus.INACTIVE && (
                    <TableCell className="text-center border-l-4 border-cyan-400">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        asChild
                      >
                        <Link
                          href={`/activation?invoiceItemId=${ticket.invoiceItemId}`}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Activate
                        </Link>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        className="bg-background p-4"
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default InvoiceItemTable;
