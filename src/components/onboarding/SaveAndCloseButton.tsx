import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SaveAndCloseButtonProps {
  onClose: () => void; // Function to close the modal
}

const SaveAndCloseButton: React.FC<SaveAndCloseButtonProps> = ({ onClose }) => {
  return (
    <Button
      variant="secondary"
      onClick={onClose} // Clicking simply closes the modal
      className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
    >
      <Save className="h-4 w-4" />
      <span>Save & Finish Later</span>
    </Button>
  );
};

export default SaveAndCloseButton; 