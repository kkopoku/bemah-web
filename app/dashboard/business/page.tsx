"use client";

import { GetStarted } from "@/components/get-started";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboardingStatus } from "@/hooks/use-onboarding";
import { useUserStore } from "@/stores/user.store";

export default function BusinessDashboardPage() {
  const { user } = useUserStore();
  const business = user?.businessAdmin?.business;
  const businessId = business?.id;
  const needsOnboarding = business?.status === "PENDING_ADMIN_APPROVAL";

  const onboardingStatus = useOnboardingStatus(!!businessId && needsOnboarding);

  const isLoading = !user || (needsOnboarding && onboardingStatus.isLoading);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (needsOnboarding && onboardingStatus.data && businessId) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <GetStarted status={onboardingStatus.data} businessId={businessId} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
