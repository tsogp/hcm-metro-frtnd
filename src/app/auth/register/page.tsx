import { Suspense } from "react";
import RegisterPage from "./register-page";

export default function RegisterPageSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}
