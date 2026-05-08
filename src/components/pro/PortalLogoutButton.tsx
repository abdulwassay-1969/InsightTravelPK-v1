"use client";

import { useRouter } from "next/navigation";
import { PRO_SESSION_COOKIE } from "@/lib/pro/auth";

type PortalLogoutButtonProps = {
  redirectTo: string;
  label?: string;
  className?: string;
};

export default function PortalLogoutButton({
  redirectTo,
  label = "Logout",
  className,
}: PortalLogoutButtonProps) {
  const router = useRouter();

  function handleLogout() {
    document.cookie = `${PRO_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {label}
    </button>
  );
}
