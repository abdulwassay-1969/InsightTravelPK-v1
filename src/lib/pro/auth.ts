export const PRO_SESSION_COOKIE = "pro_session";
export const PRO_ROLE_COOKIE = "pro_role";

export type ProRole = "agent" | "admin";

export const PRO_DEMO_CREDENTIALS = {
  email: "demo@agency.com",
  password: "pakvista2024",
} as const;

export const PRO_ADMIN_CREDENTIALS = {
  email: "admin@agency.com",
  password: "pakvistaAdmin2024",
} as const;

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

export function isProUser(sessionValue?: string | null): boolean {
  return sessionValue === "demo";
}

export function isProAdmin(roleValue?: string | null): boolean {
  return roleValue === "admin";
}

export function isProAgent(roleValue?: string | null): boolean {
  return roleValue === "agent";
}
