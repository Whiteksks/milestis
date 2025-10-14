'use client'

import {
  ArrowRightLeftIcon,
  CalendarClockIcon,
  ChartNoAxesCombinedIcon,
  ChartPieIcon,
  ChartSplineIcon,
  ClipboardListIcon,
  Clock9Icon,
  CrownIcon,
  HashIcon,
  SettingsIcon,
  SquareActivityIcon,
  Undo2Icon,
  UsersIcon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'


const menuConfig = [
  {
    label: null,
    items: [
      {
        icon: ChartNoAxesCombinedIcon,
        title: 'Dashboard',
        href: '#',
        badge: '5',
      },
    ],
  },
  {
    label: 'Pages',
    items: [
      { icon: ChartSplineIcon, title: 'Content Performance', href: '#' },
      { icon: UsersIcon, title: 'Audience Insight', href: '#' },
      { icon: ChartPieIcon, title: 'Engagement Metrics', href: '#' },
      { icon: HashIcon, title: 'Hashtag Performance', href: '#', badge: '3' },
      { icon: ArrowRightLeftIcon, title: 'Competitor Analysis', href: '#' },
      { icon: Clock9Icon, title: 'Campaign Tracking', href: '#' },
      { icon: ClipboardListIcon, title: 'Sentiment Tracking', href: '#' },
      { icon: CrownIcon, title: 'Influencer', href: '#' },
    ],
  },
  {
    label: 'Supporting Features',
    items: [
      { icon: SquareActivityIcon, title: 'Real Time Monitoring', href: '#' },
      { icon: CalendarClockIcon, title: 'Schedule Post & Calendar', href: '#' },
      { icon: Undo2Icon, title: 'Report & Export', href: '#' },
      { icon: SettingsIcon, title: 'Settings & Integrations', href: '#' },
      { icon: UsersIcon, title: 'User Management', href: '#' },
    ],
  },
]

const SidebarApp = () => {
  return (
    <Sidebar collapsible="icon" variant="floating" className="m-2 rounded-2xl h-auto">
      <SidebarContent>
        {menuConfig.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <SidebarMenuButton asChild>
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className="bg-primary/10 rounded-full">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export default SidebarApp
