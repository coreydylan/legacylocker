import React, { useState } from 'react';
import { FormData } from '../OnboardingModal';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, CalendarCheck, Mail, Phone } from 'lucide-react';

interface ConciergeEditionFlowProps {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
}

const ConciergeEditionFlow: React.FC<ConciergeEditionFlowProps> = ({ formData, updateFormData }) => {
  const [contactMethod, setContactMethod] = useState(
    formData.editionFlow.conciergeData?.preferredContact?.method || 'email'
  );
  
  const handleStoryChange = (value: string) => {
    updateFormData('editionFlow', { 
      ...formData.editionFlow, 
      conciergeData: {
        ...formData.editionFlow.conciergeData,
        openEndedStory: value
      }
    });
  };
  
  const handleContactMethodChange = (value: string) => {
    setContactMethod(value);
    updateFormData('editionFlow', { 
      ...formData.editionFlow, 
      conciergeData: {
        ...formData.editionFlow.conciergeData,
        preferredContact: {
          ...formData.editionFlow.conciergeData?.preferredContact,
          method: value
        }
      }
    });
  };

  const handleContactDetailChange = (field: string, value: string) => {
    updateFormData('editionFlow', { 
      ...formData.editionFlow, 
      conciergeData: {
        ...formData.editionFlow.conciergeData,
        preferredContact: {
          ...formData.editionFlow.conciergeData?.preferredContact,
          [field]: value
        }
      }
    });
  };

  const charactersUsed = formData.editionFlow.conciergeData?.openEndedStory?.length || 0;

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
                value={formData.editionFlow.conciergeData?.openEndedStory || ''}
                onChange={(e) => handleStoryChange(e.target.value)}
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
                value={contactMethod} 
                onValueChange={handleContactMethodChange}
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
                    value={formData.editionFlow.conciergeData?.preferredContact?.phoneNumber || ''}
                    onChange={(e) => handleContactDetailChange('phoneNumber', e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="availability" className="text-sm">Best time to reach you (optional)</Label>
                <Input 
                  id="availability"
                  placeholder="e.g., Weekdays after 5pm ET, Tuesday afternoons"
                  value={formData.editionFlow.conciergeData?.preferredContact?.availability || ''}
                  onChange={(e) => handleContactDetailChange('availability', e.target.value)}
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
    </div>
  );
};

export default ConciergeEditionFlow;
