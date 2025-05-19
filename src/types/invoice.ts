export interface Invoice {
  invoiceID: string;
  passengerID: string;
  email: string;
  totalPrice: number;
  purchasedAt: Date;
  items: InvoiceItem[];
  purchased: boolean;
}

export interface InvoiceItem {
  invoiceItemId: string;
  ticketType: string;
  status: string;
  price: number;
  activatedAt: Date | null;
  expiredAt: Date | null;
  lineId: string;
  lineName: string;
  startStation: string;
  endStation: string;
  duration: number;
}
