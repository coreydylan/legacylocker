import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { FormData } from '@/types/onboarding';

interface SaveProgressModalProps {
  open: boolean;
  onClose: () => void;
  formData: FormData;
  onSaveProgress: (email: string, data: FormData) => Promise<boolean>;
  setLastSavedTime: React.Dispatch<React.SetStateAction<Date | null>>;
}

const SaveProgressModal: React.FC<SaveProgressModalProps> = ({ 
  open,
  onClose, 
  formData,
  onSaveProgress,
  setLastSavedTime
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Simple email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the email
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const success = await onSaveProgress(email, formData);
      
      if (success) {
        setLastSavedTime(new Date());
        onClose();
      } else {
        setError('Failed to save progress. Please try again.');
      }
    } catch (err) {
      console.error('Error saving progress:', err);
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
