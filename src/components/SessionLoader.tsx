'use client';

import { useSessionStore } from '@/lib/sessionStore';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

export default function SessionLoader({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const {
        loadSessionFromDb,
        initialize,
        isHydrated,
        isLoading,
        sessionMetadata,
        initializeSignatureData,
        initializeCustomDataDates,
        setHydrated
    } = useSessionStore();

    const [loadAttempted, setLoadAttempted] = useState(false);

    // Force hydration completion if we're waiting too long
    useEffect(() => {
        if (!isHydrated) {
            console.log('[SessionLoader] Forcing hydration completion...');
            // Force hydration to complete after a short delay
            const timer = setTimeout(() => {
                if (!isHydrated) {
                    console.log('[SessionLoader] Hydration timeout - forcing completion');
                    // Force hydration to complete
                    setHydrated(true);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isHydrated, setHydrated]);

    useEffect(() => {
        const loadSession = async () => {
            // Check for session_id in URL regardless of hydration state
            const searchParams = new URLSearchParams(location.search);
            const sessionIdParam = searchParams.get('session_id');
            
            console.log('[SessionLoader] Checking for session_id param:', sessionIdParam);
            
            // If we have a session_id in the URL, try to load it
            if (sessionIdParam && sessionIdParam !== sessionMetadata.sessionId) {
                console.log(`[SessionLoader] Found session_id param: ${sessionIdParam}. Attempting DB load.`);
                try {
                    const success = await loadSessionFromDb(sessionIdParam);
                    if (success) {
                        console.log('[SessionLoader] DB load successful. Initializing data...');
                        // Initialize session data after successful load
                        await Promise.all([
                            initializeSignatureData(),
                            initializeCustomDataDates()
                        ]);
                        console.log('[SessionLoader] Session data initialized.');
                    } else {
                        console.log('[SessionLoader] DB load failed or session invalid. Initializing normally.');
                        initialize();
                    }
                } catch (error) {
                    console.error('[SessionLoader] Error loading session:', error);
                    initialize();
                }
            } else if (!loadAttempted) {
                // Only set loadAttempted if we're not trying to load a session
                setLoadAttempted(true);
                console.log('[SessionLoader] No valid session_id param found, or it matches current session. Initializing normally.');
                // Force hydration to complete before initializing
                if (!isHydrated) {
                    setHydrated(true);
                }
                initialize();
            }
        };

        // Run the load session function
        loadSession();
    }, [location.search, loadSessionFromDb, initialize, sessionMetadata.sessionId, initializeSignatureData, initializeCustomDataDates, loadAttempted, isHydrated, setHydrated]);

    // Show loading indicator while the store is loading/hydrating
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading your session...</span>
            </div>
        );
    }

    return <>{children}</>;
} 