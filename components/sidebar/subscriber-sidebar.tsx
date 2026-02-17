"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Settings2,
  CreditCard,
  Send,
  Receipt,
  User,
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
    url: "/dashboard/subscriber",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/dashboard/subscriber",
      },
      {
        title: "Activity",
        url: "#",
      },
    ],
  },
  {
    title: "Transfers",
    url: "#",
    icon: Send,
    items: [
      {
        title: "Send Money",
        url: "#",
      },
      {
        title: "Transfer History",
        url: "#",
      },
    ],
  },
  {
    title: "Payments",
    url: "#",
    icon: CreditCard,
    items: [
      {
        title: "Pay Bills",
        url: "#",
      },
      {
        title: "Payment History",
        url: "#",
      },
    ],
  },
  {
    title: "Transactions",
    url: "#",
    icon: Receipt,
    items: [
      {
        title: "All Transactions",
        url: "#",
      },
      {
        title: "Receipts",
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
        title: "Profile",
        url: "#",
      },
      {
        title: "Security",
        url: "#",
      },
      {
        title: "Notifications",
        url: "#",
      },
    ],
  },
];

export function SubscriberSidebar({
  ...props
}: React.ComponentProps<typeof AppSidebar>) {
  const { user } = useUserStore();

  const teams: SidebarTeam[] = [
    {
      name: user?.name || "My Account",
      logo: User,
      plan: "Personal",
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
