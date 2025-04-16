'use client';

import { useSessionStore } from '@/lib/sessionStore';
import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useSessionManager } from '@/hooks/useSessionManager';
import { Button } from "@/components/ui/button";

export default function SessionLoader({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const {
        loadSessionFromUrlParam,
        loadError,
        resetSessionAndState
    } = useSessionManager();
    
    const { isLoading, isHydrated } = useSessionStore(state => ({ 
        isLoading: state.isLoading,
        isHydrated: state.isHydrated
    }));

    useEffect(() => {
        console.log('[SessionLoader] Location changed or mounted, attempting session load from URL...');
        loadSessionFromUrlParam();
    }, [location.search, loadSessionFromUrlParam]);

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