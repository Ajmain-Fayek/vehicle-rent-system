declare module "express-serve-static-core" {
  interface Request {
    validatedPayload?: Record<string, string>;
    role: string;
    userId: number;
    userEmail: string;
    sanitizedUpdatingPayload: Record<string, string>;
  }
}
export type Role = "admin" | "customer";
export type TvehicleStatus = "available" | "booked";
export type TbookingStatus = "active" | "cancelled" | "returned";
export type TvehicleType = "car" | "bike" | "van" | "SUV";
export type Ttables = "vehicles" | "users" | "bookings";
export type TdeleteColumn = "vehicle_id" | "customer_id" | "booking_id";
export type TableColumns = {
  users: {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
  };
  vehicles: {
    id: number;
    vehicle_name: string;
    type: TvehicleType;
    registration_number: string;
    daily_rent_price: number;
    availability_status: TvehicleStatus;
  };
  bookings: {
    id: number;
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
    total_price: number;
    status: TbookingStatus;
  };
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

export interface RoleHierarchy {
  admin: Role[];
  customer: Role[];
}

export const roleHierarchy: RoleHierarchy = {
  admin: ["customer"],
  customer: [],
};
