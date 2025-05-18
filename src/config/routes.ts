export const ROUTES = {
  LANDING: "/",
  DASHBOARD: "/dashboard",

  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  PROFILE: {
    ROOT: "/profile",
  },

  PAYMENT: {
    ROOT: "/payment",
    HISTORY: "/payment/history",
    TOP_UP: "/payment/top-up",
  },

  INVOICES: {
    ROOT: "/invoices",
  },
} as const;

// // Helper functions to check route types
// export const isProtectedRoute = (path: string): boolean => {
//   return (
//     path.startsWith(ROUTES.PROFILE.ROOT) ||
//     path.startsWith(ROUTES.PAYMENT.ROOT)
//   );
// };
