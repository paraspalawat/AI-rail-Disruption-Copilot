import { useEffect, useState } from "react";
import RailLoader from "./components/ui/RailLoader";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PassengerLogin from "./pages/PassengerLogin";
import AdminLogin from "./pages/AdminLogin";
import PassengerDashboard from "./pages/PassengerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SystemReliability from "./pages/SystemReliability";
import SecurityPrivacy from "./pages/SecurityPrivacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <RailLoader />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/passenger-login" element={<PassengerLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/system-reliability" element={<SystemReliability />} />
            <Route path="/security-privacy" element={<SecurityPrivacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
