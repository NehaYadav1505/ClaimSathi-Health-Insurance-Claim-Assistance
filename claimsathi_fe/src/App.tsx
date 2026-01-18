import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Consent from "./pages/Consent";
import Dashboard from "./pages/Dashboard";
import NewClaim from "./pages/NewClaim";
import ClaimProcessing from "./pages/ClaimProcessing";
import ClaimDecision from "./pages/ClaimDecision";
import ClaimDossier from "./pages/ClaimDossier";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-claim" element={<NewClaim />} />
          <Route path="/claim-processing" element={<ClaimProcessing />} />
          <Route path="/claim-decision" element={<ClaimDecision />} />
          <Route path="/claim-dossier" element={<ClaimDossier />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
