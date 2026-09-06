import { useState, useEffect, lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeProvider } from "@/lib/theme";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import Index from "./pages/Index";

// Secondary pages load on demand so the dashboard starts faster
const Historical = lazy(() => import("./pages/Historical"));
const Reports = lazy(() => import("./pages/Reports"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const Rainfall = lazy(() => import("./pages/Rainfall"));
const Contact = lazy(() => import("./pages/Contact"));
const Gallery = lazy(() => import("./pages/Gallery"));
const WhitePaper = lazy(() => import("./pages/White Paper"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div className="space-y-4">
    <div className="h-8 w-52 rounded-xl bg-muted animate-pulse" />
    <div className="h-40 rounded-2xl bg-muted animate-pulse" />
    <div className="h-64 rounded-2xl bg-muted animate-pulse" />
  </div>
);

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="min-h-[100dvh] lg:h-screen flex w-full bg-background lg:overflow-hidden">
      <AppSidebar open={sidebarOpen} onNavigate={() => isMobile && setSidebarOpen(false)} />
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="flex-1 flex flex-col min-w-0 w-full">
        <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} alertCount={5} />
        <div className="flex-1 lg:overflow-y-auto scrollbar-thin">
          <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 py-4 sm:py-6">{children}</div>
        </div>
      </main>
    </div>
  );
};


const App = () => (
  <ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/rainfall" element={<AppLayout><Suspense fallback={<PageFallback />}><Rainfall /></Suspense></AppLayout>} />
            <Route path="/contact" element={<AppLayout><Suspense fallback={<PageFallback />}><Contact /></Suspense></AppLayout>} />
            <Route path="/gallery" element={<AppLayout><Suspense fallback={<PageFallback />}><Gallery /></Suspense></AppLayout>} />
            <Route path="/historical" element={<AppLayout><Suspense fallback={<PageFallback />}><Historical /></Suspense></AppLayout>} />
            <Route path="/reports" element={<AppLayout><Suspense fallback={<PageFallback />}><Reports /></Suspense></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Suspense fallback={<PageFallback />}><SettingsPage /></Suspense></AppLayout>} />
            <Route path="/research" element={<AppLayout><Suspense fallback={<PageFallback />}><WhitePaper /></Suspense></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
