import { useEffect, useState } from 'react';
import { Menu, Search, FileDown, Bell, Moon, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onToggleSidebar: () => void;
  alertCount?: number;
}

export function TopBar({ onToggleSidebar, alertCount = 0 }: TopBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="h-[60px] sm:h-[76px] shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 bg-card border-b border-border sticky top-0 z-30 lg:static">
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle navigation"
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Menu className="w-[18px] h-[18px]" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-[420px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          id="global-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search District or City..."
          className="w-full h-11 pl-10 pr-14 rounded-xl bg-muted/70 border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-shadow"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground border border-border rounded-md px-1.5 py-0.5">
          ⌘K
        </span>
      </div>

      <div className="flex-1" />

      <button
        onClick={() => navigate('/reports')}
        className="hidden sm:flex items-center gap-2 h-11 px-4 rounded-xl bg-muted/70 border border-border text-[13px] font-medium text-foreground hover:bg-muted transition-colors"
      >
        <FileDown className="w-4 h-4 text-primary" />
        Report
      </button>

      <button
        onClick={() => document.getElementById('alerts')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Alerts"
        className="relative w-11 h-11 rounded-xl bg-muted/70 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className="w-[18px] h-[18px]" />
        {alertCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-risk-high text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
            {alertCount}
          </span>
        )}
      </button>

      <div
        aria-hidden
        className="hidden sm:flex w-11 h-11 rounded-xl bg-muted/70 border border-border items-center justify-center text-muted-foreground"
      >
        <Moon className="w-[18px] h-[18px]" />
      </div>

      <button
        onClick={() => navigate('/settings')}
        className="flex items-center gap-1.5 h-11 pl-1.5 pr-2.5 rounded-xl bg-muted/70 border border-border hover:bg-muted transition-colors"
      >
        <span className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </header>
  );
}
