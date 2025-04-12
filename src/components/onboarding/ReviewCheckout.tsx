import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionData, Recipient, Purchaser } from '@/lib/sessionManager';
import { CheckCircle, Edit2, ShoppingCart, ChevronLeft, Home, Mail as MailIcon } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';
import { formatShipToName } from '@/lib/utils/formatShipToName';

const MONTH_NAMES = {
  jan: 'January',
  feb: 'February',
  mar: 'March',
  apr: 'April',
  may: 'May',
  jun: 'June',
  jul: 'July',
  aug: 'August',
  sep: 'September',
  oct: 'October',
  nov: 'November',
  dec: 'December'
};

const STEPS = {
  RECIPIENT_SELECTION: 1,
  PURCHASER_INFO: 2,
  RECIPIENT_INFO: 3,
  SHIPPING_INFO: 4, 
  ENVELOPE_ADDRESSEE: 5,
  EDITION_DETAILS: 6, 
  REVIEW_CHECKOUT: 7 
};

const defaultRecipient: Recipient = { type: 'individual' };
const defaultPurchaser: Purchaser = {};

const ReviewCheckout: React.FC = () => {
  const { session, setCurrentStep, prevStep } = useSessionStore();
  
  const typedSession = session as SessionData;
  const recipientType = typedSession.recipientType || 'individual'; 
  const recipient: Recipient = typedSession.recipient || defaultRecipient;
  const purchaser: Purchaser = typedSession.purchaser || defaultPurchaser;
  const cards = typedSession.cards || {};
  const shippingAddress = recipient.shippingAddress || {};
  
  const completedCards = Object.values(cards).filter(
    (card: any) => card?.title?.trim() !== '' && card?.story?.trim() !== ''
  ).length;
  
  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };
  
  const handleSubmit = () => {
    console.log("ReviewCheckout: Submitting session...");
    alert("Proceed to Checkout! (Implement payment flow)");
  };

  const formattedShipToNameResult = formatShipToName(session);
  const envelopeName = recipient.cardAddresseeNameOverridden 
                       ? (recipient.cardAddresseeName || '') 
                       : formattedShipToNameResult;

  const formatAddress = () => {
    const parts = [
      shippingAddress.street,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.postalCode,
      shippingAddress.country
    ].filter(Boolean); 
    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          Review Your Order
        </h1>
        <p className="text-lg text-gray-600">
          Please review your personalized keepsake before proceeding to checkout.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader className="bg-legacy-cream/30">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                {recipientType === 'myself' ? 'Your Information' : 'Recipient'}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-legacy-green"
                onClick={() => handleEdit(recipientType === 'myself' ? STEPS.PURCHASER_INFO : STEPS.RECIPIENT_INFO)} 
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <dl className="space-y-4">
              {recipientType === 'myself' && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {purchaser.fullName || 'Not provided'} 
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {purchaser.email || 'Not provided'} 
                    </dd>
                  </div>
                </>
              )}

              {recipientType !== 'myself' && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Gift Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {recipientType === 'individual'
                        ? 'For an Individual'
                        : 'For a Couple'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Recipient Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {recipient.type === 'individual' 
                        ? `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || 'Not specified'
                        : `${recipient.recipient1FirstName || ''} ${recipient.recipient1LastName || ''} & ${recipient.recipient2FirstName || ''} ${recipient.recipient2LastName || ''}`.trim() || 'Not specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {recipient.relationship || 'Not specified'}
                    </dd>
                  </div>
                </>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Home className="h-4 w-4 mr-2 text-gray-400"/>
                  Shipping Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 pl-6">
                  {formatAddress()} 
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MailIcon className="h-4 w-4 mr-2 text-gray-400"/>
                  Name on Envelope
                </dt>
                <dd className="mt-1 text-sm text-gray-900 pl-6">
                  {envelopeName || 'Not specified'} 
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        {recipientType !== 'myself' && (
            <Card>
              <CardHeader className="bg-legacy-cream/30">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Your Information</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-legacy-green"
                    onClick={() => handleEdit(STEPS.PURCHASER_INFO)} 
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {purchaser.fullName || 'Not provided'} 
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {purchaser.email || 'Not provided'} 
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
        )}
      </div>
      
      <Card className="mb-8">
        <CardHeader className="bg-legacy-cream/30">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Personalized Cards</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-legacy-green"
              onClick={() => handleEdit(STEPS.EDITION_DETAILS)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Cards
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Completed Cards</span>
              <span className="text-sm font-medium text-legacy-green">
                {completedCards} of 12
              </span>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {Object.entries(cards).map(([month, card]: [string, any]) => (
                <div 
                  key={month} 
                  className={`
                    border rounded-md p-3 text-center
                    ${card?.title && card?.story 
                      ? 'border-legacy-green/30 bg-legacy-cream/20' 
                      : 'border-gray-200'}
                  `}
                >
                  <div className="text-xs uppercase font-medium mb-1 text-gray-500">
                    {MONTH_NAMES[month as keyof typeof MONTH_NAMES] || month}
                  </div>
                  <div className="text-sm font-medium truncate" title={card?.title}>
                    {card?.title || 'Untitled'}
                  </div>
                  {card?.title && card?.story && (
                    <CheckCircle className="h-4 w-4 mx-auto mt-2 text-legacy-green" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center pt-6 border-t">
         <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="text-legacy-dark/60 hover:text-legacy-green border-legacy-cream"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            size="lg"
            className="px-8 py-3 text-base bg-legacy-green text-white hover:bg-legacy-green/90"
            onClick={handleSubmit}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Proceed to Checkout
          </Button>
       </div>
        
       <p className="text-sm text-gray-500 mt-4 text-center">
          Your order will be carefully crafted and delivered upon completion of payment.
       </p>
    </div>
  );
};

export default ReviewCheckout;
