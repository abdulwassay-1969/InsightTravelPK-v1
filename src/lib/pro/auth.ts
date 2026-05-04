import { SignJWT, jwtVerify } from "jose";

export const PRO_SESSION_COOKIE = "pro_session";
export const PRO_ROLE_COOKIE = "pro_role";

export type ProRole = "agent" | "admin";

export const PRO_DEMO_CREDENTIALS = {
  email: "demo@agency.com",
  password: "insighttravelpk2024",
} as const;

export const PRO_ADMIN_CREDENTIALS = {
  email: "admin@agency.com",
  password: "insighttravelpkAdmin2024",
} as const;

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "fallback_insighttravelpk_jwt_secret_dev_only";
  return new TextEncoder().encode(secret);
};

export async function createToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getJwtSecretKey());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (err) {
    return null;
  }
}

export function isValidAgentLogin(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized === PRO_DEMO_CREDENTIALS.email && password === PRO_DEMO_CREDENTIALS.password;
}

export function isValidAdminLogin(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized === PRO_ADMIN_CREDENTIALS.email && password === PRO_ADMIN_CREDENTIALS.password;
}

export function resolveRoleForEmail(email: string): ProRole {
  return email.trim().toLowerCase() === PRO_ADMIN_CREDENTIALS.email ? "admin" : "agent";
}

// Memory map for basic rate limiting
const loginAttempts = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(identifier: string): { success: boolean; error?: string } {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxAttempts = 5;

  let record = loginAttempts.get(identifier);
  if (record && now > record.expiresAt) {
    record = undefined;
  }

  if (!record) {
    loginAttempts.set(identifier, { count: 1, expiresAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= maxAttempts) {
    return { success: false, error: "Too many login attempts. Please try again in 5 minutes." };
  }

  record.count += 1;
  loginAttempts.set(identifier, record);
  return { success: true };
}
