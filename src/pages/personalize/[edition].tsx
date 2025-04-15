import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Removed modal store imports as this page shouldn't control the main modal
// import { useModalStore } from '@/lib/modalStore'; 
import { useSessionStore } from '@/lib/sessionStore';
import PersonalizationContainer from '@/components/PersonalizationContainer';

const PersonalizePage: React.FC = () => {
  console.log("--- Rendering PersonalizePage (Should this be used for modal flow?) ---");
  const { edition } = useParams<{ edition: string }>();
  const navigate = useNavigate();
  const [editionName, setEditionName] = useState<string | undefined>();
  // Removed modal store usage
  const { sessionMetadata } = useSessionStore();
  
  useEffect(() => {
    // Basic setup based on URL param if needed for a direct-access page
    if (edition) {
      const formattedName = edition
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' - ');
      setEditionName(formattedName);
      
      // ** REMOVED MODAL OPENING LOGIC **
      // This page should probably display content directly, not open the modal.
      // If session is active, maybe show content, otherwise redirect?
      if (!sessionMetadata.isActive) {
        console.warn("PersonalizePage: Arrived without active session, redirecting home.");
        // navigate('/'); // Optional: Redirect if direct access isn't intended
      }
    }
    // Removed modal-related cleanup
    return () => {}; 
  }, [edition, sessionMetadata.isActive, navigate]);
  
  // Removed handleBack that interacts with modal store
  const handleBack = () => {
    // Simple navigation back if this page is ever used directly
    navigate(-1); 
  };
  
  // The PersonalizationContainer likely needs session data passed to it
  // or it needs to use the session store itself.
  // For now, just rendering it.
  return (
    <>
      {/* Removed the yellow marker */}
      {/* <div style={{ position: 'absolute', top: 0, left: 0, background: 'yellow', zIndex: 10000 }}>PersonalizePage Rendered</div> */}
      <PersonalizationContainer 
        editionName={editionName} // Prop might be irrelevant if container uses store
        onBack={handleBack} // Pass simplified back handler
      />
    </>
  );
};

export default PersonalizePage; 