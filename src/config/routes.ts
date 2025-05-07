export const ROUTES = {
  // Public routes (accessible to everyone)
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  TICKET_INFO: "/ticket-info",
  STATION_INFO: "/station-info",
  SCHEDULE: "/schedule",

  // Guest-only routes (only accessible when not logged in)
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },

  // Protected routes (require authentication)
  PROFILE: {
    ROOT: "/profile",
    EDIT: "/profile/edit",
    SETTINGS: "/profile/settings",
  },
  PAYMENT: {
    ROOT: "/payment",
    HISTORY: "/payment/history",
    TOP_UP: "/payment/top-up",
  },
  TICKET: {
    ROOT: "/ticket",
    PURCHASE: "/ticket/purchase",
    MY_TICKETS: "/ticket/my-tickets",
  },
} as const;

// Helper functions to check route types
export const isProtectedRoute = (path: string): boolean => {
  return (
    path.startsWith(ROUTES.PROFILE.ROOT) ||
    path.startsWith(ROUTES.PAYMENT.ROOT) ||
    path.startsWith(ROUTES.TICKET.ROOT)
  );
};

export const isGuestOnlyRoute = (path: string): boolean => {
  return (
    path.startsWith(ROUTES.AUTH.LOGIN) ||
    path.startsWith(ROUTES.AUTH.REGISTER) ||
    path.startsWith(ROUTES.AUTH.FORGOT_PASSWORD)
  );
};

export const isPublicRoute = (path: string): boolean => {
  return !isProtectedRoute(path) && !isGuestOnlyRoute(path);
}; 