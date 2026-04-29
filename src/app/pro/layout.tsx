"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import ProSidebar from "@/components/pro/ProSidebar";
import ProTopbar from "@/components/pro/ProTopbar";
import { MOCK_AGENCY } from "@/lib/pro/mockData";

export default function ProLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/pro/login";

  useEffect(() => {
    if (isLoginPage) return;

    const header = document.querySelector("body > header") as HTMLElement | null;
    const footer = document.querySelector("body > footer") as HTMLElement | null;

    const prevHeaderDisplay = header?.style.display ?? "";
    const prevFooterDisplay = footer?.style.display ?? "";

    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";

    return () => {
      if (header) header.style.display = prevHeaderDisplay;
      if (footer) footer.style.display = prevFooterDisplay;
    };
  }, [isLoginPage]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px]">
        <ProSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <ProTopbar agencyName={MOCK_AGENCY.name} plan={MOCK_AGENCY.plan} />

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
