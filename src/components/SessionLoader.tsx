'use client';

import { useSessionStore } from '@/lib/sessionStore';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { useSessionManager } from '@/hooks/useSessionManager';
import { Button } from "@/components/ui/button";

export default function SessionLoader({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const loadAttempted = useRef(false);
    const [isInvalidSession, setIsInvalidSession] = useState(false);
    
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

    const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const loadSession = async () => {
            if (loadAttempted.current) {
                return;
            }
            
            console.log('[SessionLoader] Starting session load from URL param');
            loadAttempted.current = true;
            
            try {
                const success = await loadSessionFromUrlParam();
                console.log('[SessionLoader] Session load result:', success);
                
                if (!success) {
                    setIsInvalidSession(true);
                    // Remove session_id from URL
                    navigate(window.location.pathname, { replace: true });
                }
                
                console.log('[SessionLoader] Final session state:', {
                    selectedEdition: session.selectedEdition,
                    currentStep: session.currentStep,
                    lastCompletedStep: session.lastCompletedStep
                });
            } catch (error) {
                console.error('[SessionLoader] Error loading session:', error);
                setIsInvalidSession(true);
                navigate(window.location.pathname, { replace: true });
            }
        };

        if (location.search && !loadAttempted.current) {
            loadSession();
        }
    }, [location.search, loadSessionFromUrlParam, session, navigate]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isHydrated) {
                setHydrated(true);
            }
        }, 500);

        setLoadingTimeout(timeout);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (isHydrated && !isLoading && loadingTimeout) {
            clearTimeout(loadingTimeout);
            setLoadingTimeout(null);
        }
    }, [isHydrated, isLoading, loadingTimeout]);

    if ((isLoading || !isHydrated) && location.search) {
        return (
            <div className="fixed top-4 right-4 flex items-center bg-white/80 backdrop-blur-sm shadow-lg rounded-lg px-4 py-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-legacy-green mr-2"></div>
                <span>Loading session...</span>
            </div>
        );
    }

    if (isInvalidSession || loadError) {
        return (
          <div className="fixed top-4 right-4 flex items-center bg-white shadow-lg rounded-lg px-6 py-4 text-sm text-gray-600 max-w-md">
            <div className="flex-1">
              <p className="font-medium text-legacy-green mb-1">Session Expired</p>
              <p className="text-gray-500 text-xs">
                This saved session has expired or is no longer valid. Please start a new session.
              </p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                resetSessionAndState();
                setIsInvalidSession(false);
                navigate('/', { replace: true });
              }}
              className="ml-4 whitespace-nowrap"
            >
              Start Over
            </Button>
          </div>
        );
    }

    return <>{children}</>;
} 