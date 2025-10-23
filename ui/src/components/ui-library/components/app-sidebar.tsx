"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpenText,
  Command,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  Home,
  Bell,
  Search,
  GraduationCap,
  FolderOpen,
  Tag,
  Users,
  User,
  Cog,
  Trophy,
  HelpCircle,
  FileText,
  MessageSquare,
  Bug,
  Heart,
} from "lucide-react"

import { NavMain, NavMainItems } from "@/components/ui-library/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { BrandLogo } from "./brand-logo"
import { TeamSwitcher } from "./team-switcher"

const workspaceItems: NavMainItems[] = [
  {
    title: "Home",
    url: "/:team",
    icon: Home,
  },
  {
    title: "Notifications",
    url: "/:team/notifications",
    icon: Bell,
  },
  {
    title: "Search",
    url: "/:team/search",
    icon: Search,
  },
]

const learningStructureItems: NavMainItems[] = [
  {
    title: "Units",
    url: "/:team/units",
    icon: Frame,
  },
  {
    title: "Chapters",
    url: "/:team/chapter",
    icon: BookOpenText,
  },
  {
    title: "Courses",
    url: "/:team/course",
    icon: GraduationCap,
  },
]

const collaborationItems: NavMainItems[] = [
  {
    title: "Team",
    icon: Users,
    url: "",
    items: [
      {
        title: "Members",
        url: "/:team/team/members",
        icon: Users,
      },
      {
        title: "Settings",
        url: "/:team/team/settings",
        icon: Settings2,
      },
    ],
  },
  {
    title: "Profile",
    icon: User,
    url: "",
    items: [
      {
        title: "My Account",
        url: "/:team/profile/account",
        icon: User,
      },
      {
        title: "Preferences",
        url: "/:team/profile/preferences",
        icon: Cog,
      },
      {
        title: "Achievements",
        url: "/:team/profile/achievements",
        icon: Trophy,
      },
    ],
  },
];

const helpSupportItems: NavMainItems[] = [
  {
    title: "Docs",
    url: "/help/docs",
    icon: FileText,
  },
  {
    title: "FAQ",
    url: "/help/faq",
    icon: HelpCircle,
  },
  {
    title: "Report Issue",
    url: "/help/report-issue",
    icon: Bug,
  },
  {
    title: "Feedback",
    url: "/help/feedback",
    icon: Heart,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="left-4 top-4 h-[calc(100%-theme(spacing.4)*2)] [&_[data-sidebar='sidebar']]:rounded-xl group-data-[side=left]:border-r-0 bg-transparent">
      <SidebarHeader className="h-16 flex items-center justify-center">
        <BrandLogo />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={workspaceItems} title="Dashboard" /> */}
        {/* <NavMain items={learningStructureItems} title="Learning Structure" /> */}
        <NavMain items={learningStructureItems} />
        <NavMain items={collaborationItems} title="Collaboration" />
        <NavMain items={helpSupportItems} title="Help and Support" />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <TeamSwitcher />
        {/* <NavUser /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
