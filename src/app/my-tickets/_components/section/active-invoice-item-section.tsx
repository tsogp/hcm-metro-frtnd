"use client";

import { useEffect, useState } from "react";
import {
  getPaginatedInvoiceItemsByStatus,
  InvoiceStatus,
  SortBy,
} from "@/action/invoice";
import type { InvoiceItem } from "@/types/invoice";
import InvoiceItemTable from "../table/invoice-item-table";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";
export function ActiveInvoiceItemSection() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number.parseInt(searchParams.get("page") || "0");
  const size = Number.parseInt(searchParams.get("size") || "5");
  const sortBy = searchParams.get("sortBy") || SortBy.PURCHASED_AT;
  const sortDirection = (searchParams.get("sortDirection") || "desc") as
    | "asc"
    | "desc";

  const [tickets, setTickets] = useState<InvoiceItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaginatedAndSortedData = async () => {
      setLoading(true);
      const { content, totalElements, totalPages } =
        await getPaginatedInvoiceItemsByStatus({
          page,
          size,
          sortBy,
          sortDirection,
          status: InvoiceStatus.ACTIVE,
        });

      setTickets(content);
      setTotalItems(totalElements);
      setTotalPages(totalPages);
      setLoading(false);
    };

    fetchPaginatedAndSortedData();
  }, [page, size, sortBy, sortDirection]);

  const updateUrlParams = ({
    page,
    size,
    sortBy,
    sortDirection,
  }: {
    page?: number;
    size?: number;
    sortBy?: SortBy;
    sortDirection?: "asc" | "desc";
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page !== undefined) params.set("page", page.toString());
    if (size !== undefined) params.set("size", size.toString());
    if (sortBy !== undefined) params.set("sortBy", sortBy);
    if (sortDirection !== undefined) params.set("sortDirection", sortDirection);
    
    router.push(`?${params.toString()}`);
  };

  return (
    <InvoiceItemTable
      tickets={tickets}
      loading={loading}
      totalItems={totalItems}
      totalPages={totalPages}
      status={InvoiceStatus.ACTIVE}
      page={page}
      size={size}
      sortBy={sortBy as SortBy}
      sortDirection={sortDirection as "asc" | "desc"}
      onPageChange={(page: number) =>
        updateUrlParams({ page, size, sortBy: sortBy as SortBy, sortDirection })
      }
      onSortChange={(sortBy: SortBy, sortDirection: "asc" | "desc") =>
        updateUrlParams({
          sortBy: sortBy as SortBy,
          sortDirection,
        })
      }
      onSizeChange={(newSize: number) =>
        updateUrlParams({
          size: newSize,
          page: 0,
        })
      }
    />
  );
}
