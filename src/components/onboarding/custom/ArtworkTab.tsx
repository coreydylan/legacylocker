import React, { useState, useEffect, useCallback } from 'react';
import { CustomMonthData } from '@/lib/sessionStore';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; // Import supabase client
import { useSessionStore } from '@/lib/sessionStore'; // To get session ID
import { cn } from '@/lib/utils';

// --- Placeholder File Upload Component ---
// Replace this with your actual file upload implementation
interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
}
const FileUploadPlaceholder: React.FC<FileUploadProps> = ({ onUploadSuccess, currentImageUrl }) => {
  const handlePlaceholderClick = () => {
    // Simulate successful upload with a placeholder URL
    console.log("Placeholder upload clicked. Simulating upload...");
    const placeholderUrl = `/images/placeholder-upload-${Date.now()}.jpg`; 
    onUploadSuccess(placeholderUrl);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-3">
        {currentImageUrl ? (
            <div className="relative">
                <img src={currentImageUrl} alt="Uploaded preview" className="max-h-40 mx-auto rounded" />
                <Button 
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={() => onUploadSuccess('')} // Allow removing/replacing
                >
                    Remove
                </Button>
            </div>
        ) : (
            <>
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload a photo</p>
                <Button variant="outline" size="sm" onClick={handlePlaceholderClick}> 
                    Select File (Placeholder)
                </Button>
            </>
        )}
    </div>
  );
};
// --- End Placeholder ---

interface ArtworkTabProps {
  data: CustomMonthData;
  onUpdate: (update: Partial<CustomMonthData>) => void;
  isLocked?: boolean; // Add isLocked prop
}

const ArtworkTab: React.FC<ArtworkTabProps> = ({ data, onUpdate, isLocked }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const sessionId = useSessionStore(state => state.session.sessionId); // Get session ID for path

  // Effect to create/revoke preview URL
  useEffect(() => {
    // If data already has a photoUrl (from previous upload/session), use that initially
    if (data.photoUrl && !previewUrl) {
        setPreviewUrl(data.photoUrl);
    }
    // Cleanup function
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) { // Only revoke blob URLs
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, data.photoUrl]); // Rerun if previewUrl or data.photoUrl changes

  // --- Upload Function --- 
  const uploadPhoto = useCallback(async (file: File) => {
    if (!sessionId) {
      console.error("Session ID not found, cannot upload photo.");
      setUploadError("Session not found. Cannot upload.");
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    setPreviewUrl(null); // Clear old preview

    const fileExt = file.name.split('.').pop();
    // Use session ID and month/year for unique path
    const fileName = `custom-artwork/${sessionId}/${data.year}-${data.month}.${fileExt}`;
    const filePath = `${sessionId}/${data.year}-${data.month}.${fileExt}`; // Keep path consistent

    try {
      // Create preview URL before upload
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl); // Show preview immediately

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('user-uploads') // Make sure this bucket exists and has policies set
        .upload(filePath, file, { upsert: true }); // Use upsert to allow replacement

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);
        
      if (!urlData?.publicUrl) {
         throw new Error("Could not get public URL after upload.");
      }

      console.log("Upload successful, Public URL:", urlData.publicUrl);
      // Update session state with the public URL and set artwork option
      onUpdate({ photoUrl: urlData.publicUrl, artworkOption: 'use-photo' }); 
      setUploadError(null);

    } catch (error: any) {
      console.error("Error uploading photo:", error);
      setUploadError(error.message || "Upload failed. Please try again.");
      setPreviewUrl(null); // Clear preview on error
      onUpdate({ photoUrl: undefined, artworkOption: null }); // Clear photoUrl in session state
    } finally {
      setIsUploading(false);
    }
  }, [sessionId, data.month, data.year, onUpdate]); // Include dependencies

  // --- File Input Change Handler --- 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPhoto(file);
  };

  // --- Radio Button Change Handler --- 
  const handleRadioChange = (value: string) => {
    // Clear photoUrl if switching away from 'use-photo'?
    // Or maybe keep it in case they switch back?
    // For now, just update the artworkOption.
    onUpdate({ artworkOption: value as CustomMonthData['artworkOption'] });
    // If selecting 'use-photo' but no photo exists, don't clear option
    // Let the user upload one.
  };

  return (
    <div className={cn(
      "space-y-6 p-1",
      isLocked && "opacity-50 cursor-not-allowed pointer-events-none" // Apply disabled styles if locked
    )}>
      <RadioGroup 
        value={data.artworkOption ?? ''}
        onValueChange={handleRadioChange}
        className="space-y-3"
        disabled={isLocked} // Disable radio group if locked
      >
        {/* Option 1: Generate from Story */}
        <Label 
          htmlFor="from-story"
          className={cn(
            "flex items-start space-x-3 space-y-0 rounded-md border p-4 transition-colors cursor-pointer",
            "hover:bg-accent hover:text-accent-foreground",
            data.artworkOption === 'from-story' ? "bg-accent border-legacy-green ring-1 ring-legacy-green" : "bg-white"
          )}
        >
          <RadioGroupItem value="from-story" id="from-story" className="mt-1" />
          <div className="flex flex-col space-y-1">
            <span className="font-medium">Generate image based on my story (AI)</span>
            <span className="text-sm text-muted-foreground">
                We'll generate artwork inspired by your text.
            </span>
          </div>
        </Label>

        {/* Option 2: Upload Photo */}
        <Label 
          htmlFor="use-photo"
          className={cn(
            "flex items-start space-x-3 space-y-0 rounded-md border p-4 transition-colors cursor-pointer",
            "hover:bg-accent hover:text-accent-foreground",
            data.artworkOption === 'use-photo' ? "bg-accent border-legacy-green ring-1 ring-legacy-green" : "bg-white"
            
          )}
        >
          <RadioGroupItem value="use-photo" id="use-photo" className="mt-1" />
          <div className="flex flex-col space-y-1">
            <span className="font-medium">Upload my own photo</span>
            <span className="text-sm text-muted-foreground">
                Upload a photo to use as the card artwork.
            </span>
          </div>
        </Label>

        {/* Option 3: Turn Photo Into Art */}
        <Label 
          htmlFor="from-photo"
          className={cn(
            "flex items-start space-x-3 space-y-0 rounded-md border p-4 transition-colors cursor-pointer",
            "hover:bg-accent hover:text-accent-foreground",
            data.artworkOption === 'from-photo' ? "bg-accent border-legacy-green ring-1 ring-legacy-green" : "bg-white"
          )}
        >
          <RadioGroupItem value="from-photo" id="from-photo" className="mt-1" />
          <div className="flex flex-col space-y-1">
            <span className="font-medium">Turn my photo into art</span>
            <span className="text-sm text-muted-foreground">
                Upload a photo, and we'll create art based on it.
            </span>
          </div>
        </Label>

      </RadioGroup>

      {/* Conditionally render Upload Area OR Preview */}
      {(data.artworkOption === 'use-photo' || data.artworkOption === 'from-photo') && (
        <div className="mt-4 pl-6 space-y-4 animate-fade-in">
          
          {/* Show Preview IF previewUrl exists and not currently uploading */} 
          {previewUrl && !isUploading ? (
            <div className="space-y-2">
              <Label className="text-sm">Uploaded Photo:</Label>
              <div className="relative w-40 h-40 group border rounded-lg shadow-sm">
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* Simple Change Button - Triggers file input click */}
                <Button 
                   variant="outline"
                   size="sm" 
                   className="absolute top-1 right-1 bg-white/80 hover:bg-white text-xs h-auto px-2 py-1"
                   onClick={() => document.getElementById('photo-upload')?.click()} 
                   aria-label="Change photo"
                   disabled={isLocked} // Disable change button if locked
                 > 
                    Change
                 </Button> 
              </div>
            </div>
          ) : (
            /* Otherwise, show Upload Input Area */ 
            <Label 
              htmlFor="photo-upload"
              className={cn(
                "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100",
                uploadError ? "border-red-500" : "border-gray-200"
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <Loader2 className="w-8 h-8 mb-3 text-gray-400 animate-spin" />
                    <p className="mb-1 text-sm text-gray-500">Uploading...</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
              {/* Hidden file input remains the same */}
              <input 
                  id="photo-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/gif" 
                  onChange={handleFileChange} 
                  disabled={isLocked || isUploading} // Disable file input if locked OR uploading
              />
            </Label>
          )}

          {/* Upload Error Message (Shows below either preview or uploader) */}
          {uploadError && (
            <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} /> {uploadError}
             </p>
          )}
          
        </div> 
      )}
    </div>
  );
};

export default ArtworkTab; 