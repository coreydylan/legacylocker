
import React from 'react';
import { CalendarIcon, UserIcon } from 'lucide-react';

const InfoNotice: React.FC = () => {
  return (
    <div className="bg-legacy-cream/50 p-6 rounded-lg flex items-start gap-3">
      <div className="text-legacy-green mt-0.5">
        <CalendarIcon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium text-lg mb-2">Why birthdays matter</h3>
        <p className="text-legacy-dark/80">
          When you provide important dates like birthdays or anniversaries, we can ensure special cards arrive at just the right time to celebrate these milestones.
        </p>
      </div>
    </div>
  );
};

export default InfoNotice;
