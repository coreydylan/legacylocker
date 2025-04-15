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
import { loadSessionFromSupabase } from "@/lib/sessionService";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isOnboardingOpen, openOnboarding, closeOnboarding } = useModalStore();
  const { session } = useSessionStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      console.log(`Found session_id in URL: ${sessionId}, attempting to load...`);
      loadSessionFromSupabase(sessionId).then((sessionData) => {
        if (sessionData) {
          console.log('Session loaded successfully, opening onboarding modal.');
          openOnboarding();
        } else {
          console.log('Failed to load session from session_id in URL.');
        }
      });
    }
  }, [searchParams, openOnboarding]);

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
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
