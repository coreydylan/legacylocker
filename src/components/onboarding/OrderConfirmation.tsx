import React from 'react';
import { CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '@/lib/sessionStore';
import { useModalStore } from '@/lib/modalStore';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useSessionStore();
  const { closeOnboarding } = useModalStore();

  const handleFinish = () => {
    resetSession();
    closeOnboarding();
    navigate('/'); // Optional: Navigate to homepage
  };

  return (
    <div className="max-w-lg mx-auto text-center py-12 px-4">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
      <h1 className="text-3xl font-manrope font-semibold text-legacy-green mb-4">
        Order Confirmed!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your purchase. Your Legacy Locker is being prepared.
        You will receive an email confirmation shortly.
      </p>
      <Button 
        size="lg" 
        className="bg-legacy-green hover:bg-legacy-green/90"
        onClick={handleFinish}
      >
        <Package className="mr-2 h-5 w-5" />
        Finish & Go Home
      </Button>
    </div>
  );
};

export default OrderConfirmation; 