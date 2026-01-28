import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

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
          <Route
  path="/consent"
  element={
    <ProtectedRoute>
      <Consent />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/new-claim"
  element={
    <ProtectedRoute>
      <NewClaim />
    </ProtectedRoute>
  }
/>

<Route
  path="/claim-processing"
  element={
    <ProtectedRoute>
      <ClaimProcessing />
    </ProtectedRoute>
  }
/>

<Route
  path="/claim-decision"
  element={
    <ProtectedRoute>
      <ClaimDecision />
    </ProtectedRoute>
  }
/>

<Route
  path="/claim-dossier"
  element={
    <ProtectedRoute>
      <ClaimDossier />
    </ProtectedRoute>
  }
/>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
