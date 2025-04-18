import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button"; // Assuming you use Shadcn UI Button
import { Loader2, AlertCircle } from 'lucide-react'; // Icons for loading and error states

interface CheckoutFormProps {
  onSuccessfulPayment?: () => void; // Optional callback for success
  isExternallySubmitting?: boolean; // Accept the prop from the parent
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccessfulPayment, isExternallySubmitting }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the PaymentIntent client secret from the URL if redirected
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    // Note: We don't typically *need* to retrieve the PI status here on mount
    // if the user is *just* loading the form. Status retrieval is more common
    // on the return_url page. Leaving this commented as example.
    /*
    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          onSuccessfulPayment?.();
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
    */
  }, [stripe, onSuccessfulPayment]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission if called from form event
    e?.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log("Stripe.js has not loaded yet.");
      setMessage("Payment system is not ready. Please wait a moment and try again.");
      return;
    }

    // Use internal loading state
    setIsLoading(true);
    setMessage(null); // Clear previous messages

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect back to the SAME url to keep the user inside the modal.
        return_url: window.location.href,
      },
      // Only redirect when required for additional auth (e.g., 3‑D Secure)
      redirect: 'if_required',
    });

    // If no immediate error and paymentIntent available, check status
    if (!error && paymentIntent?.status === 'succeeded') {
      onSuccessfulPayment?.();
    }

    // Handle immediate error scenarios
    if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An error occurred with your payment details.");
        } else {
            setMessage("An unexpected error occurred. Please try again.");
        }
        console.error("Stripe confirmation error:", error);
        // If triggered externally, we might need a way to signal failure back up?
    } else {
      // If no error but paymentIntent not succeeded yet, we can show processing message
      setMessage('Processing payment...');
    }

    // Reset internal loading state regardless of external trigger
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const // Or "accordion", etc.
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={paymentElementOptions}/>
      
      {/* OPTION 1: Keep internal button but disable based on external state */}
      {/* 
      <Button
        // Disable if internal loading OR external submitting is happening
        disabled={isLoading || isExternallySubmitting || !stripe || !elements}
        id="submit" // Keep ID if needed, though maybe rename
        type="submit" // Ensure it can submit the form
        size="lg"
        className="w-full text-base bg-legacy-green text-white hover:bg-legacy-green/90"
      >
         <span id="button-text">
           {isLoading ? (
             <div className="flex items-center justify-center">
               <Loader2 className="mr-2 h-5 w-5 animate-spin" />
               Processing...
             </div>
            ) : (
             "Complete Payment Internally"
            )}
         </span>
       </Button>
      */}

      {/* OPTION 2: Hide the internal button entirely */}
      {/* No button rendered here, submission is handled by the parent component */}

      {/* Show any error or success messages (important feedback) */}
      {message && (
        <div id="payment-message" className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-200">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            {message}
        </div>
      )}
    </form>
  );
}

export default CheckoutForm; 