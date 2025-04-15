import React from 'react';

export const SafeAreaWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    height: '100%', // Ensure wrapper takes full height
    display: 'flex', // Use flex to manage children layout
    flexDirection: 'column' // Stack children vertically
  }}>
    {children}
  </div>
); 