import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLoadScript, Libraries } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { debugGoogleMapsLoading, getGoogleMapsApiUrl } from '@/lib/utils/googleMapsDebug';
import { Loader2 } from 'lucide-react';
import AddressForm from './AddressForm';

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
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<StructuredAddress | null>(null);
  // Track if the last interaction was a selection
  const wasJustSelected = useRef(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: getGoogleMapsApiUrl()?.split('key=')[1].split('&')[0] || '',
    libraries,
  });

  // Initialize services and debug once the script is loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      try {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        const mapDiv = document.createElement('div');
        placesServiceRef.current = new window.google.maps.places.PlacesService(mapDiv);
        debugGoogleMapsLoading();
        setScriptError(null);
      } catch (error) {
        console.error('Error initializing Google Maps services:', error);
        setScriptError('Failed to initialize Google Maps services. Please refresh the page.');
      }
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
          setSelectedAddress(address);
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

  // Handle address form changes
  const handleAddressFormChange = (newAddress: StructuredAddress) => {
    setSelectedAddress(newAddress);
    onSelect(newAddress);
    onChange(newAddress.full || value);
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
    return (
      <div className="space-y-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("w-full", inputClassName)}
          placeholder="Enter address manually"
        />
        <div className="text-red-500 text-sm">
          Google Maps failed to load. Please check your internet connection or try again later.
        </div>
      </div>
    );
  }

  if (scriptError) {
    return (
      <div className="space-y-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("w-full", inputClassName)}
          placeholder="Enter address manually"
        />
        <div className="text-red-500 text-sm">{scriptError}</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="relative">
        <Input
          type="text"
          value={value}
          disabled
          className={cn("w-full bg-gray-50", inputClassName)}
          placeholder="Loading address search..."
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} ref={inputRef}>
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className={cn(
            "w-full pr-8",
            error && "border-red-500 focus-visible:ring-red-500",
            isLoadingDetails && "bg-gray-50",
            inputClassName
          )}
          placeholder={placeholder}
          disabled={isLoadingDetails}
        />
        {isLoadingDetails && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}

      {showPredictions && !isLoadingDetails && predictions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="py-1">
            {predictions.map((prediction) => (
              <li
                key={prediction.place_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSelectPrediction(prediction)}
              >
                {prediction.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedAddress && (
        <div className="mt-4">
          <AddressForm
            address={selectedAddress}
            onChange={handleAddressFormChange}
            error={error}
          />
        </div>
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