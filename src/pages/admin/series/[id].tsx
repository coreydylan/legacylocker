import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Upload, 
  X 
} from 'lucide-react';
import { SamplePreview } from '@/components/admin/SamplePreview';

interface StorySeriesRow {
  id: string;
  title: string;
  description: string;
  theme: string;
  region_key: string;
  created_at: string;
  updated_at: string;
  emoji: string;
  natural_language_name: string;
  story_body: string;
}

interface StorySample {
  id: string;
  story_series_id: string;
  headline: string;
  subtitle: string | null;
  story_body: string;
  badge_text: string | null;
  badge_copy: string | null;
  badge_color: string | null;
  frame_color: string | null;
  icon: string | null;
  card_count: number | null;
  edition_text: string | null;
  image_url: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  custom_note?: string;
}

interface SamplePreviewProps {
  imageUrl: string;
  headline: string;
  subtitle: string;
  storyBody: string;
  badgeText: string;
  badgeCopy: string;
  badgeColor: string;
  frameColor: string;
  icon: string;
  cardCount: number;
  editionText: string;
  showFlipButton?: boolean;
  isFlipped?: boolean;
  displayMode?: 'dialog' | 'thumbnail';
  className?: string;
  badgeOn: boolean;
}

const SeriesDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [series, setSeries] = useState<StorySeriesRow | null>(null);
  const [samples, setSamples] = useState<StorySample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'samples' | 'edit'>('samples');
  
  // Simplified Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<StorySample | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<'front' | 'back'>('front');
  const [cardBackData, setCardBackData] = useState<{
    headline: string;
    subtitle: string;
    storyBody: string;
    badgeText: string;
    customNote: string;
    cardNumber: number;
    totalCards: number;
    editionTitle: string;
    giftFromCopy: string;
    footerOn: boolean;
    frameColor: string;
    cardDetailsBgColor: string;
    badgeColor: string;
    icons: string[];
    badgeOn: boolean;
  }>({
    headline: '',
    subtitle: '',
    storyBody: '',
    badgeText: '',
    customNote: '',
    cardNumber: 1,
    totalCards: 12,
    editionTitle: 'Legacy Locker',
    giftFromCopy: 'A Gift From',
    footerOn: true,
    frameColor: '#2C5530',
    cardDetailsBgColor: '#F9F5EC',
    badgeColor: '#ED9831',
    icons: [],
    badgeOn: true
  });
  
  useEffect(() => {
    if (id) {
      fetchSeries();
      fetchSamples();
    }
  }, [id]);
  
  const fetchSeries = async () => {
    try {
      const { data, error } = await supabase
        .from('story_series')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setSeries(data);
    } catch (error) {
      console.error('Error fetching series:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch series details',
        variant: 'destructive',
      });
    }
  };
  
  const fetchSamples = async () => {
    try {
      const { data, error } = await supabase
        .from('story_samples')
        .select('*')
        .eq('story_series_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSamples(data || []);
    } catch (error) {
      console.error('Error fetching samples:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch samples',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        console.log('Setting imagePreview in handleImageChange:', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `sample-images/${timestamp}.${fileExt}`;
      
      console.log('Attempting to upload image to user-uploads bucket:', fileName);
      
      // Try uploading to user-uploads bucket (which we know works from ArtworkTab component)
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(fileName, file, { 
          cacheControl: '3600',
          upsert: true 
        });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: 'Upload Failed',
          description: `Error: ${uploadError.message}`,
          variant: 'destructive',
        });
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(fileName);
      
      console.log('Upload successful, URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setSelectedSample(null);
    setCardBackData({
      headline: '',
      subtitle: '',
      storyBody: '',
      badgeText: '',
      customNote: '',
      cardNumber: 1,
      totalCards: 12,
      editionTitle: 'Legacy Locker',
      giftFromCopy: 'A Gift From',
      footerOn: true,
      frameColor: '#2C5530',
      cardDetailsBgColor: '#F9F5EC',
      badgeColor: '#ED9831',
      icons: [],
      badgeOn: true
    });
  };
  
  const handleOpenDialog = (sample?: StorySample) => {
    if (sample) {
      setSelectedSample(sample);
      setCardBackData({
        headline: sample.headline || '',
        subtitle: sample.subtitle || '',
        storyBody: sample.story_body || '',
        badgeText: sample.badge_text || '',
        customNote: '',
        cardNumber: sample.card_count || 1,
        totalCards: 12,
        editionTitle: sample.edition_text || 'Legacy Locker',
        giftFromCopy: 'A Gift From',
        footerOn: true,
        frameColor: sample.frame_color || '#2C5530',
        cardDetailsBgColor: '#F9F5EC',
        badgeColor: '#ED9831',
        icons: sample.icon ? [sample.icon] : [],
        badgeOn: true
      });
    } else {
      setSelectedSample(null);
      setCardBackData({
        headline: '',
        subtitle: '',
        storyBody: '',
        badgeText: '',
        customNote: '',
        cardNumber: 1,
        totalCards: 12,
        editionTitle: 'Legacy Locker',
        giftFromCopy: 'A Gift From',
        footerOn: true,
        frameColor: '#2C5530',
        cardDetailsBgColor: '#F9F5EC',
        badgeColor: '#ED9831',
        icons: [],
        badgeOn: true
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSave = async () => {
    if (!selectedSample && !imageFile) return;

    try {
      const sampleData: Partial<StorySample> = {
        headline: cardBackData.headline || '',
        story_body: cardBackData.storyBody || '',
        subtitle: cardBackData.subtitle,
        badge_text: cardBackData.badgeText,
        badge_copy: null,
        frame_color: cardBackData.frameColor,
        icon: cardBackData.icons[0] || null,
        card_count: cardBackData.cardNumber,
        edition_text: cardBackData.editionTitle
      };

      // Upload image if provided
      if (imageFile) {
        try {
          const imageUrl = await uploadImage(imageFile);
          sampleData.image_url = imageUrl;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast({
            title: 'Upload Error',
            description: 'Failed to upload image. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      }

      if (selectedSample) {
        // Update existing sample
        const { error } = await supabase
          .from('story_samples')
          .update(sampleData)
          .eq('id', selectedSample.id);

        if (error) {
          console.error('Error updating sample:', error);
          toast({
            title: 'Update Error',
            description: 'Failed to update sample. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      } else {
        // Create new sample
        const { error } = await supabase.from('story_samples').insert([
          {
            ...sampleData,
            story_series_id: id,
            is_default: false
          }
        ]);

        if (error) {
          console.error('Error creating sample:', error);
          toast({
            title: 'Creation Error',
            description: 'Failed to create sample. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      }

      toast({
        title: 'Success',
        description: selectedSample ? 'Sample updated successfully' : 'Sample created successfully',
      });

      setIsDialogOpen(false);
      await fetchSamples();
    } catch (error) {
      console.error('Unexpected error saving sample:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async (sampleId: string) => {
    if (!confirm('Are you sure you want to delete this sample?')) return;
    
    try {
      const { error } = await supabase
        .from('story_samples')
        .delete()
        .eq('id', sampleId);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Sample deleted successfully',
      });
      
      // Refresh samples
      await fetchSamples();
    } catch (error) {
      console.error('Error deleting sample:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete sample',
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateSeries = async () => {
    if (!series) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('story_series')
        .update({
          emoji: series.emoji,
          natural_language_name: series.natural_language_name,
          region_key: series.region_key,
        })
        .eq('id', series.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Series updated successfully',
      });
    } catch (error) {
      console.error('Error updating series:', error);
      toast({
        title: 'Error',
        description: 'Failed to update series',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }
  
  if (!series) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Series not found</h2>
          <p className="text-gray-500 mb-4">The requested series could not be found.</p>
          <Button asChild>
            <Link to="/admin/series">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Series
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link to="/admin/series">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Series
          </Link>
        </Button>
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {series.natural_language_name || series.title}
          </h1>
          <Button onClick={() => setActiveTab('edit')} variant="outline">
            Edit Series
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'samples' | 'edit')}>
        <TabsList className="mb-6">
          <TabsTrigger value="samples">Samples</TabsTrigger>
          <TabsTrigger value="edit">Edit Series</TabsTrigger>
        </TabsList>
        
        <TabsContent value="samples">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Story Samples</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Sample
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                  <DialogTitle>{selectedSample ? 'Edit Sample' : 'Create New Sample'}</DialogTitle>
                  <DialogDescription>
                    Customize your sample card details and upload artwork.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div>
                      <Label htmlFor="imageUpload">Sample Image</Label>
                      <div className="mt-2 flex flex-col space-y-2">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('imageUpload')?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            {imagePreview ? 'Replace Image' : 'Upload Image'}
                          </Button>
                          <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          {imagePreview && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                                const input = document.getElementById('imageUpload') as HTMLInputElement;
                                if (input) input.value = '';
                              }}
                              disabled={isUploading}
                            >
                              <X className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          )}
                        </div>
                        {isUploading && (
                          <div className="text-sm text-amber-600">
                            <Loader2 className="h-3 w-3 inline-block mr-1 animate-spin" />
                            Uploading image... Please wait.
                          </div>
                        )}
                        {!imagePreview && !isUploading && (
                          <p className="text-xs text-muted-foreground">
                            Upload a high-quality image for the front of the card.
                            <br />
                            Recommended dimensions: 1200x1800px (4x6 inches at 300dpi).
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="headline">Headline</Label>
                      <Input
                        id="headline"
                        value={cardBackData.headline}
                        onChange={(e) => setCardBackData({ ...cardBackData, headline: e.target.value })}
                        placeholder="Enter headline..."
                        maxLength={25}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {cardBackData.headline.length}/25 characters
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={cardBackData.subtitle}
                        onChange={(e) => setCardBackData({ ...cardBackData, subtitle: e.target.value })}
                        placeholder="Enter subtitle..."
                        maxLength={50}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {cardBackData.subtitle.length}/50 characters
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="badgeText">Badge Text (Max 2 lines, 10 chars/line)</Label>
                      <Textarea
                        id="badgeText"
                        value={cardBackData.badgeText}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const lines = newValue.split('\n');
                          
                          // Validate: Max 2 lines AND max 10 chars per line
                          const isValid = 
                            lines.length <= 2 && 
                            lines.every(line => line.length <= 10);
                            
                          if (isValid) {
                            setCardBackData({ ...cardBackData, badgeText: newValue });
                          }
                          // If invalid, do nothing, effectively preventing the update
                        }}
                        placeholder="Enter badge text... (Max 2 lines, 10 chars/line)"
                        rows={2}
                        maxLength={21} // Max chars (10 + newline + 10)
                        className="h-auto"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {/* Display character count, maybe add line check warning if complex */} 
                        {cardBackData.badgeText.length}/21 characters total
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="storyBody">Story Body</Label>
                      <Textarea
                        id="storyBody"
                        value={cardBackData.storyBody}
                        onChange={(e) => setCardBackData({ ...cardBackData, storyBody: e.target.value })}
                        placeholder="Enter story text..."
                        className="min-h-[200px]"
                        maxLength={1700}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {cardBackData.storyBody.length}/1700 characters
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="customNote">Custom Note</Label>
                      <Input
                        id="customNote"
                        value={cardBackData.customNote}
                        onChange={(e) => setCardBackData({ ...cardBackData, customNote: e.target.value })}
                        placeholder="Enter custom note..."
                        maxLength={200}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {cardBackData.customNote.length}/200 characters
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        type="number"
                        value={cardBackData.cardNumber}
                        onChange={(e) => setCardBackData({ ...cardBackData, cardNumber: Number(e.target.value) })}
                        placeholder="Enter card number..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="totalCards">Total Cards</Label>
                      <Input
                        id="totalCards"
                        type="number"
                        value={cardBackData.totalCards}
                        onChange={(e) => setCardBackData({ ...cardBackData, totalCards: Number(e.target.value) })}
                        placeholder="Enter total cards..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="editionTitle">Edition Title</Label>
                      <Input
                        id="editionTitle"
                        value={cardBackData.editionTitle}
                        onChange={(e) => setCardBackData({ ...cardBackData, editionTitle: e.target.value })}
                        placeholder="Enter edition title..."
                        maxLength={50}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {cardBackData.editionTitle.length}/50 characters
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="giftFromCopy">Gift From Copy</Label>
                      <Input
                        id="giftFromCopy"
                        value={cardBackData.giftFromCopy}
                        onChange={(e) => setCardBackData({ ...cardBackData, giftFromCopy: e.target.value })}
                        placeholder="Enter gift from copy..."
                        maxLength={50}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {cardBackData.giftFromCopy.length}/50 characters
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="footerOn">Footer On</Label>
                      <Checkbox
                        id="footerOn"
                        checked={cardBackData.footerOn}
                        onCheckedChange={(value) => setCardBackData({ ...cardBackData, footerOn: !!value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="frameColor">Frame Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="frameColor"
                          type="color"
                          value={cardBackData.frameColor}
                          onChange={(e) => setCardBackData({ ...cardBackData, frameColor: e.target.value })}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={cardBackData.frameColor}
                          onChange={(e) => setCardBackData({ ...cardBackData, frameColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardDetailsBgColor">Card Details Background Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="cardDetailsBgColor"
                          type="color"
                          value={cardBackData.cardDetailsBgColor}
                          onChange={(e) => setCardBackData({ ...cardBackData, cardDetailsBgColor: e.target.value })}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={cardBackData.cardDetailsBgColor}
                          onChange={(e) => setCardBackData({ ...cardBackData, cardDetailsBgColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="badgeColor">Badge Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="badgeColor"
                          type="color"
                          value={cardBackData.badgeColor}
                          onChange={(e) => setCardBackData({ ...cardBackData, badgeColor: e.target.value })}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={cardBackData.badgeColor}
                          onChange={(e) => setCardBackData({ ...cardBackData, badgeColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="badgeOn"
                        checked={cardBackData.badgeOn}
                        onCheckedChange={(checked) => setCardBackData({ ...cardBackData, badgeOn: !!checked })}
                      />
                      <Label htmlFor="badgeOn">Show Badge</Label>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center h-full">
                    <SamplePreview
                      imageUrl={imagePreview}
                      headline={cardBackData.headline}
                      subtitle={cardBackData.subtitle}
                      storyBody={cardBackData.storyBody}
                      badgeText={cardBackData.badgeText}
                      customNote={cardBackData.customNote}
                      cardNumber={cardBackData.cardNumber}
                      totalCards={cardBackData.totalCards}
                      editionTitle={cardBackData.editionTitle}
                      giftFromCopy={cardBackData.giftFromCopy}
                      footerOn={cardBackData.footerOn}
                      frameColor={cardBackData.frameColor}
                      cardDetailsBgColor={cardBackData.cardDetailsBgColor}
                      badgeColor={cardBackData.badgeColor}
                      icons={cardBackData.icons}
                      badgeOn={cardBackData.badgeOn}
                      displayMode="dialog"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving || isUploading}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {selectedSample ? 'Save Changes' : 'Create Sample'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {samples.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No samples found</h2>
              <p className="text-gray-500 mb-4">Create your first sample to get started.</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Sample
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {samples.map((sample) => (
                <Card key={sample.id} className="overflow-hidden">
                  <div className="aspect-[2/3] w-full">
                    <SamplePreview
                      imageUrl={sample.image_url}
                      headline={sample.headline}
                      subtitle={sample.subtitle}
                      storyBody={sample.story_body}
                      badgeText={sample.badge_text}
                      customNote={sample.custom_note || ''}
                      cardNumber={sample.card_count || 1}
                      totalCards={12}
                      editionTitle={sample.edition_text || 'Legacy Locker'}
                      giftFromCopy="A Gift From"
                      footerOn={true}
                      frameColor={sample.frame_color || '#2C5530'}
                      cardDetailsBgColor="#F9F5EC"
                      badgeColor="#ED9831"
                      icons={sample.icon ? [sample.icon] : []}
                      showFlipButton={true}
                      displayMode="thumbnail"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{sample.headline}</CardTitle>
                      {sample.is_default && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {(sample.story_body ?? '').substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(sample)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(sample.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Series Details</CardTitle>
              <CardDescription>
                Update the basic information for this series.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="emoji">Emoji</Label>
                <Input
                  id="emoji"
                  value={series.emoji || ''}
                  onChange={(e) => setSeries({ ...series, emoji: e.target.value })}
                  placeholder="e.g. 🏀"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="naturalLanguageName">Natural Language Name</Label>
                <Input
                  id="naturalLanguageName"
                  value={series.natural_language_name || ''}
                  onChange={(e) => setSeries({ ...series, natural_language_name: e.target.value })}
                  placeholder="e.g. Basketball Fan's Journey"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="regionKey">Region Key</Label>
                <Input
                  id="regionKey"
                  value={series.region_key || ''}
                  onChange={(e) => setSeries({ ...series, region_key: e.target.value })}
                  placeholder="e.g. ca"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateSeries} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeriesDetailPage; 