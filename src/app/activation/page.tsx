import { Suspense } from "react";
import TicketActivationPage from "./ticket-activation";

export default function ActivationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketActivationPage />
    </Suspense>
  );
}
