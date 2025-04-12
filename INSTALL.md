# Session-Based Architecture Implementation Guide

This guide outlines the steps to implement the new session-based architecture to enable persistent form state and a "save and resume" workflow.

## Installation

1. Install the required dependencies:

```bash
npm install uuid lodash.get lodash.set
npm install --save-dev @types/uuid @types/lodash.get @types/lodash.set
```

## Implementation Steps

### 1. Enable Session Manager

The session manager is implemented in `src/services/sessionManager.ts`. It handles:
- Creating new sessions
- Loading existing sessions
- Saving session data
- Updating specific fields
- Conversion from legacy form data 

### 2. Integrate Session Context

The `SessionProvider` component in `src/contexts/SessionContext.tsx` provides global access to session data:

```jsx
// In your root component (App.tsx or similar)
import { SessionProvider } from '@/contexts/SessionContext';

function App() {
  return (
    <SessionProvider>
      {/* Your app content */}
    </SessionProvider>
  );
}
```

### 3. Use Session Data in Components

Components can access and update session data using the `useSession` hook:

```jsx
import { useSession } from '@/contexts/SessionContext';

function MyComponent() {
  const { sessionData, updateSessionField } = useSession();

  // Read data
  const recipientType = sessionData?.recipientType;

  // Update data
  const handleTypeSelect = (type) => {
    updateSessionField('recipientType', type);
  };

  return (
    // Your component UI
  );
}
```

### 4. Enable Save & Resume

The `SaveAndResumeModal` component handles the UI for saving progress:

```jsx
import SaveAndResumeModal from '@/components/common/SaveAndResumeModal';

function YourComponent() {
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setSaveModalOpen(true)}>
        Save & Finish Later
      </Button>
      
      <SaveAndResumeModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
      />
    </>
  );
}
```

## Testing Session Flow

1. Start the app and begin a personalization flow
2. Use the "Save & Finish Later" button to generate a resume link
3. Open the link in a new tab to verify the session is loaded correctly
4. Make changes in each tab and confirm they don't interfere

## Future Supabase Integration

The architecture is designed to be easily connected to Supabase:

1. Implement the functions in `src/services/sessionManager.ts`:
   - `createSessionInSupabase`
   - `updateSessionInSupabase`
   - `getSessionFromSupabase`
   - `sendResumeLink`

2. Update the session loading logic to check Supabase when a session ID is provided

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify that sessionData is being properly initialized
3. Confirm that URL parameters are being correctly parsed
4. Test localStorage functionality in your browser 