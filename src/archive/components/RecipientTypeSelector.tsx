import React from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { User, Users, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const RecipientTypeSelector: React.FC = () => {
  const { sessionData, updateSessionField } = useSession();
  const selectedType = sessionData?.recipientType;

  const handleTypeSelect = (type: 'myself' | 'individual' | 'couple') => {
    updateSessionField('recipientType', type);
  };

  const options = [
    {
      id: 'myself',
      label: 'For Myself',
      description: "I'm purchasing this subscription for my own enjoyment.",
      icon: User,
    },
    {
      id: 'individual',
      label: 'For an Individual',
      description: "I'm giving this to one special person.",
      icon: Heart,
    },
    {
      id: 'couple',
      label: 'For a Couple',
      description: "A shared gift for two people in a relationship.",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium mb-2">Is this a gift for yourself or someone else?</h2>
        <p className="text-muted-foreground">Select who will be receiving this gift.</p>
      </div>

      <div className="grid gap-4">
        {options.map((option) => {
          const isSelected = selectedType === option.id;
          const Icon = option.icon;
          
          return (
            <div
              key={option.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                isSelected 
                  ? "border-legacy-green bg-legacy-green/5" 
                  : "border-gray-200 hover:border-gray-300 bg-white"
              )}
              onClick={() => handleTypeSelect(option.id as 'myself' | 'individual' | 'couple')}
            >
              <div className={cn(
                "rounded-full p-2 flex-shrink-0",
                isSelected ? "bg-legacy-green text-white" : "bg-gray-100 text-gray-500"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-medium">{option.label}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              
              <div className="flex-shrink-0 flex items-center">
                <div className={cn(
                  "h-5 w-5 rounded-full border-2",
                  isSelected 
                    ? "border-legacy-green bg-legacy-green" 
                    : "border-gray-300"
                )}>
                  {isSelected && (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipientTypeSelector; 