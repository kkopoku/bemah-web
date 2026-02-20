"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (user.businessAdmin) {
      router.replace("/dashboard/business");
    } else if (user.subscriber) {
      router.replace("/dashboard/subscriber");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 w-full max-w-md px-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
