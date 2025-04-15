import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';
import { AlertCircle, CheckCircle, Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Load Stripe outside of component render
// Use the same publishable key as your checkout page
// Use import.meta.env for Vite environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<PaymentIntent.Status | 'loading' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe publishable key is available via import.meta.env
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      setMessage('Configuration error: Stripe publishable key is missing.');
      setStatus('error');
      return;
    }

    // Get parameters from the URL using URLSearchParams
    const queryParams = new URLSearchParams(location.search);
    const clientSecret = queryParams.get('payment_intent_client_secret');
    const pi_id = queryParams.get('payment_intent');

    // Check if parameters are missing
    if (!clientSecret || !pi_id) {
      // Only set error once search params are available and if status is still idle
      if (location.search && status === 'idle') { 
         setMessage('Error: Missing payment information in URL. Please contact support if payment was made.');
         setStatus('error');
      }
      return; 
    }

    // Prevent re-fetching if already loaded or errored
    if (status !== 'idle') {
        return;
    }

    setPaymentIntentId(pi_id);
    setStatus('loading');

    stripePromise.then(stripe => {
      if (!stripe) {
        setMessage('Failed to initialize Stripe.');
        setStatus('error');
        return;
      }

      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent, error }) => {
        if (error) {
            console.error("Stripe retrievePaymentIntent error:", error);
            setMessage(`Error retrieving payment status: ${error.message}`);
            setStatus('error');
            return;
        }
          
        if (!paymentIntent) {
             setMessage('Error: Could not retrieve payment details.');
             setStatus('error');
             return;
        }

        console.log("Retrieved Payment Intent Status:", paymentIntent.status);
        setStatus(paymentIntent.status);

        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Payment successful! Your order is confirmed.');
            // TODO: Perform post-payment actions here if needed
            // - Clear the user's cart/session data from localStorage/store
            // - Redirect to an order confirmation page with more details
            // - Send a confirmation email (usually done server-side via webhooks)
            // Example: localStorage.removeItem('legacyLockerSession');
            break;
          case 'processing':
            setMessage('Your payment is processing. We will notify you when it is complete.');
            break;
          case 'requires_payment_method':
            setMessage('Payment failed. Please go back and try another payment method.');
            // Example: navigate('/checkout'); // Redirect back to checkout?
            break;
          default:
            setMessage('Something went wrong with your payment. Please contact support.');
            break;
        }
      });
    });

  // Dependency array: Run effect when location.search changes (or on initial load)
  }, [location.search, status]); 

  const renderStatusIcon = () => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'processing':
      case 'loading':
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
      case 'requires_payment_method':
      case 'error':
        return <AlertCircle className="h-16 w-16 text-red-500" />;
      default:
        // Render nothing or a placeholder while idle before params are read
        return <div className="h-16 w-16"></div>; 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6 flex justify-center">
            {renderStatusIcon()}
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Payment Status
        </h1>
        
        <p className="text-gray-600 mb-6">
          {message || (status === 'idle' ? 'Loading payment details...' : 'Checking payment status...')}
        </p>

        {paymentIntentId && (
            <p className="text-xs text-gray-400 mb-6">Payment ID: {paymentIntentId}</p>
        )}

        <Link to="/">
            <Button 
                variant="outline" 
                className="w-full text-legacy-green border-legacy-green hover:bg-legacy-green/10"
            >
                 <Home className="h-4 w-4 mr-2" />
                 Go to Homepage
            </Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage; 