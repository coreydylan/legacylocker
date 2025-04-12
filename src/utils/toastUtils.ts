
import { toast } from "@/components/ui/use-toast";

/**
 * Utility functions for displaying toast messages
 */

export const showSuccessToast = (title: string, description: string, duration = 5000) => {
  toast({
    title,
    description,
    duration,
  });
};

export const showErrorToast = (title: string, description: string, duration = 5000) => {
  toast({
    title,
    description,
    variant: "destructive",
    duration,
  });
};
