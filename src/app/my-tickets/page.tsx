import { Suspense } from "react";
import { ActiveInvoiceItemSection } from "./_components/section/active-invoice-item-section";
import { InactiveInvoiceItemSection } from "./_components/section/inactive-invoice-item-section";
import { ExpiredInvoiceItemSection } from "./_components/section/expired-invoice-item-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circle, Ticket } from "lucide-react";

export default function InvoiceItemPage() {
  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center gap-2">
        <Ticket className="size-10" />
        <h1 className="text-2xl font-bold">My Tickets</h1>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="text-md font-bold">
              <Circle className="size-4 mr-1" strokeWidth={0} fill="green" />
              Active
            </TabsTrigger>
            <TabsTrigger value="inactive" className="text-md font-bold">
              <Circle className="size-4 mr-1" strokeWidth={0} fill="gray" />
              In-active
            </TabsTrigger>
            <TabsTrigger value="expired" className="text-md font-bold">
              <Circle className="size-4 mr-1" strokeWidth={0} fill="red" />
              Expired
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Suspense
              fallback={
                <div className="h-64 flex items-center justify-center">
                  Loading active tickets...
                </div>
              }
            >
              <ActiveInvoiceItemSection />
            </Suspense>
          </TabsContent>

          <TabsContent value="inactive">
            <Suspense
              fallback={
                <div className="h-64 flex items-center justify-center">
                  Loading inactive tickets...
                </div>
              }
            >
              <InactiveInvoiceItemSection />
            </Suspense>
          </TabsContent>

          <TabsContent value="expired">
            <Suspense
              fallback={
                <div className="h-64 flex items-center justify-center">
                  Loading expired tickets...
                </div>
              }
            >
              <ExpiredInvoiceItemSection />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
