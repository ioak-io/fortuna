"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTypedParams } from "../hooks/useTypedParams"
import { CommonParams } from "@/types/params/CommonParams"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui-library/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui-library/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"

export type NavMainProps = {
  items: NavMainItems[];
  title?: string;
}

export type NavMainItems = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}

export function NavMain({ items, title }: NavMainProps) {
  const { team } = useTypedParams<CommonParams>()
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar();

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveSubItem = item.items?.some(subItem => {
            const resolvedUrl = subItem.url.replace(":team", team)
            return resolvedUrl === pathname
          })

          // const buttonClasses = hasActiveSubItem
          //   ? "bg-sidebar-accent text-sidebar-accent-foreground"
          //   : ""
          const buttonClasses = hasActiveSubItem
            ? "text-sidebar-accent-foreground"
            : ""

          if (sidebarState === "collapsed" && item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={buttonClasses}
                    >
                      {item.icon && <item.icon />}
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    {item.items.map((subItem) => {
                      const resolvedUrl = subItem.url.replace(":team", team)
                      const isActive = resolvedUrl === pathname
                      return (
                        <DropdownMenuItem asChild key={subItem.title}>
                          <Link
                            href={resolvedUrl}
                            className={`flex items-center gap-2 ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                              }
                              focus:bg-sidebar-accent focus:text-sidebar-accent-foreground`}
                          >
                            {subItem.icon && (
                              <subItem.icon
                                className={`h-4 w-4 ${isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground"
                                  }`}
                              />
                            )}
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )
          }

          // If item has nested items, render as collapsible
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={hasActiveSubItem || item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={buttonClasses}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const resolvedUrl = subItem.url.replace(":team", team)
                        const isActive = resolvedUrl === pathname
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={`flex items-center gap-2 [&>svg]:text-inherit ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                            >
                              <Link href={resolvedUrl} className="flex items-center gap-2">
                                {subItem.icon && (
                                  <subItem.icon
                                    className={`h-4 w-4`}
                                  />
                                )}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          // If item has no nested items, render as direct link
          const resolvedUrl = item.url.replace(":team", team)
          const isActive = resolvedUrl === pathname
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`flex items-center gap-2 [&>svg]:text-inherit ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
              >
                <Link href={resolvedUrl} className="flex items-center gap-2">
                  {item.icon && (
                    <item.icon
                      className={`h-4 w-4`}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}