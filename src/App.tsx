import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionBug } from "@/components/SessionBug";
import Index from "./pages/index";
import NotFound from "./pages/NotFound";
import PersonalizePage from "./pages/personalize/[edition]";
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { useModalStore } from "@/lib/modalStore";
import { useSessionStore } from "@/lib/sessionStore";
import { useEffect } from "react";
import SessionLoader from "@/components/SessionLoader";
import AdminSamplesPage from "./pages/admin/samples";
import AdminTestPage from "./pages/admin/test";
import AdminDashboard from "./pages/admin";
import AdminSeriesPage from "./pages/admin/series";
import AdminSeriesDetailPage from "./pages/admin/series/[id]";
import AdminAuth from "@/components/AdminAuth";
import FontExamplesPage from "./pages/font-examples";
import CardBuilderDemo from "./pages/card-builder-demo";
import StoryPreviewDemo from "./pages/story-preview-demo";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useSession } from '@/hooks/useSession';
import { useUser } from '@/hooks/useUser';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useStore } from '@/store';
import { AppRoutes } from '@/routes';
import { PersonalizationModal } from '@/components/personalization/PersonalizationModal';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isOnboardingOpen, openOnboarding, closeOnboarding } = useModalStore();
  const { session } = useSessionStore();

  return (
    <>
      <AppRoutes />
      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onClose={closeOnboarding}
        selectedSeries={session?.selectedEdition}
      />
      <PersonalizationModal />
      <SessionBug />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/personalize/:edition" element={<PersonalizePage />} />
        <Route path="/admin/test" element={<AdminTestPage />} />
        <Route path="/admin" element={
          <AdminAuth>
            <AdminDashboard />
          </AdminAuth>
        } />
        <Route path="/admin/samples" element={
          <AdminAuth>
            <AdminSamplesPage />
          </AdminAuth>
        } />
        <Route path="/admin/series" element={
          <AdminAuth>
            <AdminSeriesPage />
          </AdminAuth>
        } />
        <Route path="/admin/series/:id" element={
          <AdminAuth>
            <AdminSeriesDetailPage />
          </AdminAuth>
        } />
        <Route path="/font-examples" element={<FontExamplesPage />} />
        <Route path="/card-builder-demo" element={<CardBuilderDemo />} />
        <Route path="/story-preview-demo" element={<StoryPreviewDemo />} />
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
        <Router>
          <SessionLoader>
            <AppContent />
          </SessionLoader>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
