import React from 'react';
import { CustomMonthData } from '@/lib/sessionStore';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image } from 'lucide-react'; // Icons

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
}

const ArtworkTab: React.FC<ArtworkTabProps> = ({ data, onUpdate }) => {
  const artworkOptions: { value: CustomMonthData['artworkOption']; label: string; description: string }[] = [
    { value: 'from-story', label: "Create Art From My Story", description: "We'll generate artwork inspired by your text." },
    { value: 'use-photo', label: "Use My Photo", description: "Upload a photo to use as the card artwork." },
    { value: 'from-photo', label: "Turn My Photo Into Art", description: "Upload a photo, and we'll create art based on it." },
  ];

  const handleOptionChange = (value: string) => {
      const validOption = value as CustomMonthData['artworkOption'];
      onUpdate({ artworkOption: validOption });
       // Clear photo URL if switching away from a photo option
       if (validOption === 'from-story' && data.photoUrl) {
          onUpdate({ photoUrl: '' }); 
       }
  };
  
  const handlePhotoUpload = (url: string) => {
      onUpdate({ photoUrl: url });
  };

  const showUpload = data.artworkOption === 'use-photo' || data.artworkOption === 'from-photo';

  return (
    <div className="space-y-6 p-1">
      <Label className="text-base font-medium">Artwork Choice</Label>
      <RadioGroup
        value={data.artworkOption ?? ''} // Handle null case
        onValueChange={handleOptionChange}
      >
        {artworkOptions.map(option => (
          <div key={option.value} className="flex items-start space-x-3 space-y-0 rounded-md border p-4 transition-colors hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-accent">
            <RadioGroupItem value={option.value!} id={`art-${option.value}-${data.month}-${data.year}`} />
            <div className="flex flex-col space-y-1">
                <Label htmlFor={`art-${option.value}-${data.month}-${data.year}`} className="font-medium cursor-pointer">
                  {option.label}
                </Label>
                <span className="text-sm text-muted-foreground">
                    {option.description}
                </span>
             </div>
          </div>
        ))}
      </RadioGroup>

      {showUpload && (
        <div className="pt-4 space-y-2 animate-fade-in">
            <Label className="text-base font-medium">Upload Photo</Label>
           <FileUploadPlaceholder 
                onUploadSuccess={handlePhotoUpload} 
                currentImageUrl={data.photoUrl}
            />
        </div>
      )}
    </div>
  );
};

export default ArtworkTab; 