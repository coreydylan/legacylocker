import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionData } from '@/lib/sessionManager';
import { CheckCircle, Edit2, ShoppingCart } from 'lucide-react';

interface ReviewCheckoutProps {
  sessionData: SessionData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
}

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

const ReviewCheckout: React.FC<ReviewCheckoutProps> = ({ 
  sessionData,
  onEdit,
  onSubmit
}) => {
  // Count completed cards
  const completedCards = Object.entries(sessionData.cards).filter(
    ([_, card]) => card.title.trim() !== '' && card.story.trim() !== ''
  ).length;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          Review Your Order
        </h1>
        <p className="text-lg text-gray-600">
          Please review your personalized keepsake before proceeding to checkout.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Recipient Information */}
        <Card>
          <CardHeader className="bg-legacy-cream/30">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Recipient</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-legacy-green"
                onClick={() => onEdit(1)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Gift Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {sessionData.recipientType === 'myself' 
                    ? 'For Myself' 
                    : sessionData.recipientType === 'individual'
                      ? 'For an Individual'
                      : 'For a Couple'}
                </dd>
              </div>
              
              {sessionData.recipientType !== 'myself' && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Recipient</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {sessionData.recipientType === 'individual' 
                      ? `${sessionData.recipient.firstName} ${sessionData.recipient.lastName}`
                      : `${sessionData.recipient.recipient1FirstName} ${sessionData.recipient.recipient1LastName} & ${sessionData.recipient.recipient2FirstName} ${sessionData.recipient.recipient2LastName}`}
                  </dd>
                </div>
              )}
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {sessionData.recipient.relationship || 'Not specified'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        {/* Purchaser Information */}
        <Card>
          <CardHeader className="bg-legacy-cream/30">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Your Information</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-legacy-green"
                onClick={() => onEdit(2)}
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
                  {sessionData.purchaser.fullName || 'Not provided'}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {sessionData.purchaser.email || 'Not provided'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      {/* Card Summary */}
      <Card className="mb-8">
        <CardHeader className="bg-legacy-cream/30">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Personalized Cards</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-legacy-green"
              onClick={() => onEdit(4)}
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
              {Object.entries(sessionData.cards).map(([month, card]) => (
                <div 
                  key={month} 
                  className={`
                    border rounded-md p-3 text-center
                    ${card.title && card.story 
                      ? 'border-legacy-green/30 bg-legacy-cream/20' 
                      : 'border-gray-200'}
                  `}
                >
                  <div className="text-xs uppercase font-medium mb-1 text-gray-500">
                    {month}
                  </div>
                  <div className="text-sm font-medium truncate" title={card.title}>
                    {card.title || 'Untitled'}
                  </div>
                  {card.title && card.story && (
                    <CheckCircle className="h-4 w-4 mx-auto mt-2 text-legacy-green" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Submit Order */}
      <div className="text-center">
        <Button
          size="lg"
          className="px-8 py-6 text-lg"
          onClick={onSubmit}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Proceed to Checkout
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Your order will be carefully crafted and delivered upon completion of payment.
        </p>
      </div>
    </div>
  );
};

export default ReviewCheckout;
