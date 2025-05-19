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

type InvoiceStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";
export const getInvoiceItemsByStatus = async (status: InvoiceStatus): Promise<InvoiceItem[]> => {
  const resposne = await API.get(`/invoice/my-tickets/${status}`);
  return resposne.data;
};

type PaginationParams = {
  page: number;
  size: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
};
export const getPaginatedInvoiceItems = async ({ page, size, sortBy, sortDirection }: PaginationParams): Promise<InvoiceItem[]> => {
  const resposne = await API.get("/invoice/my-tickets", {
    params: {
      page,
      size,
      sortBy,
      sortDirection,
    },
  });
  return resposne.data;
};

type PaginatedInvoiceItemsByStatusParams = PaginationParams & { status: InvoiceStatus };
export const getPaginatedInvoiceItemsByStatus = async ({ page, size, sortBy, sortDirection, status }: PaginatedInvoiceItemsByStatusParams): Promise<InvoiceItem[]> => {
  const resposne = await API.get("/invoice/my-tickets/status", {
    params: {
      page,
      size,
      sortBy,
      sortDirection,
      status,
    },
  });
  return resposne.data;
};

export const activateTicket = async (invoiceItemId: string): Promise<InvoiceItem | null> => {
  const resposne = await API.post(`/invoice/activate-ticket/${invoiceItemId}`);
  return resposne.data;
};