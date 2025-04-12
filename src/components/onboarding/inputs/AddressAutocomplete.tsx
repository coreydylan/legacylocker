import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLoadScript, Libraries } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Define the type for the structured address expected by the parent component
export interface StructuredAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  full?: string; // Include the full formatted address
}

// Correctly define the type alias for Google Place Predictions
type PlacePrediction = google.maps.places.AutocompletePrediction;

interface AddressAutocompleteProps {
  value: string; // The current input value (likely the full address string)
  onChange: (value: string) => void; // Callback for raw input changes
  onSelect: (address: StructuredAddress) => void; // Callback when a place is selected
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  error?: string;
}

const libraries: Libraries = ['places'];

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  className,
  inputClassName,
  placeholder = 'Start typing an address...',
  error,
}) => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | undefined>(undefined);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  // Track if the last interaction was a selection
  const wasJustSelected = useRef(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  // Initialize services once the script is loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      // Need a DOM element for PlacesService (can be hidden)
      const mapDiv = document.createElement('div'); 
      placesServiceRef.current = new window.google.maps.places.PlacesService(mapDiv);
      console.log('AddressAutocomplete: Google services initialized.');
    } else {
      console.log('AddressAutocomplete: Waiting for Google script...');
    }
  }, [isLoaded]);

  // Function to ensure a session token exists
  const ensureSessionToken = useCallback(() => {
    let currentToken = sessionToken;
    if (!currentToken && window.google) { // Check window.google is loaded
      currentToken = new window.google.maps.places.AutocompleteSessionToken();
      setSessionToken(currentToken);
      console.log('AddressAutocomplete: Generated new AutocompleteSessionToken instance.');
    }
    return currentToken;
  }, [sessionToken]);

  const fetchPredictions = useCallback((inputValue: string) => {
    const currentToken = ensureSessionToken(); // Get or create token
    if (!autocompleteServiceRef.current || !inputValue || !currentToken) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { 
        input: inputValue,
        sessionToken: currentToken, // Pass the token object
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
          // Don't reset token here, might be transient error
          console.warn(`AddressAutocomplete: Prediction fetch failed - Status: ${status}`);
        }
      }
    );
  }, [ensureSessionToken]);

  // Debounced prediction fetching
  useEffect(() => {
    const handler = setTimeout(() => {
      // Check the flag before fetching
      if (value.trim() && !isLoadingDetails && !wasJustSelected.current) {
        fetchPredictions(value);
      } else if (!value.trim()) {
        setPredictions([]);
        setShowPredictions(false);
        setSessionToken(undefined); 
        console.log('AddressAutocomplete: Input cleared, session token reset.');
      }
      // Reset the flag after the debounce period allows potential fetch
      wasJustSelected.current = false;
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [value, fetchPredictions, isLoadingDetails]); // Add isLoadingDetails dependency

  // Function to handle selection of a prediction
  const handleSelectPrediction = (prediction: PlacePrediction) => {
    const currentToken = sessionToken; // Capture token used for predictions
    if (!placesServiceRef.current || !prediction.place_id || !currentToken) {
      console.error('AddressAutocomplete: Cannot fetch details - missing service, place_id, or token.');
      return; 
    }
    
    // Set the flag to prevent immediate refetch
    wasJustSelected.current = true; 
    // Immediately hide predictions and set loading state
    setShowPredictions(false);
    setIsLoadingDetails(true); 
    onChange(prediction.description); // Update input field optimistically

    console.log(`AddressAutocomplete: Fetching details for Place ID: ${prediction.place_id}`);

    placesServiceRef.current.getDetails(
      { placeId: prediction.place_id, fields: ['address_components', 'formatted_address'], sessionToken: currentToken },
      (place, status) => {
        setSessionToken(undefined); // Consume/reset token regardless of success/failure
        console.log('AddressAutocomplete: Session token consumed/reset.');

        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          console.log('AddressAutocomplete: Place details received', place);
          const address = parseAddress(place);
          onSelect(address); // Pass structured address to parent
          onChange(address.full || prediction.description); // Update input with full address
        } else {
          console.error(`AddressAutocomplete: Place details fetch failed - Status: ${status}`);
          // Revert input value if details fetch fails?
          // Or clear structured address in parent?
        }
        // Set loading false AFTER processing is done and parent state has likely updated
        setIsLoadingDetails(false); 
      }
    );
  };

  // Handle user typing: reset the selection flag
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    wasJustSelected.current = false; 
    onChange(e.target.value);
  };

  // Handle focus to generate a token if needed
  const handleFocus = () => {
    ensureSessionToken(); // Generate token on focus if not already present
    // Show existing predictions on focus only if not loading and not just selected
    if (!isLoadingDetails && !wasJustSelected.current && predictions.length > 0 && value.trim()) {
        setShowPredictions(true);
    }
  };

  // Handle clicks outside the input/predictions list to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click target is outside the input container div
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loadError) {
    console.error("Google Maps script load error:", loadError);
    return <div className="text-red-500 text-sm">Error loading Google Maps. Check API key/config.</div>;
  }

  if (!isLoaded) {
    return <div className="h-12 flex items-center justify-center text-sm text-gray-500">Loading address search...</div>;
  }

  return (
    <div className={cn("relative w-full", className)} ref={inputRef}>
      <Input
        type="text"
        className={cn(
          "h-12",
          inputClassName,
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        )}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange} // Use the new handler for input changes
        onFocus={handleFocus} // Use handleFocus to ensure token exists
        disabled={isLoadingDetails} // Disable input while loading details
        aria-invalid={!!error}
        aria-describedby={error ? "address-error" : undefined}
        aria-autocomplete="list"
        aria-expanded={showPredictions}
        aria-controls="address-predictions"
      />

      {isLoadingDetails && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      )}

      {showPredictions && !isLoadingDetails && predictions.length > 0 && (
        <ul 
          id="address-predictions"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              onClick={() => handleSelectPrediction(prediction)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectPrediction(prediction); }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              role="option"
              aria-selected={false} // Basic implementation, could add keyboard navigation state
              tabIndex={0} // Make it focusable
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p id="address-error" className="text-xs text-red-600 pt-1">{error}</p>
      )}
    </div>
  );
};

// Helper function to parse Google Place object into our desired structure
function parseAddress(place: google.maps.places.PlaceResult): StructuredAddress {
  const components: { [key: string]: string } = {};
  place.address_components?.forEach((comp) => {
    // Use the first type as the key (e.g., 'street_number', 'route', 'locality')
    const type = comp.types[0]; 
    if (type) {
      components[type] = comp.long_name;
    }
  });

  return {
    street: `${components['street_number'] || ''} ${components['route'] || ''}`.trim(),
    city: components['locality'] || components['sublocality'] || '', // Fallback for city
    state: components['administrative_area_level_1'] || '',
    postalCode: components['postal_code'] || '',
    country: components['country'] || '',
    full: place.formatted_address || '', // Use the formatted address provided by Google
  };
}

export default AddressAutocomplete; 