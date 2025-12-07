declare module "express-serve-static-core" {
  interface Request {
    validatedPayload?: Record<string, string>;
    role: string;
    userId: number;
    sanitizedUpdatingPayload: Record<string, string>;
  }
}

export type Ttables = "vehicles" | "users" | "bookings";
export type TdeleteColumn = "vehicle_id" | "user_id";
export type TableColumns = {
  users: "id" | "name" | "email" | "password" | "phone" | "role";
  vehicles: "id" | "vehicle_name" | "type" | "registration_number" | "daily_rent_price" | "availability_status";
  bookings: "id" | "customer_id" | "vehicle_id" | "rent_start_date" | "rent_end_date" | "total_price" | "status";
};

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
