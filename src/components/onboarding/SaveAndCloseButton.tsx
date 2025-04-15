import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSessionStore } from '@/lib/sessionStore';

interface SaveAndCloseButtonProps {
  onClose: () => void; // Function to close the modal
}

const SaveAndCloseButton: React.FC<SaveAndCloseButtonProps> = ({ onClose }) => {
  const { toast } = useToast();
  const purchaserEmail = useSessionStore(state => state.session.purchaser?.email);

  const handleClick = () => {
    if (purchaserEmail) {
        toast({
            title: "Magic Link Sent",
            description: `We sent a magic link to ${purchaserEmail} so you can come back to this order any time.`,
        });
    } else {
        toast({
            title: "Order Saved",
            description: "You can resume your order later.", 
            variant: "destructive"
        });
        console.warn("SaveAndCloseButton: Purchaser email not found in session.");
    }
    onClose();
  };

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
    >
      <Save className="h-4 w-4" />
      <span>Save & Finish Later</span>
    </Button>
  );
};

export default SaveAndCloseButton; 