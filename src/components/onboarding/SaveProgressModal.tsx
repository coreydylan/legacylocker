import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';

interface SaveProgressModalProps {
  open: boolean;
  onClose: () => void;
  setLastSavedTime: React.Dispatch<React.SetStateAction<Date | null>>;
}

const SaveProgressModal: React.FC<SaveProgressModalProps> = ({ 
  open,
  onClose, 
  setLastSavedTime
}) => {
  const { session, saveSessionProgress } = useSessionStore();
  
  const [email, setEmail] = useState(session.purchaser?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    setEmail(session.purchaser?.email || session.email || '');
  }, [session.purchaser?.email, session.email]);
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      saveSessionProgress(email);
      
      setLastSavedTime(new Date());
      onClose();
      
    } catch (err) {
      console.error('Error saving progress via store:', err);
      setError('An error occurred while saving your progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Your Progress</DialogTitle>
          <DialogDescription>
            Enter your email to save your progress. You'll be able to return and continue your gift creation later.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center space-x-2">
              <Mail className="text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <DialogFooter className="sm:justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Progress'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveProgressModal;
