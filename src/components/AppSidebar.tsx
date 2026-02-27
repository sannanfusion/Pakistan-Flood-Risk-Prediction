import { LayoutDashboard, History, FileText, Settings, Droplets, Activity } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const mainItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Historical', url: '/historical', icon: History },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <div className="p-2 rounded-xl bg-primary shrink-0">
          <Droplets className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-foreground truncate">FloodWatch</h1>
            <p className="text-[10px] text-muted-foreground font-mono">Pakistan Intel</p>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                      activeClassName="bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary hover:text-primary-foreground"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4 mx-3 mb-3 rounded-xl bg-muted border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-semibold text-foreground">System Status</span>
            </div>
            <div className="space-y-1.5 text-[10px] text-muted-foreground font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                NASA IMERG: Online
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                NDMA Feed: Online
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                ML Model v2.4: Active
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
