import React from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { SessionData } from '@/lib/sessionManager';

const ThemeDisplay: React.FC = () => {
  const { session } = useSessionStore();
  const typedSession = session as SessionData;
  const theme = typedSession.selectedSeries?.display || 
                typedSession.editionFlow?.customEditionData?.theme || 
                'Custom Story';

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-legacy-cream/50">
        <div className="text-base font-medium">Story Theme</div>
        <div className="bg-legacy-cream/30 px-4 py-2 rounded-md text-legacy-green font-medium">
          {theme}
        </div>
      </div>
    </div>
  );
};

export default ThemeDisplay;
