"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthLoading } from "./loading";
import { useUserStore } from "@/store/user-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { currentUser, isLoading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !currentUser) {
        router.push("/auth/login");
      } else if (!requireAuth && currentUser) {
        router.push("/");
      }
    }
  }, [isLoading, currentUser, requireAuth, router]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (requireAuth && !currentUser) {
    return null;
  }

  return <>{children}</>;
} 