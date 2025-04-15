import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionBug } from "@/components/SessionBug";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonalizePage from "./pages/personalize/[edition]";
import OnboardingModal from "@/components/OnboardingModal";
import { useModalStore } from "@/lib/modalStore";
import { useSessionStore } from "@/lib/sessionStore";

const queryClient = new QueryClient();

const App = () => {
  const { isOnboardingOpen, closeOnboarding } = useModalStore();
  const { session } = useSessionStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionBug />
          <OnboardingModal 
            isOpen={isOnboardingOpen}
            onClose={closeOnboarding}
            selectedSeries={session?.selectedEdition}
          />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/personalize/:edition" element={<PersonalizePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
