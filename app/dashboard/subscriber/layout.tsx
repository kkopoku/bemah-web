"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SubscriberSidebar } from "@/components/sidebar/subscriber-sidebar";
import { Separator } from "@/components/ui/separator";

export default function SubscriberDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // If user is a business admin (not a subscriber), redirect them away
    if (user.businessAdmin && !user.subscriber) {
      router.replace("/dashboard/business");
    }
  }, [user, router]);

  // Don't render subscriber dashboard for business users
  if (user && user.businessAdmin && !user.subscriber) {
    return null;
  }

  return (
    <SidebarProvider>
      <SubscriberSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
