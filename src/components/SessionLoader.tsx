'use client';

import { useSessionStore } from '@/lib/sessionStore';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSessionManager } from '@/hooks/useSessionManager';
import { Button } from "@/components/ui/button";

export default function SessionLoader({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const {
        loadSessionFromUrlParam,
        loadError,
        resetSessionAndState
    } = useSessionManager();
    
    const {
        isLoading,
        isHydrated,
        session,
        setHydrated,
    } = useSessionStore((state) => ({
        isLoading: state.isLoading,
        isHydrated: state.isHydrated,
        session: state.session,
        setHydrated: state.setHydrated,
    }));

    // Add a timeout to prevent infinite loading
    const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        console.log('[SessionLoader] Component mounted with state:', {
            isLoading,
            isHydrated,
            hasSessionId: !!session.sessionId,
            hasSelectedEdition: !!session.selectedEdition,
            locationSearch: location.search
        });

        // Set a timeout to force hydration if loading takes too long
        const timeout = setTimeout(() => {
            console.log('[SessionLoader] Loading timeout reached, forcing hydration');
            if (!isHydrated) {
                setHydrated(true);
            }
        }, 5000); // 5 second timeout

        setLoadingTimeout(timeout);

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, []);

    useEffect(() => {
        const loadSession = async () => {
            console.log('[SessionLoader] Starting session load from URL param');
            try {
                const success = await loadSessionFromUrlParam();
                console.log('[SessionLoader] Session load result:', success);
                console.log('[SessionLoader] Final session state:', {
                    selectedEdition: session.selectedEdition,
                    currentStep: session.currentStep,
                    lastCompletedStep: session.lastCompletedStep
                });
            } catch (error) {
                console.error('[SessionLoader] Error loading session:', error);
            }
        };

        if (location.search) {
            loadSession();
        }
    }, [location.search, loadSessionFromUrlParam, session]);

    // Clear timeout when loading completes
    useEffect(() => {
        if (isHydrated && !isLoading && loadingTimeout) {
            console.log('[SessionLoader] Loading completed, clearing timeout');
            clearTimeout(loadingTimeout);
            setLoadingTimeout(null);
        }
    }, [isHydrated, isLoading, loadingTimeout]);

    if (isLoading || !isHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading your session...</span>
            </div>
        );
    }

    if (loadError) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-10">
            <h1 className="text-2xl font-bold text-legacy-red">Session Load Error</h1>
            <p className="mt-2 mb-4 text-muted-foreground">
              {loadError.message || "We couldn't find your session. Your link may have expired or is invalid."}
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                console.log('[SessionLoader] User clicked Start Over from error screen.');
                resetSessionAndState();
              }}
            >
              Start Over
            </Button>
          </div>
        );
      }

    return <>{children}</>;
} 