import React from 'react';
import { CheckCircle, Mail, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/lib/sessionStore';
import { useSessionManager } from '@/hooks/useSessionManager';

/**
 * Displays a friendly confirmation message after an order is successfully processed.
 * This component is meant to be rendered *inside* the onboarding modal (no route changes).
 */
const OrderConfirmationScreen: React.FC = () => {
  const { session, resetSession } = useSessionStore((state) => ({
    session: state.session,
    resetSession: state.resetSession,
  }));

  const { setSessionStatus } = useSessionManager();

  // Extract purchaser email & edition type for messaging
  const purchaserEmail = session.purchaser?.email || 'your email';
  const editionType = session.selectedEdition?.type || 'signature';
  const editionLabel = session.selectedEdition?.label || '';

  // Determine edition‑specific explanatory text
  const editionMessage = (() => {
    switch (editionType) {
      case 'custom':
      case 'concierge':
        return 'Our team will get started on your story cards and will reach out within 48 hours with a preview for your approval.';
      case 'signature':
      default:
        return "We'll begin printing your cards right away. The first story will be shipped to your recipient next month — and then every month after that!";
    }
  })();

  // Optional recipient summary
  const recipientSummary = (() => {
    const r = session.recipient;
    if (!r) return null;
    const recipientName = r.type === 'couple'
      ? `${r.recipient1FirstName || ''} ${r.recipient1LastName || ''} & ${r.recipient2FirstName || ''} ${r.recipient2LastName || ''}`.trim()
      : `${r.firstName || ''} ${r.lastName || ''}`.trim();
    if (!recipientName) return null;
    return `${recipientName}`;
  })();

  const handleSendAnotherGift = () => {
    // Reset session state & bring user back to story selector
    resetSession();
    setSessionStatus('idle');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center space-y-6">
      <CheckCircle className="w-16 h-16 text-legacy-green" />
      <h1 className="text-2xl font-semibold text-legacy-green">Thanks! Your order is complete.</h1>

      <p className="max-w-md text-gray-700">
        We've emailed a receipt to <strong>{purchaserEmail}</strong> and will take it from here.
      </p>

      <p className="max-w-md text-gray-700">{editionMessage}</p>

      {/* Optional summary */}
      {(recipientSummary || editionLabel) && (
        <div className="bg-legacy-green/5 border border-legacy-green/20 rounded-lg px-6 py-4 text-sm text-left w-full max-w-sm">
          {recipientSummary && (
            <div className="flex items-center mb-2">
              <Gift className="w-4 h-4 mr-2 text-legacy-green" />
              <span><strong>Recipient:</strong> {recipientSummary}</span>
            </div>
          )}
          {editionLabel && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-legacy-green" />
              <span><strong>Edition:</strong> {editionLabel}</span>
            </div>
          )}
        </div>
      )}

      <Button
        onClick={handleSendAnotherGift}
        className="bg-legacy-green hover:bg-legacy-green/90 text-white px-6 py-3"
      >
        Send another gift
      </Button>
    </div>
  );
};

export default OrderConfirmationScreen; 