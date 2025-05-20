import { Suspense } from "react";
import LoginPage from "./login-page";

export default function LoginPageSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
