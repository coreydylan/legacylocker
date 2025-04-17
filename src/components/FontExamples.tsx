import React from 'react';

const FontExamples: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl mb-8 source-serif-display-bold">Font Examples</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl mb-4 source-serif-display">Source Serif 4 Variable</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Regular</h3>
            <p className="source-serif-regular">The quick brown fox jumps over the lazy dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Italic</h3>
            <p className="source-serif-italic">The quick brown fox jumps over the lazy dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Bold</h3>
            <p className="source-serif-bold">The quick brown fox jumps over the lazy dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Display (Large)</h3>
            <p className="source-serif-display text-2xl">The quick brown fox jumps over the lazy dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Caption (Small)</h3>
            <p className="source-serif-caption text-sm">The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl mb-4 source-serif-display">Source Code Pro</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Regular</h3>
            <p className="source-code-pro-regular">The quick brown fox jumps over the lazy dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Light</h3>
            <p className="source-code-pro-light">The quick brown fox jumps over the lazy dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Medium</h3>
            <p className="source-code-pro-medium">The quick brown fox jumps over the lazy dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Bold</h3>
            <p className="source-code-pro-bold">The quick brown fox jumps over the lazy dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Italic</h3>
            <p className="source-code-pro-italic">The quick brown fox jumps over the lazy dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2 source-serif-semibold">Bold Italic</h3>
            <p className="source-code-pro-bold-italic">The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FontExamples; 