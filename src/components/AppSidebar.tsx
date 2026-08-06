import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudRain,
  History,
  FileText,
  Images,
  Bell,
  BookOpen,
  Settings,
  Info,
  Mail,
  Waves,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  title: string;
  icon: React.ElementType;
  route?: string;
  section?: string;
  badge?: string;
}

const NAV: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, route: '/' },
  { title: 'Current Rainfall', icon: CloudRain, section: 'rainfall', badge: 'LIVE' },
  { title: 'Flood History', icon: History, route: '/historical' },
  { title: 'Reports', icon: FileText, route: '/reports' },
  { title: 'Gallery', icon: Images, section: 'imagery' },
  { title: 'Alerts', icon: Bell, section: 'alerts' },
  { title: 'White Papers', icon: BookOpen, route: '/research' },
  { title: 'Settings', icon: Settings, route: '/settings' },
  { title: 'About', icon: Info, route: '/research' },
  { title: 'Contact', icon: Mail, route: '/settings' },
];


interface AppSidebarProps {
  open: boolean;
  onNavigate?: () => void;
}

export function AppSidebar({ open, onNavigate }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleClick = (item: NavItem) => {
    if (item.section) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToSection(item.section!), 350);
      } else {
        scrollToSection(item.section);
      }
    } else if (item.route) {
      navigate(item.route);
    }
    onNavigate?.();
  };

  return (
    <aside
      className={`${
        open ? 'w-[248px]' : 'w-0 lg:w-[76px]'
      } shrink-0 transition-[width] duration-300 overflow-hidden bg-sidebar border-r border-sidebar-border flex flex-col`}
    >
      {/* Brand */}
      <div className="h-[76px] flex items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
          <Waves className="w-5 h-5 text-primary" />
        </div>
        <div className={`${open ? 'block' : 'hidden'} min-w-0`}>
          <h1 className="text-[17px] font-extrabold text-sidebar-foreground leading-tight truncate">Pakistan</h1>
          <p className="text-[11px] text-primary font-semibold truncate">Flood Risk Prediction</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2.5 space-y-0.5">
        {NAV.map((item) => {
          const isActive = item.route && location.pathname === item.route && !item.section;
          return (
            <button
              key={item.title}
              onClick={() => handleClick(item)}
              title={item.title}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/12 text-primary font-semibold border border-primary/25'
                  : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent border border-transparent'
              }`}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {open && (
                <>
                  <span className="text-[13.5px] truncate flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md bg-risk-high/15 text-risk-high text-[9px] font-mono font-bold tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {!item.badge && (
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {open && (
        <div className="m-2.5 p-3.5 rounded-xl bg-sidebar-accent border border-sidebar-border">
          <div className="text-[11px] font-semibold text-sidebar-foreground mb-2">Risk Overview</div>
          <div className="space-y-1.5 text-[10px] text-sidebar-muted font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
              NASA IMERG: Online
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
              NDMA Feed: Online
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
              ML Model v2.4: Active
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
