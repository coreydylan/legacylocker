export const debugGoogleMapsLoading = () => {
  console.log('Google Maps Debug Info:');
  console.log('- window.google exists:', typeof window !== 'undefined' && 'google' in window);
  console.log('- maps object exists:', typeof window !== 'undefined' && 'google' in window && 'maps' in (window as any).google);
  console.log('- places object exists:', typeof window !== 'undefined' && 'google' in window && 'maps' in (window as any).google && 'places' in (window as any).google.maps);
  console.log('- Autocomplete exists:', typeof window !== 'undefined' && 'google' in window && 'maps' in (window as any).google && 'places' in (window as any).google.maps && 'Autocomplete' in (window as any).google.maps.places);
  
  if (typeof window !== 'undefined' && !('google' in window)) {
    console.error('Google Maps script failed to load. Please check your API key and script loading strategy.');
  }
};

export const getGoogleMapsApiUrl = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is not defined in environment variables');
    return null;
  }
  return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
}; 