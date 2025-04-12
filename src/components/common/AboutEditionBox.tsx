import React from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Box } from 'lucide-react';

const AboutEditionBox: React.FC = () => {
  const { sessionData } = useSession();
  const edition = sessionData?.edition || 'Your Selected Edition';

  return (
    <div className="bg-legacy-cream/50 p-5 rounded-lg">
      <div className="flex gap-3 items-start">
        <div className="bg-legacy-green/10 p-2 rounded-lg">
          <Box className="h-5 w-5 text-legacy-green" />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-1">About {edition}</h3>
          <p className="text-sm text-legacy-dark/80">
            This signature edition contains 12 beautifully crafted cards that will be delivered monthly, 
            celebrating moments that connect with the theme you've chosen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutEditionBox; 