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
  series_id: string;
  headline: string;
  story_body: string;
  footer_note: string;
  image_url: string;
  is_default: boolean;
  frame_color: string;
  icon: string;
  badge_copy: string;
  badge_color: string;
  card_count: number;
  edition_text: string;
  badge_off_or_on: boolean;
  created_at: string;
  updated_at: string;
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
  const [editingSample, setEditingSample] = useState<StorySample | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
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
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      // Check if user is authenticated
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError || !authData.session) {
        console.error('Authentication error:', authError);
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to upload images',
          variant: 'destructive',
        });
        throw new Error('Not authenticated');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `story-samples/${fileName}`;
      
      console.log('Uploading to path:', filePath);
      
      // First try to upload to the user-uploads bucket
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        
        // If that fails, try the story_samples bucket
        const { error: secondUploadError } = await supabase.storage
          .from('story_samples')
          .upload(fileName, file);
          
        if (secondUploadError) {
          console.error('Second upload error details:', secondUploadError);
          throw secondUploadError;
        }
        
        // Get public URL from story_samples bucket
        const { data } = supabase.storage
          .from('story_samples')
          .getPublicUrl(fileName);
          
        return data.publicUrl;
      }
      
      // Get public URL from user-uploads bucket
      const { data } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setEditingSample(null);
    setIsFlipped(false);
  };
  
  const handleOpenDialog = (sample?: StorySample) => {
    if (sample) {
      setEditingSample(sample);
      setImagePreview(sample.image_url);
    } else {
      resetForm();
    }
    setIsFlipped(false);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSave = async () => {
    if (!editingSample && !imageFile) {
      toast({
        title: 'No Changes',
        description: 'Please select an image to upload.',
        variant: 'default',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Check if user is authenticated
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError || !authData.session) {
        console.error('Authentication error:', authError);
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to save samples',
          variant: 'destructive',
        });
        return;
      }

      let imageUrl = imagePreview;
      
      // Upload new image if selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          toast({
            title: 'Upload Error',
            description: 'Failed to upload image. Please try again.',
            variant: 'destructive',
          });
          setIsSaving(false);
          return;
        }
      }
      
      const sampleData: Partial<StorySample> = {};
      if (imageUrl !== imagePreview || (imageUrl && !editingSample)) {
         sampleData.image_url = imageUrl;
      } else if (!imageUrl && editingSample?.image_url) {
        sampleData.image_url = null;
      }

      if (Object.keys(sampleData).length === 0 && !imageFile) {
         toast({
          title: 'No Changes',
          description: 'No changes detected.',
          variant: 'default',
         });
         setIsSaving(false);
         return;
      }

      console.log('Saving sample data:', sampleData);
      
      if (editingSample) {
        // Update existing sample
        const { error } = await supabase
          .from('story_samples')
          .update(sampleData)
          .eq('id', editingSample.id);
          
        if (error) {
          console.error('Update error details:', error);
          throw error;
        }
        
        toast({
          title: 'Success',
          description: 'Sample updated successfully',
        });
      } else {
        // Create new sample
        if (!imageUrl) {
          toast({ title: 'Error', description: 'Cannot create sample without artwork.', variant: 'destructive' });
          setIsSaving(false);
          return;
        }
        const { error } = await supabase
          .from('story_samples')
          .insert([{
            story_series_id: id,
            id: uuidv4(),
            image_url: imageUrl,
            headline: 'Untitled',
            story_body: '',
          }]);
          
        if (error) {
          console.error('Insert error details:', error);
          throw error;
        }
        
        toast({
          title: 'Success',
          description: 'Sample created successfully',
        });
      }
      
      await fetchSamples();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving sample:', error);
      toast({
        title: 'Error',
        description: 'Failed to save sample.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
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
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingSample ? 'Edit Sample Artwork' : 'Create New Sample'}</DialogTitle>
                  <DialogDescription>
                    {isFlipped ? 'Card Back (Preview)' : 'Upload the front artwork for your sample.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 min-h-[400px]">
                  <div className="space-y-4">
                    {!isFlipped ? (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="imageUpload">Front Artwork</Label>
                          <div className="flex items-center space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('imageUpload')?.click()}
                              disabled={isUploading}
                            >
                              {isUploading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              {imagePreview ? 'Change Image' : 'Upload Image'}
                            </Button>
                            <input
                              id="imageUpload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                              disabled={isUploading}
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
                          {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        (Card Back Editor - Coming Soon)
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center items-center h-full">
                    <SamplePreview
                      imageUrl={imagePreview}
                      isFlipped={isFlipped}
                      setIsFlipped={setIsFlipped}
                      className="w-full"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  {!isFlipped && (
                     <Button onClick={handleSave} disabled={isSaving || isUploading}>
                      {isSaving ? (
                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                         <Save className="h-4 w-4 mr-2" />
                      )}
                      {editingSample ? 'Save Artwork' : 'Create Sample'}
                     </Button>
                  )}
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
                  {sample.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={sample.image_url}
                        alt={sample.headline}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
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