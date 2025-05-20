export const ROUTES = {
  LANDING: "/",
  DASHBOARD: "/dashboard",
  ABOUT: "/about",

  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  METRO_EXPLORER: {
    ROOT: "/metro-explorer",
  },

  PROFILE: {
    ROOT: "/profile",
  },

  PAYMENT: {
    ROOT: "/payment",
  },

  INVOICE: {
    ROOT: "/invoices",
  },

  TICKET: {
    ROOT: "/my-tickets",
  },

  ACTIVATION: {
    ROOT: "/activation",
  },

  GUEST: {
    ROOT: "/guest",
  },
} as const;

// // Helper functions to check route types
// export const isProtectedRoute = (path: string): boolean => {
//   return (
//     path.startsWith(ROUTES.PROFILE.ROOT) ||
//     path.startsWith(ROUTES.PAYMENT.ROOT)
//   );
// };
