import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { SessionBug } from "@/components/SessionBug";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonalizePage from "./pages/personalize/[edition]";
import OnboardingModal from "@/components/OnboardingModal";
import { useModalStore } from "@/lib/modalStore";
import { useSessionStore } from "@/lib/sessionStore";
import { useEffect } from "react";
import SessionLoader from "@/components/SessionLoader";
import AdminSamplesPage from "./pages/admin/samples";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isOnboardingOpen, openOnboarding, closeOnboarding } = useModalStore();
  const { session } = useSessionStore();

  return (
    <>
      <SessionBug />
      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onClose={closeOnboarding}
        selectedSeries={session?.selectedEdition}
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/personalize/:edition" element={<PersonalizePage />} />
        <Route path="/admin/samples" element={<AdminSamplesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionLoader>
            <AppContent />
          </SessionLoader>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
