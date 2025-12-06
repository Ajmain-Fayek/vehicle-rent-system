import jwt from "jsonwebtoken";
import envConfig from "../config/env.config";
import { TUser } from "../types/types";

/**
 * Generate a JWT token for a user.
 *
 * @param data - User object containing:
 *   - id: number
 *   - name: string
 *   - email: string
 *   - phone: string
 *   - role: string
 * @returns Signed JWT token string
 */

export const generateJwtToken = (data: TUser): string => {
  return jwt.sign({ ...data }, envConfig.jwtPrivateSecret, { algorithm: "RS512", expiresIn: "1d" });
};
