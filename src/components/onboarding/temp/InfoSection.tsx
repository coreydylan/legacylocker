
import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <div className="pt-4">
      <div className="bg-legacy-cream/30 p-4 sm:p-6 rounded-lg max-w-3xl mx-auto">
        <h3 className="font-medium text-lg mb-2 text-legacy-green">About Your Custom Edition</h3>
        <p className="text-sm sm:text-base text-legacy-dark/80">
          Your custom edition will be delivered monthly to your recipient. 
          Each beautifully printed card will feature your stories and artwork choices,
          creating a personalized journey through memories that matter most to you.
        </p>
      </div>
    </div>
  );
};

export default InfoSection;
