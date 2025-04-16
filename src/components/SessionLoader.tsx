'use client';

import { useSessionStore } from '@/lib/sessionStore';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

// Removed Suspense wrapper as useLocation doesn't require it like Next.js's useSearchParams
export default function SessionLoader({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const {
        loadSessionFromDb,
        initialize, // Use initialize to finalize loading state if no DB load
        isHydrated, // Wait for metadata hydration
        isLoading, // Use store's loading state
        sessionMetadata
    } = useSessionStore();

    const [loadAttempted, setLoadAttempted] = useState(false);

    useEffect(() => {
        // Only attempt load if metadata is hydrated and we haven't tried yet
        if (isHydrated && !loadAttempted) {
            setLoadAttempted(true);
            const searchParams = new URLSearchParams(location.search);
            const sessionIdParam = searchParams.get('session_id');

            console.log('[SessionLoader] Hydrated. Checking for session_id param:', sessionIdParam);

            // Check if URL param exists and is different from current session ID in metadata
            if (sessionIdParam && sessionIdParam !== sessionMetadata.sessionId) {
                console.log(`[SessionLoader] Found session_id param: ${sessionIdParam}. Attempting DB load.`);
                loadSessionFromDb(sessionIdParam).then((success) => {
                    if (success) {
                        console.log('[SessionLoader] DB load successful.');
                        // Optional: Re-run initializers if needed after successful load
                        // initializeSignatureData();
                        // initializeCustomDataDates();
                    } else {
                        console.log('[SessionLoader] DB load failed or session invalid. Initializing normally.');
                        // If DB load fails or session is invalid, initialize sets isLoading=false
                        initialize();
                    }
                });
            } else {
                 console.log('[SessionLoader] No valid session_id param found, or it matches current session. Initializing normally.');
                 // If no param or it matches, just finalize loading state
                 initialize();
            }
        } else if (!isHydrated) {
            console.log('[SessionLoader] Waiting for hydration...');
        }
    }, [isHydrated, loadAttempted, location.search, loadSessionFromDb, initialize, sessionMetadata.sessionId]);

    // Optionally, show a loading indicator while the store is loading/hydrating
    // or while loadSessionFromDb is running (isLoading is true)
    // if (isLoading) {
    //     return <div>Loading Session...</div>; 
    // }

    // Render children once loading/hydration check is done
    return <>{children}</>;
} 