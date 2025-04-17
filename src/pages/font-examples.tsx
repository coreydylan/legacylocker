import React from 'react';
import FontExamples from '@/components/FontExamples';

const FontExamplesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Source Serif 4 Variable Font Examples</h1>
        <p className="text-center mb-8 max-w-2xl mx-auto">
          This page demonstrates all the available variations of the Source Serif 4 Variable font.
          You can use these classes in your components to apply the different font styles.
        </p>
        <FontExamples />
      </div>
    </div>
  );
};

export default FontExamplesPage; 