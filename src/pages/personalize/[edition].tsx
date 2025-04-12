import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PersonalizationContainer from '@/components/PersonalizationContainer';

const PersonalizePage: React.FC = () => {
  const { edition } = useParams<{ edition: string }>();
  const navigate = useNavigate();
  const [editionName, setEditionName] = useState<string | undefined>();
  
  useEffect(() => {
    if (edition) {
      // Convert URL slug to display name (e.g., "film-los-angeles" => "Film - Los Angeles")
      const formattedName = edition
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' - ');
      
      setEditionName(formattedName);
    }
  }, [edition]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <PersonalizationContainer 
      editionName={editionName}
      onBack={handleBack}
    />
  );
};

export default PersonalizePage; 