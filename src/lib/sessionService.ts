import { supabase } from './supabaseClient'
import { useSessionStore } from './sessionStore'

export const saveSessionToSupabase = async () => {
  const { sessionMetadata, session } = useSessionStore.getState()

  const email = session.purchaser?.email;

  if (!email || !sessionMetadata.sessionId) {
    console.warn(
      'Missing purchaser email or session ID — skipping save.',
      { email: email, sessionId: sessionMetadata.sessionId }
    )
    return
  }

  const { data, error } = await supabase
    .from('sessions')
    .upsert({
      id: sessionMetadata.sessionId,
      email: email,
      edition: sessionMetadata.editionType,
      onboarding_data: session,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Failed to save session:', error)
  } else {
    console.log('Session saved to Supabase:', data)
  }
}

// Function to load session from Supabase
export const loadSessionFromSupabase = async (sessionId: string) => {
  console.log(`Attempting to load session: ${sessionId}`);
  const { data, error } = await supabase
    .from('sessions')
    .select('*') // Select all columns
    .eq('id', sessionId)
    .single(); // Expect only one row

  if (error) {
    console.error('Failed to load session from Supabase:', error.message);
    // Optionally, check for specific errors like 'PGRST116' (No rows found)
    if (error.code === 'PGRST116') {
      console.log(`No session found with ID: ${sessionId}`);
    } else {
      // Handle other potential errors (network, permissions, etc.)
    }
    return null;
  }

  if (!data) {
    console.warn(`No data returned for session ID: ${sessionId}, although no error reported.`);
    return null;
  }

  console.log('Raw data loaded from Supabase:', data);

  // Extract necessary fields, including the full session data from onboarding_data
  const { onboarding_data, email, edition, updated_at } = data;

  // Validate the shape of onboarding_data if necessary before using it
  if (!onboarding_data || typeof onboarding_data !== 'object') {
      console.error('Invalid or missing onboarding_data loaded from Supabase.', onboarding_data);
      return null;
  }

  // Rehydrate the store
  useSessionStore.setState((state) => ({
    session: onboarding_data, // Restore the entire session object
    sessionMetadata: {
      // Preserve existing metadata fields if needed, or overwrite fully
      ...state.sessionMetadata, // Optional: Keep other metadata fields?
      sessionId: sessionId, // Use the ID we loaded with
      isActive: true, // Mark the session as active
      editionType: edition, // Restore edition type
      // email: email, // Email is already inside the `session` object (session.purchaser.email)
      lastSaved: updated_at ? new Date(updated_at) : new Date(), // Use the last saved time from DB
    },
    isHydrated: true, // Mark store as hydrated (if not already)
    isLoading: false, // Mark loading as complete
  }));

  console.log('✅ Zustand store rehydrated from Supabase session:', sessionId);
  // Potentially trigger other initialization logic needed after hydration
  // e.g., useSessionStore.getState().initializeSignatureData(); 

  return data; // Return the raw data loaded
};