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
  
  // Form state
  const [headline, setHeadline] = useState('');
  const [storyBody, setStoryBody] = useState('');
  const [footerNote, setFooterNote] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [frameColor, setFrameColor] = useState('');
  const [icon, setIcon] = useState('');
  const [badgeCopy, setBadgeCopy] = useState('');
  const [badgeColor, setBadgeColor] = useState('');
  const [cardCount, setCardCount] = useState(0);
  const [editionText, setEditionText] = useState('');
  const [badgeOffOrOn, setBadgeOffOrOn] = useState(false);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<StorySample | null>(null);
  
  const [sample, setSample] = useState<StorySeriesRow>({
    id: '',
    title: '',
    description: '',
    theme: '',
    region_key: '',
    created_at: '',
    updated_at: '',
    emoji: '',
    natural_language_name: '',
    story_body: '',
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
    setHeadline('');
    setStoryBody('');
    setFooterNote('');
    setIsDefault(false);
    setImageFile(null);
    setImagePreview(null);
    setEditingSample(null);
    setFrameColor('');
    setIcon('');
    setBadgeCopy('');
    setBadgeColor('');
    setCardCount(0);
    setEditionText('');
    setBadgeOffOrOn(false);
  };
  
  const handleOpenDialog = (sample?: StorySample) => {
    if (sample) {
      setEditingSample(sample);
      setHeadline(sample.headline ?? '');
      setStoryBody(sample.story_body ?? '');
      setFooterNote(sample.footer_note || '');
      setIsDefault(sample.is_default);
      setImagePreview(sample.image_url);
      setFrameColor(sample.frame_color);
      setIcon(sample.icon);
      setBadgeCopy(sample.badge_copy);
      setBadgeColor(sample.badge_color);
      setCardCount(sample.card_count);
      setEditionText(sample.edition_text);
      setBadgeOffOrOn(sample.badge_off_or_on);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSave = async () => {
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
        imageUrl = await uploadImage(imageFile);
      }
      
      const sampleData = {
        story_series_id: id,
        headline,
        story_body: storyBody,
        footer_note: footerNote || null,
        image_url: imageUrl,
        is_default: isDefault,
        frame_color: frameColor,
        icon,
        badge_copy: badgeCopy,
        badge_color: badgeColor,
        card_count: cardCount,
        edition_text: editionText,
        badge_off_or_on: badgeOffOrOn,
      };
      
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
        const { error } = await supabase
          .from('story_samples')
          .insert([{ ...sampleData, id: uuidv4() }]);
          
        if (error) {
          console.error('Insert error details:', error);
          throw error;
        }
        
        toast({
          title: 'Success',
          description: 'Sample created successfully',
        });
      }
      
      // If this is set as default, update other samples
      if (isDefault) {
        const otherSamples = samples.filter(s => s.id !== editingSample?.id);
        for (const sample of otherSamples) {
          await supabase
            .from('story_samples')
            .update({ is_default: false })
            .eq('id', sample.id);
        }
      }
      
      // Refresh samples
      await fetchSamples();
      
      // Close dialog
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving sample:', error);
      toast({
        title: 'Error',
        description: 'Failed to save sample. Please check your authentication and try again.',
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
  
  const editSample = (sample: StorySample) => {
    setEditingSample(sample);
    setHeadline(sample.headline);
    setStoryBody(sample.story_body);
    setFooterNote(sample.footer_note);
    setFrameColor(sample.frame_color);
    setIcon(sample.icon);
    setBadgeCopy(sample.badge_copy);
    setBadgeColor(sample.badge_color);
    setCardCount(sample.card_count);
    setEditionText(sample.edition_text);
    setIsDefault(sample.is_default);
    setImagePreview(sample.image_url);
    setBadgeOffOrOn(sample.badge_off_or_on);
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
              <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>Edit Sample</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your story sample.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="headline">Headline</Label>
                      <Input
                        id="headline"
                        placeholder="e.g. The First Game"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="storyBody">Story Body</Label>
                      <Textarea
                        id="storyBody"
                        placeholder="Enter the story text..."
                        className="min-h-[200px]"
                        value={storyBody}
                        onChange={(e) => setStoryBody(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="footerNote">Footer Note (Optional)</Label>
                      <Textarea
                        id="footerNote"
                        placeholder="Enter a footer note..."
                        className="min-h-[80px]"
                        value={footerNote}
                        onChange={(e) => setFooterNote(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="imageUpload">Front Artwork</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('imageUpload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isDefault"
                        checked={isDefault}
                        onCheckedChange={(checked) =>
                          setIsDefault(checked as boolean)
                        }
                      />
                      <Label htmlFor="isDefault">Set as default sample</Label>
                    </div>
                  </div>

                  <div className="hidden md:block self-start">
                    <SamplePreview
                      headline={headline}
                      storyBody={storyBody}
                      footerNote={footerNote}
                      imageUrl={imagePreview}
                      emoji={series.emoji}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frame_color">Frame Color</Label>
                      <Input
                        id="frame_color"
                        value={frameColor}
                        onChange={(e) => setFrameColor(e.target.value)}
                        placeholder="e.g. #FF0000 or red"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <Input
                        id="icon"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        placeholder="Icon identifier"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="badge_copy">Badge Copy</Label>
                      <Input
                        id="badge_copy"
                        value={badgeCopy}
                        onChange={(e) => setBadgeCopy(e.target.value)}
                        placeholder="Text to display in badge"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="badge_color">Badge Color</Label>
                      <Input
                        id="badge_color"
                        value={badgeColor}
                        onChange={(e) => setBadgeColor(e.target.value)}
                        placeholder="e.g. #FF0000 or red"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card_count">Card Count</Label>
                      <Input
                        id="card_count"
                        type="number"
                        value={cardCount}
                        onChange={(e) => setCardCount(parseInt(e.target.value) || 0)}
                        placeholder="Number of cards in series"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edition_text">Edition Text</Label>
                      <Input
                        id="edition_text"
                        value={editionText}
                        onChange={(e) => setEditionText(e.target.value)}
                        placeholder="Text describing the edition type"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge_off_or_on">Badge Display</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="badge_off_or_on"
                        checked={badgeOffOrOn}
                        onCheckedChange={(checked) => setBadgeOffOrOn(checked as boolean)}
                      />
                      <Label htmlFor="badge_off_or_on">Show Badge</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Update
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