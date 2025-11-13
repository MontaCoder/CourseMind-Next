/**
 * Shared User type definitions
 */

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  subscriptions: {
    id: string;
    plan: string;
    status: string;
  }[];
  _count: {
    courses: number;
  };
}

export interface UserWithSubscription {
  id: string;
  name: string;
  email: string;
  role: string;
  subscriptions: {
    id: string;
    plan: "FREE" | "MONTHLY" | "YEARLY";
    status: "ACTIVE" | "CANCELED" | "EXPIRED" | "INCOMPLETE";
    currentPeriodEnd: Date | null;
  }[];
  _count: {
    courses: number;
  };
}

export type UserRole = "USER" | "ADMIN";
