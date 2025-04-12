import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { User, Users, Gift } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';

const RecipientSelector: React.FC = () => {
  const { session, updateSession, nextStep } = useSessionStore();

  const handleSelect = (type: 'myself' | 'individual' | 'couple') => {
    // Update recipient type
    updateSession('recipientType', type);

    // Update recipient structure based on type
    if (type === 'couple') {
      updateSession('recipient', {
        type: 'couple',
        recipient1FirstName: '',
        recipient1LastName: '',
        recipient2FirstName: '',
        recipient2LastName: '',
        relationship: '',
        includeWelcomeCard: false,
        firstName: undefined,
        lastName: undefined,
        birthday: undefined,
      });
    } else {
      updateSession('recipient', {
        type: 'individual',
        firstName: '',
        lastName: '',
        relationship: '',
        includeWelcomeCard: false,
        recipient1FirstName: undefined,
        recipient1LastName: undefined,
        recipient2FirstName: undefined,
        recipient2LastName: undefined,
        recipient1Birthday: undefined,
        recipient2Birthday: undefined,
        anniversary: undefined,
      });
    }

    // Immediately advance to next step
    nextStep();
  };

  const options = [
    {
      id: 'myself' as const,
      label: 'For Myself',
      description: 'Create a personalized keepsake of your own stories and memories.',
      icon: <User className="h-8 w-8" />,
    },
    {
      id: 'individual' as const,
      label: 'For an Individual',
      description: 'Gift a personalized collection of memories to someone special.',
      icon: <Gift className="h-8 w-8" />,
    },
    {
      id: 'couple' as const,
      label: 'For a Couple',
      description: 'Create a shared gift celebrating memories between two people.',
      icon: <Users className="h-8 w-8" />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          Who is this gift for?
        </h1>
        <p className="text-lg text-gray-600">
          Select the recipient to customize your perfect Legacy Locker gift.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`
                cursor-pointer h-full p-6 flex flex-col items-center text-center border-2 transition-colors duration-150
                ${session.recipientType === option.id
                  ? 'border-legacy-green bg-legacy-green/5 ring-2 ring-legacy-green/10'
                  : 'border-gray-200 hover:border-legacy-green/50 hover:bg-legacy-green/5'}
              `}
              onClick={() => handleSelect(option.id)}
            >
              <div className={`
                rounded-full p-4 mb-4 transition-colors duration-150
                ${session.recipientType === option.id
                  ? 'bg-legacy-green text-white'
                  : 'bg-legacy-cream text-legacy-green/80'}
              `}>
                {option.icon}
              </div>

              <h3 className="text-xl font-medium mb-2">{option.label}</h3>

              <p className="text-gray-600 flex-grow mb-4">
                {option.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecipientSelector; 