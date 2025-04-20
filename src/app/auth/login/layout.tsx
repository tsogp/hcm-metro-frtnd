import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

export default function LoginLayout({ children }: PropsWithChildren) {
  return <>
    {children}
    <Toaster />
  </>
}
