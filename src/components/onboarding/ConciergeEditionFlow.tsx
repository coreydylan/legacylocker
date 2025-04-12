import React, { useState, useEffect } from 'react';
// import { FormData } from '../OnboardingModal'; // Not needed
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, CalendarCheck, Mail, Phone, ChevronLeft } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore'; // Import store hook
import { SessionData } from '@/lib/sessionManager'; // Import types
import { Button } from "@/components/ui/button"; // Import Button

// interface ConciergeEditionFlowProps { ... } // Remove props interface

// Remove props from component signature
const ConciergeEditionFlow: React.FC = () => {
  // Get store state/actions
  const { session, updateSession, prevStep, nextStep } = useSessionStore();
  const typedSession = session as SessionData;
  const conciergeData = typedSession.editionFlow?.conciergeData;

  // Explicitly type the state to handle string from RadioGroup
  const [contactMethod, setContactMethod] = useState<string>(
    conciergeData?.preferredContact?.method || 'email'
  );
  
  // Update local state if session changes
  useEffect(() => {
    const sessionContactMethod = conciergeData?.preferredContact?.method || 'email';
    // Ensure comparison is between strings
    if (String(sessionContactMethod) !== contactMethod) {
      setContactMethod(String(sessionContactMethod));
    }
    // Only depend on the session value
  }, [conciergeData?.preferredContact?.method]);

  // Initialize concierge data in session if it doesn't exist
  useEffect(() => {
    if (!typedSession.editionFlow?.conciergeData) {
      updateSession('editionFlow.conciergeData', {
        openEndedStory: '',
        preferredContact: { method: 'email' }
      });
    }
  }, [typedSession.editionFlow?.conciergeData, updateSession]);

  // Update story in session
  const handleStoryChange = (value: string) => {
    updateSession('editionFlow.conciergeData.openEndedStory', value);
  };
  
  // Update contact method in local state and session
  const handleContactMethodChange = (value: string) => {
    // Value is already a string from RadioGroup
    setContactMethod(value);
    // Update session, potentially casting to the specific literal type if needed by store
    updateSession('editionFlow.conciergeData.preferredContact.method', value as 'email' | 'phone');
  };

  // Update contact details in session
  const handleContactDetailChange = (field: string, value: string) => {
    updateSession(`editionFlow.conciergeData.preferredContact.${field}`, value);
  };

  const charactersUsed = conciergeData?.openEndedStory?.length || 0;
  
  // Basic validation - check if story is entered
  const canProceed = Boolean(conciergeData?.openEndedStory?.trim());

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-legacy-gold font-playfair">Concierge Edition</h1>
        <p className="text-xl text-legacy-dark/80">
          Work with our professional writers to create a completely bespoke story series.
        </p>
      </div>

      <div className="bg-white border rounded-lg p-8 shadow-sm space-y-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-legacy-gold/10">
            <MessageCircle className="h-6 w-6 text-legacy-gold" />
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-xl font-medium mb-2">Tell Us About Your Gift</h3>
              <p className="text-muted-foreground">
                Tell us anything you'd like to share about this gift or the person receiving it. We'll follow up to help craft the perfect story series.
              </p>
            </div>
            <div className="space-y-4">
              <Textarea 
                id="storyDescription"
                placeholder="Share any details about what you're looking for in your custom story series. The more details you provide, the better we can understand your vision."
                className="min-h-[200px] text-base"
                value={conciergeData?.openEndedStory || ''} // Get value from session
                onChange={(e) => handleStoryChange(e.target.value)} // Use updated handler
              />
              <div className="text-sm text-muted-foreground text-right">
                {charactersUsed} characters
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-legacy-gold/10">
            <CalendarCheck className="h-6 w-6 text-legacy-gold" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-medium mb-2">Preferred Contact Method</h3>
            <p className="text-sm text-muted-foreground mb-4">
              How would you prefer our team to contact you for follow-up?
            </p>
            
            <div className="space-y-6">
              <RadioGroup 
                value={contactMethod} // Use local state for controlled component
                onValueChange={handleContactMethodChange} // Use updated handler
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="contact-email" />
                  <Label htmlFor="contact-email" className="flex items-center cursor-pointer">
                    <Mail className="mr-2 h-4 w-4" /> Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="contact-phone" />
                  <Label htmlFor="contact-phone" className="flex items-center cursor-pointer">
                    <Phone className="mr-2 h-4 w-4" /> Phone
                  </Label>
                </div>
              </RadioGroup>

              {contactMethod === 'phone' && (
                <div className="pt-2">
                  <Label htmlFor="phoneNumber" className="text-sm">Your phone number</Label>
                  <Input 
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={conciergeData?.preferredContact?.phoneNumber || ''} // Get value from session
                    onChange={(e) => handleContactDetailChange('phoneNumber', e.target.value)} // Use updated handler
                  />
                </div>
              )}

              <div>
                <Label htmlFor="availability" className="text-sm">Best time to reach you (optional)</Label>
                <Input 
                  id="availability"
                  placeholder="e.g., Weekdays after 5pm ET, Tuesday afternoons"
                  value={conciergeData?.preferredContact?.availability || ''} // Get value from session
                  onChange={(e) => handleContactDetailChange('availability', e.target.value)} // Use updated handler
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-legacy-gold/5 p-6 rounded-lg">
        <h3 className="font-medium text-lg mb-2 text-legacy-gold">What Happens Next?</h3>
        <p className="text-legacy-dark/80 mb-3">
          After you complete your order, a concierge from our team will reach out within 1-2 business days to begin the story-building process.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-legacy-dark/80">
          <li>Our team will review your information and prepare for your consultation</li>
          <li>Your dedicated writer will work with you to understand your vision</li>
          <li>We'll craft your unique narrative and provide drafts for your feedback</li>
          <li>Once approved, your beautifully designed cards will be produced and shipped</li>
        </ul>
      </div>

      {/* Add Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep} // Use store action
          className="text-legacy-dark/60 hover:text-legacy-green border-legacy-cream"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button 
          type="button" 
          onClick={nextStep} // Use store action
          className="bg-legacy-gold text-white hover:bg-legacy-gold/90"
          disabled={!canProceed} // Basic validation
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};

export default ConciergeEditionFlow;
