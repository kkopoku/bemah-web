"use client";

import { useUserStore } from "@/stores/user.store";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriberDashboardPage() {
  const { user } = useUserStore();

  if (!user) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {user.name}
        </h1>
        <p className="text-muted-foreground">Your personal dashboard</p>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
