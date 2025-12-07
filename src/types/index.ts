declare module "express-serve-static-core" {
  interface Request {
    validatedPayload?: Record<string, string>;
    role: string;
    userId: number;
    sanitizedUpdatingPayload: Record<string, string>;
  }
}

export interface TApiResponse {
  success: boolean;
  message: string | [message: string, errors: string];
  errors?: string;
}

export interface TApiResponseWithPayload<T> extends TApiResponse {
  data: T;
}

export interface TUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export type Role = "admin" | "customer";

export interface RoleHierarchy {
  admin: Role[];
  customer: Role[];
}

export const roleHierarchy: RoleHierarchy = {
  admin: ["customer"],
  customer: [],
};
