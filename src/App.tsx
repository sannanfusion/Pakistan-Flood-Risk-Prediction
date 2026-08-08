import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import Index from "./pages/Index";
import Historical from "./pages/Historical";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import Rainfall from "./pages/Rainfall";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import WhitePaper from "./pages/White Paper";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      <AppSidebar open={sidebarOpen} />
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} alertCount={5} />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 py-6">{children}</div>
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/rainfall" element={<AppLayout><Rainfall /></AppLayout>} />
          <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
          <Route path="/gallery" element={<AppLayout><Gallery /></AppLayout>} />
          <Route path="/historical" element={<AppLayout><Historical /></AppLayout>} />
          <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
          <Route path="/research" element={<AppLayout><WhitePaper /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
