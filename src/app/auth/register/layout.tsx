import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

export default function RegisterLayout({ children }: PropsWithChildren) {
  return <>
    {children}
    <Toaster />
  </>
}
