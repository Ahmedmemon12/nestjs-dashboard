"use client";

import {
  LayoutDashboard,
  Users,
  Database,
  BarChart3,
  CalendarDays,
  Settings,
  Building2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "User & Dataset Management", url: "/users", icon: Users },
  { title: "User Data", url: "/user-data", icon: Database },
  { title: "Datasets", url: "/datasets", icon: Database },
  { title: "Analytics & Reports", url: "/analytics", icon: BarChart3 },
  { title: "Event Management", url: "/events", icon: CalendarDays },
  { title: "Service Directory", url: "/directory", icon: Building2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="px-2 py-1 text-sm font-semibold">Admin Console</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-xs text-muted-foreground px-2 py-1">
        <div>{"Press ⌘/Ctrl + B to toggle"}</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
