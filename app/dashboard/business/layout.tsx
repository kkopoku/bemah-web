"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BusinessSidebar } from "@/components/sidebar/business-sidebar";
import { Separator } from "@/components/ui/separator";

export default function BusinessDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // If user is a subscriber (not a business admin), redirect them away
    if (user.subscriber && !user.businessAdmin) {
      router.replace("/dashboard/subscriber");
    }
  }, [user, router]);

  // Don't render business dashboard for subscriber users
  if (user && user.subscriber && !user.businessAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <BusinessSidebar />
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
