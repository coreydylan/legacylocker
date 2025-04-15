import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionData, Recipient, Purchaser } from '@/lib/sessionManager';
import { CheckCircle, Edit2, ShoppingCart, ChevronLeft, Home, Mail as MailIcon, Loader2, AlertCircle } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';
import { formatShipToName } from '@/lib/utils/formatShipToName';
import { calculateSessionPrice } from '@/lib/pricing';

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/payment/CheckoutForm'; // Import the new form

// Load Stripe outside of component render
// Use import.meta.env for Vite environment variables
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
  const { session, setCurrentStep, prevStep } = useSessionStore();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

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

  // Fetch PaymentIntent client secret when component mounts or price changes
  useEffect(() => {
    // Only fetch if we intend to show the form, have a price, and a session ID
    if (showPaymentForm && totalPriceInCents > 0 && typedSession?.sessionId) {
      setIsLoadingPaymentIntent(true);
      setPaymentError(null);
      setClientSecret(null); // Reset secret before fetching

      // Try fetching without the leading slash
      fetch('api/create-payment-intent', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            amount_frontend: totalPriceInCents, // Send for reference
            // Send the actual amount field expected by the API
            amount: totalPriceInCents, 
            sessionId: typedSession.sessionId // Crucial for server-side validation
        }),
      })
      .then((res) => {
          if (!res.ok) {
              // Try to parse the error message from the response body
              return res.json().then(err => { throw new Error(err.error || `Server error: ${res.status}`) });
          }
          return res.json();
      })
      .then((data) => {
          if (data.clientSecret) {
              setClientSecret(data.clientSecret);
          } else {
              // This case might happen if the server responded 200 OK but didn't send the secret
              throw new Error('Client secret not received from server.');
          }
      })
      .catch((error) => {
        console.error("Failed to fetch payment intent:", error);
        setPaymentError(error.message || "Failed to initialize payment. Please check your details or try again later.");
        setShowPaymentForm(false); // Hide form on error to prevent trying to pay
      })
      .finally(() => {
        setIsLoadingPaymentIntent(false);
      });
    } else if (showPaymentForm && totalPriceInCents <= 0) {
        // Handle cases like Concierge or zero price explicitly
        if (typedSession.selectedEdition?.type === 'concierge') {
             setPaymentError("Concierge service payment is handled offline.");
        } else {
            setPaymentError("Payment is not required as the total is zero.");
        }
        setShowPaymentForm(false); 
    }
    // Dependency array: fetch only when showPaymentForm, price, or sessionId changes
  }, [showPaymentForm, totalPriceInCents, typedSession?.sessionId]);

  
  const handleEdit = (step: number) => {
    setShowPaymentForm(false); // Hide payment form if user goes back to edit
    setCurrentStep(step);
  };
  
  // Renamed original handleSubmit to handleShowPayment
  const handleShowPayment = () => {
    console.log("Proceeding to payment...");
    // Reset state before potentially fetching new intent
    setClientSecret(null); 
    setPaymentError(null);
    setIsLoadingPaymentIntent(false); // Ensure loading state is reset
    setShowPaymentForm(true); // This triggers the useEffect to fetch the intent
  };

  const handleCancelPayment = () => {
    setShowPaymentForm(false);
    setClientSecret(null);
    setPaymentError(null);
    setIsLoadingPaymentIntent(false);
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

  // Options for Stripe Elements - only create when clientSecret is available
  const stripeElementsOptions = clientSecret ? {
    clientSecret,
    appearance: { theme: 'stripe' as const },
  } : undefined;
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          {showPaymentForm ? 'Complete Your Payment' : 'Review Your Order'}
        </h1>
        <p className="text-lg text-gray-600">
          {showPaymentForm 
            ? 'Please enter your payment details below.'
            : 'Please review your personalized keepsake before proceeding.'}
        </p>
      </div>
      
      {/* --- Global Payment Error Display (if intent fetch failed) --- */} 
      {paymentError && !showPaymentForm && (
          <div className="flex items-center p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5 mr-3 text-red-500" />
              <span>Error: {paymentError}</span>
          </div>
      )}

      {/* --- Conditional Rendering: Order Summary vs Payment Form --- */} 
      {!showPaymentForm ? (
        <>
          {/* --- Order Summary Section --- */} 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Recipient/Your Info Card */} 
            <Card>
              <CardHeader className="bg-legacy-cream/30"> 
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">
                    {recipientType === 'myself' ? 'Your Information' : 'Recipient'}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-legacy-green" disabled={showPaymentForm}
                    onClick={() => handleEdit(recipientType === 'myself' ? STEPS.PURCHASER_INFO : STEPS.RECIPIENT_INFO)} 
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  {/* Recipient/Purchaser Details */} 
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
                          {recipientType === 'individual' ? 'For an Individual' : 'For a Couple'}
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
                  {/* Shipping Address */} 
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Home className="h-4 w-4 mr-2 text-gray-400"/>
                      Shipping Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 pl-6">
                      {formatAddress()} 
                    </dd>
                  </div>
                  {/* Envelope Name */} 
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
            
            {/* Purchaser Info Card (only if gifting) */} 
            {recipientType !== 'myself' && (
                <Card>
                  <CardHeader className="bg-legacy-cream/30">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">Your Information</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-legacy-green" disabled={showPaymentForm}
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
          
          {/* Personalized Cards Summary */} 
          <Card className="mb-8">
             <CardHeader className="bg-legacy-cream/30">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Personalized Cards</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-legacy-green" disabled={showPaymentForm}
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
                          : 'border-gray-200'} transition-colors duration-200
                      `}
                    >
                      <div className="text-xs uppercase font-medium mb-1 text-gray-500">
                        {MONTH_NAMES[month as keyof typeof MONTH_NAMES] || month}
                      </div>
                      <div className="text-sm font-medium truncate" title={card?.title}>
                        {card?.title || 'Untitled'}
                      </div>
                      <div className="h-5 flex items-center justify-center mt-1">
                        {card?.title && card?.story && 
                          <CheckCircle className="h-4 w-4 text-legacy-green" />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Total Price Summary */} 
          <div className="bg-legacy-cream/50 p-6 rounded-lg shadow-sm mb-8">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total Price</span>
              <span className="text-xl font-bold text-legacy-green">
                {totalPrice !== null 
                  ? `$${totalPrice}` 
                  : (typedSession.selectedEdition?.type === 'concierge' 
                      ? 'Price determined offline' 
                      : 'Calculating...')}
              </span>
            </div>
          </div>
          {/* --- End Order Summary Section --- */} 
        </>
      ) : (
        <> 
          {/* --- Payment Form Section --- */} 
          <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
            {/* Loading state while fetching payment intent */} 
            {isLoadingPaymentIntent && (
              <div className="flex items-center justify-center p-8 text-gray-600">
                <Loader2 className="mr-3 h-6 w-6 animate-spin text-legacy-green" />
                <span>Initializing secure payment form...</span>
              </div>
            )}

            {/* Error state if payment intent fetch failed (handled above as well) */} 
            {paymentError && !isLoadingPaymentIntent && (
              <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
                 <AlertCircle className="h-5 w-5 mr-3 text-red-500" />
                 <span>Error: {paymentError}</span>
                 {/* Optionally add a retry button here */}
              </div>
            )}
            
            {/* Render Stripe Elements only when clientSecret is available */} 
            {clientSecret && stripeElementsOptions && !paymentError && !isLoadingPaymentIntent && (
              <Elements options={stripeElementsOptions} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
          {/* --- End Payment Form Section --- */}
        </>
      )}
      
      {/* --- Navigation Buttons --- */} 
      <div className="flex justify-between items-center pt-6 border-t">
         {/* Back/Cancel Button */} 
         <Button
            type="button"
            variant="outline"
            onClick={showPaymentForm ? handleCancelPayment : prevStep} 
            className="text-legacy-dark/60 hover:text-legacy-green border-legacy-cream"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {showPaymentForm ? 'Cancel Payment' : 'Previous'}
          </Button>
          
          {/* Proceed Button (visible only in summary view if price > 0) */} 
          {!showPaymentForm && totalPriceInCents > 0 && (
            <Button
              size="lg"
              className="px-8 py-3 text-base bg-legacy-green text-white hover:bg-legacy-green/90"
              onClick={handleShowPayment}
              disabled={isLoadingPaymentIntent} // Disable while potentially loading intent
            >
              {isLoadingPaymentIntent ? (
                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                 <ShoppingCart className="mr-2 h-5 w-5" />
              )}
              Proceed to Checkout
            </Button>
          )}

          {/* Concierge Info/Action (visible only in summary view if concierge) */} 
          {!showPaymentForm && typedSession.selectedEdition?.type === 'concierge' && (
            <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Concierge service details and payment will be handled offline.</p>
                <Button 
                    size="lg"
                    className="px-8 py-3 text-base bg-legacy-green text-white hover:bg-legacy-green/90"
                    // onClick={handleSubmitConcierge} // Define a function to submit concierge details
                >
                    Submit Inquiry
                </Button>
            </div>
          )}
       </div>
        
       {/* Footer Text (visible only in summary view) */} 
       {!showPaymentForm && (
         <p className="text-sm text-gray-500 mt-4 text-center">
            Your order will be carefully crafted and delivered upon completion of payment.
         </p>
       )}
    </div>
  );
};

export default ReviewCheckout;
