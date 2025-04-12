
import React from 'react';

interface ThemeDisplayProps {
  theme: string;
}

const ThemeDisplay: React.FC<ThemeDisplayProps> = ({ theme }) => {
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
