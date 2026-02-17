"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export interface SidebarNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface SidebarTeam {
  name: string;
  logo: React.ElementType;
  plan: string;
}

export interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navItems: SidebarNavItem[];
  user: SidebarUser;
  teams?: SidebarTeam[];
}

export function AppSidebar({
  navItems,
  user,
  teams,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {teams && teams.length > 0 && (
        <SidebarHeader>
          <TeamSwitcher teams={teams} />
        </SidebarHeader>
      )}
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
