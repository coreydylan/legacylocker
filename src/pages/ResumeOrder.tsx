
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionByToken, isTokenExpired } from '@/services/sessionService';
import { useToast } from '@/hooks/use-toast';

const ResumeOrder = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        navigate('/');
        return;
      }

      try {
        // Try to retrieve the session
        const session = await getSessionByToken(token);
        
        if (!session) {
          // Token not found
          toast({
            title: "Invalid link",
            description: "The link you followed appears to be invalid or expired.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        if (isTokenExpired(session)) {
          // Token expired
          toast({
            title: "Link expired",
            description: "This order link has expired. Please start a new order.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        // Valid token, redirect to index with token in path to trigger resume flow
        navigate(`/resume-order/${token}`, { replace: true });
        
      } catch (error) {
        console.error('Error checking resume token:', error);
        toast({
          title: "Error",
          description: "There was a problem loading your saved order. Please try again.",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    checkToken();
  }, [token, navigate, toast]);

  // Show loading state while checking token
  return (
    <div className="flex items-center justify-center min-h-screen bg-legacy-cream">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-legacy-green mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-legacy-dark mb-2">Loading your saved order...</h2>
        <p className="text-legacy-dark/70">Please wait while we restore your progress.</p>
      </div>
    </div>
  );
};

export default ResumeOrder;
