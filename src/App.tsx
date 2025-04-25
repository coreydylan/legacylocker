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
import AdminTestPage from "./pages/admin/test";
import AdminDashboard from "./pages/admin";
import AdminSeriesPage from "./pages/admin/series";
import AdminSeriesDetailPage from "./pages/admin/series/[id]";
import AdminAuth from "@/components/AdminAuth";
import FontExamplesPage from "./pages/font-examples";
import CardBuilderDemo from "./pages/card-builder-demo";
import StoryPreviewDemo from "./pages/story-preview-demo";
import DevOverlayEditor from "@/components/DevOverlayEditor";
import AdminPromoCodesPage from "./pages/admin/promo-codes";
import AdminOrdersListPage from "./pages/admin/orders/index";
import AdminOrderDetailPage from "./pages/admin/orders/[id]";
import AdminProductionQueuePage from "./pages/admin/orders/production";

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
        <Route path="/admin/promo-codes" element={
          <AdminAuth>
            <AdminPromoCodesPage />
          </AdminAuth>
        } />
        <Route path="/admin/orders" element={
          <AdminAuth>
            <AdminOrdersListPage />
          </AdminAuth>
        } />
        <Route path="/admin/orders/:id" element={
          <AdminAuth>
            <AdminOrderDetailPage />
          </AdminAuth>
        } />
        <Route path="/admin/orders/production" element={
          <AdminAuth>
            <AdminProductionQueuePage />
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
  const isDev = import.meta.env.DEV;
  const params = new URLSearchParams(window.location.search);
  const editMode = params.get('editMode') === 'true';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionLoader>
            {isDev && editMode ? (
              <DevOverlayEditor>
                <AppContent />
              </DevOverlayEditor>
            ) : (
              <AppContent />
            )}
          </SessionLoader>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
