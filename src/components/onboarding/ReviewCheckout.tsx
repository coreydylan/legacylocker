import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionData, Recipient, Purchaser } from '@/lib/sessionManager';
import { CheckCircle, Edit2, ShoppingCart, ChevronLeft, Home, Mail as MailIcon, Loader2, AlertCircle, Lock } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';
import { formatShipToName } from '@/lib/utils/formatShipToName';
import { calculateSessionPrice } from '@/lib/pricing';

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/payment/CheckoutForm';
import useMediaQuery from '@/hooks/useMediaQuery';

// Load Stripe outside of component render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

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
  const { session, setCurrentStep, prevStep, submitTriggerCount } = useSessionStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typedSession = session as SessionData;
  const recipientType = typedSession.recipientType || 'individual'; 
  const recipient: Recipient = typedSession.recipient || defaultRecipient;
  const purchaser: Purchaser = typedSession.purchaser || defaultPurchaser;
  const cards = typedSession.cards || {};
  const shippingAddress = recipient.shippingAddress || {};
  
  const completedCards = Object.values(cards).filter(
    (card: any) => card?.title?.trim() !== '' && card?.story?.trim() !== ''
  ).length;
  
  const totalPrice = calculateSessionPrice(typedSession);
  const totalPriceInCents = totalPrice !== null ? totalPrice * 100 : 0;
  const isPayable = totalPriceInCents > 0;
  const isConcierge = typedSession.selectedEdition?.type === 'concierge';

  useEffect(() => {
    if (isPayable && typedSession?.sessionId) {
      setIsLoadingPaymentIntent(true);
      setPaymentError(null);
      setClientSecret(null); 

      fetch('api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            amount: totalPriceInCents, 
            sessionId: typedSession.sessionId
        }),
      })
      .then(res => {
          if (!res.ok) return res.json().then(err => { throw new Error(err.error || `Server error: ${res.status}`) });
          return res.json();
      })
      .then(data => {
          if (data.clientSecret) setClientSecret(data.clientSecret);
          else throw new Error('Client secret not received.');
      })
      .catch(error => {
        console.error("Failed to fetch payment intent:", error);
        setPaymentError(error.message || "Could not initialize payment. Please refresh or contact support.");
      })
      .finally(() => setIsLoadingPaymentIntent(false));
    } else {
        setIsLoadingPaymentIntent(false);
    }
  }, [totalPriceInCents, typedSession?.sessionId, isPayable]);

  
  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handlePlaceOrder = () => {
    if (!isPayable || isLoadingPaymentIntent || isSubmitting || !clientSecret) {
        console.warn('Place order conditions not met.');
        return;
    }
    
    setIsSubmitting(true);
    
    const paymentForm = document.getElementById('payment-form') as HTMLFormElement | null;
    if (paymentForm) {
        paymentForm.requestSubmit(); 
    } else {
        console.error('Payment form not found!');
        setPaymentError('Could not initiate payment. Please refresh.');
        setIsSubmitting(false);
    }
  };

  const prevSubmitTriggerCountRef = useRef<number>(submitTriggerCount);
  useEffect(() => {
    if (submitTriggerCount > prevSubmitTriggerCountRef.current) {
      console.log(`[ReviewCheckout] submitTriggerCount changed (${prevSubmitTriggerCountRef.current} -> ${submitTriggerCount}), calling handlePlaceOrder.`);
      handlePlaceOrder();
    }
    prevSubmitTriggerCountRef.current = submitTriggerCount;
  }, [submitTriggerCount]);

  const handleBack = () => {
    prevStep();
  }

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

  const stripeElementsOptions = clientSecret ? {
    clientSecret,
    appearance: { theme: 'stripe' as const },
  } : undefined;
  
  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 px-4 md:px-0">
      <div className="mb-6 md:mb-8 text-left md:text-center">
        <h1 className="text-xl md:text-3xl font-semibold text-legacy-green mb-3 md:mb-4">
          Review & Complete Your Order
        </h1>
        <p className="text-sm md:text-lg text-gray-600">
          Please review your details and enter payment information below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
         <Card>
           <CardHeader className="bg-legacy-cream/30">
             <div className="flex justify-between items-center">
               <CardTitle className="text-xl">
                 {recipientType === 'myself' ? 'Your Information' : 'Recipient'}
               </CardTitle>
               <Button 
                 variant="ghost" size="sm" className="text-legacy-green"
                 onClick={() => handleEdit(recipientType === 'myself' ? STEPS.PURCHASER_INFO : STEPS.RECIPIENT_INFO)} 
               >
                 <Edit2 className="h-4 w-4 mr-2" /> Edit
               </Button>
             </div>
           </CardHeader>
           <CardContent className="pt-6">
             <dl className="space-y-4">
                 {recipientType === 'myself' && (
                    <>
                      <div><dt>Name</dt><dd>{purchaser.fullName || 'Not provided'}</dd></div>
                      <div><dt>Email</dt><dd>{purchaser.email || 'Not provided'}</dd></div>
                    </>
                  )}
                  {recipientType !== 'myself' && (
                    <>
                      <div><dt>Gift Type</dt><dd>{recipientType === 'individual' ? 'For an Individual' : 'For a Couple'}</dd></div>
                      <div><dt>Recipient Name</dt><dd>{recipient.type === 'individual' ? `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || 'Not specified' : `${recipient.recipient1FirstName || ''} ${recipient.recipient1LastName || ''} & ${recipient.recipient2FirstName || ''} ${recipient.recipient2LastName || ''}`.trim() || 'Not specified'}</dd></div>
                      <div><dt>Relationship</dt><dd>{recipient.relationship || 'Not specified'}</dd></div>
                    </>
                  )}
                  <div>
                    <dt className="flex items-center"><Home className="h-4 w-4 mr-2 text-gray-400"/> Shipping Address</dt>
                    <dd className="pl-6">{formatAddress()}</dd>
                  </div>
                  <div>
                     <dt className="flex items-center"><MailIcon className="h-4 w-4 mr-2 text-gray-400"/> Name on Envelope</dt>
                    <dd className="pl-6">{envelopeName || 'Not specified'}</dd>
                  </div>
             </dl>
           </CardContent>
         </Card>
         
         {recipientType !== 'myself' && (
             <Card>
                <CardHeader className="bg-legacy-cream/30">
                 <div className="flex justify-between items-center">
                   <CardTitle className="text-xl">Your Information</CardTitle>
                   <Button variant="ghost" size="sm" className="text-legacy-green" onClick={() => handleEdit(STEPS.PURCHASER_INFO)}>
                     <Edit2 className="h-4 w-4 mr-2" /> Edit
                   </Button>
                 </div>
               </CardHeader>
               <CardContent className="pt-6">
                  <dl className="space-y-4">
                   <div><dt>Name</dt><dd>{purchaser.fullName || 'Not provided'}</dd></div>
                   <div><dt>Email</dt><dd>{purchaser.email || 'Not provided'}</dd></div>
                  </dl>
                </CardContent>
             </Card>
         )}
      </div>
      
      <Card className="mb-8">
          <CardHeader className="bg-legacy-cream/30">
           <div className="flex justify-between items-center">
             <CardTitle className="text-xl">Personalized Cards</CardTitle>
             <Button variant="ghost" size="sm" className="text-legacy-green" onClick={() => handleEdit(STEPS.EDITION_DETAILS)}>
               <Edit2 className="h-4 w-4 mr-2" /> Edit Cards
             </Button>
           </div>
         </CardHeader>
         <CardContent className="pt-6">
           <div className="flex items-center justify-between mb-4">
             <span>Completed Cards</span>
             <span className="font-medium text-legacy-green">{completedCards} of 12</span>
           </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
             {Object.entries(cards).map(([month, card]: [string, any]) => (
               <div key={month} className={`border rounded-md p-3 text-center ${card?.title && card?.story ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}> 
                 <div className="text-xs uppercase font-medium text-gray-500 mb-1">{MONTH_NAMES[month as keyof typeof MONTH_NAMES] || month}</div>
                 <div className="text-sm font-medium truncate" title={card?.title}>{card?.title || 'Untitled'}</div>
                 <div className="h-5 flex items-center justify-center mt-1">{card?.title && card?.story && <CheckCircle className="h-4 w-4 text-green-500" />}</div>
               </div>
             ))}
           </div>
         </CardContent>
      </Card>
      
      {isPayable && (
          <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
             <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>
            {isLoadingPaymentIntent && (
              <div className="flex items-center justify-center p-8 text-gray-600">
                <Loader2 className="mr-3 h-6 w-6 animate-spin text-legacy-green" />
                <span>Initializing secure payment form...</span>
              </div>
            )}

            {paymentError && !isLoadingPaymentIntent && (
              <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
                 <AlertCircle className="h-5 w-5 mr-3 text-red-500" />
                 <span>Error: {paymentError}</span>
              </div>
            )}
            
            {clientSecret && stripeElementsOptions && !paymentError && !isLoadingPaymentIntent && (
              <Elements options={stripeElementsOptions} stripe={stripePromise}>
                <CheckoutForm isExternallySubmitting={isSubmitting} /> 
              </Elements>
            )}
          </div>
      )}
      
      <div className="bg-legacy-cream/50 p-6 rounded-lg shadow-sm mb-8">
         <div className="flex justify-between items-center">
           <span className="text-lg font-semibold text-gray-700">Total Price</span>
           <span className="text-xl font-bold text-legacy-green">
             {totalPrice !== null 
               ? `$${totalPrice}` 
               : (isConcierge ? 'Price determined offline' : 'Calculating...')}
           </span>
         </div>
       </div>
      
      {!isMobile && (
      <div className="flex justify-between items-center pt-6 border-t">
         <Button
            type="button"
            variant="outline"
            onClick={handleBack} 
            className="text-legacy-dark/60 hover:text-legacy-green border-legacy-cream"
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {isPayable && (
            <Button
              size="lg"
              className="px-8 py-3 text-base bg-legacy-green text-white hover:bg-legacy-green/90"
              onClick={handlePlaceOrder}
              disabled={isLoadingPaymentIntent || !clientSecret || !!paymentError || isSubmitting}
            >
              {isSubmitting || (isLoadingPaymentIntent && !clientSecret) ? (
                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                 <Lock className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? 'Processing Order...' : 'Place Order Now'}
            </Button>
          )}

          {isConcierge && (
            <div className="text-right">
                <Button 
                    size="lg"
                    className="px-8 py-3 text-base bg-legacy-green text-white hover:bg-legacy-green/90"
                >
                    Submit Inquiry
                </Button>
            </div>
          )}
       </div>
      )}
        
       <p className="text-sm text-gray-500 mt-4 text-center">
          {isPayable 
           ? 'Your order will be securely processed and delivered upon completion.' 
           : 'Your concierge inquiry will be submitted.'}
       </p>
       
    </div>
  );
};

export default ReviewCheckout;
