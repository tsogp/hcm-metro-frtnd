import { Invoice, InvoiceItem } from "@/types/invoice";
import API from "@/utils/axiosClient";

export const getMyInvoices = async (): Promise<Invoice[]> => {
  const resposne = await API.get("/invoice/my-invoices");
  return resposne.data;
};

export const getInvoiceByID = async (invoiceID: string): Promise<Invoice> => {
  const resposne = await API.get(`/invoice/${invoiceID}`);
  return resposne.data;
};

export const getInvoiceItemsByStatus = async (
  status: InvoiceStatus
): Promise<InvoiceItem[]> => {
  const resposne = await API.get(`/invoice/my-tickets/${status}`);
  return resposne.data;
};

type PaginationParams = {
  page: number;
  size: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
};

export const getPaginatedInvoiceItems = async ({
  page,
  size,
  sortBy,
  sortDirection,
}: PaginationParams): Promise<{
  content: InvoiceItem[];
  totalElements: number;
  totalPages: number;
}> => {
  const resposne = await API.get("/invoice/my-tickets", {
    params: {
      page,
      size,
      sortBy,
      sortDirection,
    },
  });

  const { content, totalElements, totalPages } = resposne.data;

  return { content, totalElements, totalPages };
};

type PaginatedInvoiceItemsByStatusParams = PaginationParams & {
  status: InvoiceStatus;
};

export enum InvoiceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
}

export enum SortBy {
  ID = "ID",
  PRICE = "PRICE",
  TICKET_TYPE = "TICKET_TYPE",
  PURCHASED_AT = "PURCHASED_AT",
  ACTIVATED_AT = "ACTIVATED_AT",
  EXPIRED_AT = "EXPIRED_AT",
}

export const getPaginatedInvoiceItemsByStatus = async ({
  page,
  size,
  sortBy,
  sortDirection,
  status,
}: PaginatedInvoiceItemsByStatusParams): Promise<{
  content: InvoiceItem[];
  totalElements: number;
  totalPages: number;
}> => {
  const resposne = await API.get(`/invoice/my-tickets/status/${status}`, {
    params: {
      page,
      size,
      sortBy,
      sortDirection,
    },
  });

  const { content, totalElements, totalPages } = resposne.data;

  return { content, totalElements, totalPages };
};

export const activateTicket = async (
  invoiceItemId: string
): Promise<InvoiceItem> => {
  const resposne = await API.post(`/invoice/activate-ticket/${invoiceItemId}`);
  return resposne.data.data;
};
