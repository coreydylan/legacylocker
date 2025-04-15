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
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccessfulPayment }) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log("Stripe.js has not loaded yet.");
      setMessage("Payment system is not ready. Please wait a moment and try again.");
      return;
    }

    setIsLoading(true);
    setMessage(null); // Clear previous messages

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/checkout/success`, // Use window.location.origin for dynamic base URL
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An error occurred with your payment details.");
        } else {
            setMessage("An unexpected error occurred. Please try again.");
        }
        console.error("Stripe confirmation error:", error);
    } else {
      // Success case is handled by redirection to return_url
      setMessage("Processing payment..."); // Technically won't be seen if redirection is immediate
    }


    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const // Or "accordion", etc.
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={paymentElementOptions}/>
      <Button
        disabled={isLoading || !stripe || !elements}
        id="submit"
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
            "Complete Payment"
           )}
        </span>
      </Button>
      {/* Show any error or success messages */}
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