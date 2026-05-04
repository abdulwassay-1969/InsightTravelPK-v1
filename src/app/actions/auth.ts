"use server";

import { cookies } from "next/headers";
import { 
  PRO_SESSION_COOKIE, 
  PRO_ROLE_COOKIE, 
  isValidAdminLogin, 
  isValidAgentLogin, 
  resolveRoleForEmail, 
  createToken, 
  checkRateLimit 
} from "@/lib/pro/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const type = formData.get("type")?.toString() || "agent";

  // Rate Limiting check based on email
  const rateLimitResult = checkRateLimit(email);
  if (!rateLimitResult.success) {
    return { error: rateLimitResult.error };
  }

  let isValid = false;
  if (type === "admin") {
    isValid = isValidAdminLogin(email, password);
  } else {
    isValid = isValidAgentLogin(email, password);
  }

  if (!isValid) {
    return { error: `Invalid ${type} credentials.` };
  }

  const role = resolveRoleForEmail(email);

  // Create JWT instead of plain text string
  const token = await createToken({ email, role, sessionType: "pro" });

  const cookieStore = await cookies();
  
  cookieStore.set(PRO_SESSION_COOKIE, token, {
    path: "/",
    maxAge: 86400, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  // We still keep role cookie for easy client-side UI toggles, but NEVER trust it for auth
  cookieStore.set(PRO_ROLE_COOKIE, role, {
    path: "/",
    maxAge: 86400,
    httpOnly: false, // Accessible by client JS if needed for UI, but not trusted by middleware
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  return { success: true, role };
}
