import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from '@/contexts/SessionContext';
import { Check, Copy, X } from 'lucide-react';

interface SaveAndResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SaveAndResumeModal: React.FC<SaveAndResumeModalProps> = ({
  isOpen,
  onClose
}) => {
  const { saveAndExitSession, error } = useSession();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resumeLink, setResumeLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const sessionId = await saveAndExitSession(email);
      const resumeUrl = `${window.location.origin}${window.location.pathname}?sessionId=${sessionId}`;
      setResumeLink(resumeUrl);
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to save session:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy resume link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeLink).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  // Reset the modal state when closed
  const handleClose = () => {
    if (!isSubmitting) {
      setTimeout(() => {
        setEmail('');
        setIsSuccess(false);
        setResumeLink('');
        setIsCopied(false);
      }, 300);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Your Progress</DialogTitle>
          <DialogDescription>
            {!isSuccess
              ? "We'll send you a link to continue where you left off."
              : "Your progress has been saved. Use this link to resume later."}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!email || isSubmitting}
                className="bg-legacy-green hover:bg-legacy-green/90 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Get Link"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Resume Link</Label>
              <div className="flex">
                <Input
                  value={resumeLink}
                  readOnly
                  className="pr-10 font-mono text-sm"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="-ml-10 h-10 w-10"
                  onClick={copyToClipboard}
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                We've also sent this link to your email. You can bookmark this page or copy the link.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                className="bg-legacy-green hover:bg-legacy-green/90 text-white"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SaveAndResumeModal; 