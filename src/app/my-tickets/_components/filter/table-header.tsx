"use client";

import { Input } from "@/components/ui/input";
import { ArrowUpDown, Check, Search } from "lucide-react";
import { SortBy } from "@/action/invoice";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type InvoiceItemTableHeaderProps = {
  sortBy: SortBy;
  sortDirection: "asc" | "desc";
  onSortChange: (sortBy: SortBy, sortDirection: "asc" | "desc") => void;
  onSearchChange: (invoiceItemId: string) => void;
  onSizeChange?: (size: number) => void;
  size?: number;
  className?: string;
};

export function InvoiceItemTableHeader({
  sortBy,
  sortDirection,
  onSortChange,
  onSearchChange,
  onSizeChange,
  size = 5,
  className,
}: InvoiceItemTableHeaderProps) {
  const handleDisplayString = (sortBy: SortBy) => {
    switch (sortBy) {
      case SortBy.ID:
        return "Ticket ID";
      case SortBy.PRICE:
        return "Price";
      case SortBy.TICKET_TYPE:
        return "Ticket Type";
      case SortBy.PURCHASED_AT:
        return "Purchased Time";
      case SortBy.ACTIVATED_AT:
        return "Activated Time";
      case SortBy.EXPIRED_AT:
        return "Expired Time";
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between bg-slate-50 p-4 rounded-lg shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={className}>
              <ArrowUpDown className="size-4" />
              Sort by: {handleDisplayString(sortBy as SortBy)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => onSortChange(SortBy.ID, sortDirection)}
            >
              ID {sortBy === SortBy.ID && <Check className="size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => onSortChange(SortBy.PRICE, sortDirection)}
            >
              Price {sortBy === SortBy.PRICE && <Check className="size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => onSortChange(SortBy.TICKET_TYPE, sortDirection)}
            >
              Ticket Type{" "}
              {sortBy === SortBy.TICKET_TYPE && <Check className="size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => onSortChange(SortBy.PURCHASED_AT, sortDirection)}
            >
              Purchased Time{" "}
              {sortBy === SortBy.PURCHASED_AT && <Check className="size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => onSortChange(SortBy.ACTIVATED_AT, sortDirection)}
            >
              Activated Time{" "}
              {sortBy === SortBy.ACTIVATED_AT && <Check className="size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => onSortChange(SortBy.EXPIRED_AT, sortDirection)}
            >
              Expired Time{" "}
              {sortBy === SortBy.EXPIRED_AT && <Check className="size-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={className}>
              <ArrowUpDown className="size-4" />
              Sort by: {sortDirection === "asc" ? "ASC" : "DESC"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => onSortChange(sortBy as SortBy, "desc")}
            >
              DESC {sortDirection === "desc" && <Check className="size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => onSortChange(sortBy as SortBy, "asc")}
            >
              ASC {sortDirection === "asc" && <Check className="size-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {onSizeChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={className}>
                Show: {size} items
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[5, 10, 20, 50].map((pageSize) => (
                <DropdownMenuItem
                  key={pageSize}
                  className="flex items-center justify-between"
                  onClick={() => onSizeChange(pageSize)}
                >
                  {pageSize} items{" "}
                  {size === pageSize && <Check className="size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by ticket ID"
          className="pl-8"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
