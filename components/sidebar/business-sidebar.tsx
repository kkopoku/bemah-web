"use client";

import * as React from "react";
import {
  Building2,
  LayoutDashboard,
  Settings2,
  Users,
  CreditCard,
  FileText,
  GalleryVerticalEnd,
} from "lucide-react";
import {
  AppSidebar,
  type SidebarNavItem,
  type SidebarTeam,
} from "@/components/sidebar/app-sidebar";
import { useUserStore } from "@/stores/user.store";

const navItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/business",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/dashboard/business",
      },
      {
        title: "Analytics",
        url: "#",
      },
    ],
  },
  {
    title: "Transactions",
    url: "#",
    icon: CreditCard,
    items: [
      {
        title: "All Transactions",
        url: "#",
      },
      {
        title: "Pending",
        url: "#",
      },
      {
        title: "Settlements",
        url: "#",
      },
    ],
  },
  {
    title: "Customers",
    url: "#",
    icon: Users,
    items: [
      {
        title: "All Customers",
        url: "#",
      },
      {
        title: "Subscribers",
        url: "#",
      },
    ],
  },
  {
    title: "Reports",
    url: "#",
    icon: FileText,
    items: [
      {
        title: "Financial Reports",
        url: "#",
      },
      {
        title: "Activity Logs",
        url: "#",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Team",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
    ],
  },
];

export function BusinessSidebar({
  ...props
}: React.ComponentProps<typeof AppSidebar>) {
  const { user } = useUserStore();

  const businessName =
    user?.businessAdmin?.business?.name || "My Business";

  const teams: SidebarTeam[] = [
    {
      name: businessName,
      logo: user?.businessAdmin?.business
        ? Building2
        : GalleryVerticalEnd,
      plan: user?.businessAdmin?.business?.businessType || "Business",
    },
  ];

  const sidebarUser = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: "",
  };

  return (
    <AppSidebar
      navItems={navItems}
      user={sidebarUser}
      teams={teams}
      {...props}
    />
  );
}
