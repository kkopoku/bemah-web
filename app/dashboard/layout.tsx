"use client";

import { GetSession } from "../actions/get-session";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useSyncUser } from "@/hooks/use-sync-user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setAccessToken, accessToken } = useAuthStore();

  useEffect(() => {
    async function fetchSession() {
      const session = await GetSession();
      setAccessToken(session?.user?.accessToken as string);
    }
    fetchSession();
  }, [setAccessToken]);

  useSyncUser(!!accessToken);

  return <>{children}</>;
}
