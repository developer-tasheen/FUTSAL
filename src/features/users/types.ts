export const userRoles = ["CUSTOMER", "ADMIN"] as const;

export type UserRole = (typeof userRoles)[number];

export type UserProfile = {
  id: string;
  name: string;
  email?: string;
  mobileNumber: string;
  role: UserRole;
};
