"use server";

import { cookies } from "next/headers";
import { 
  PRO_SESSION_COOKIE, 
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

  try {
    const role = resolveRoleForEmail(email);
    const token = await createToken({ email, role, sessionType: "pro" });

    const cookieStore = await cookies();

    cookieStore.set(PRO_SESSION_COOKIE, token, {
      path: "/",
      maxAge: 86400,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return { success: true, role };
  } catch (error) {
    console.error("Login session setup failed:", error);
    return { error: "Login succeeded, but session setup failed. Check JWT_SECRET and server cookies." };
  }
}
