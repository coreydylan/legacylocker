import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { StorySeriesRow } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Plus, Save, Upload, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminSamplesPage = () => {
  const { toast } = useToast();
  const [samples, setSamples] = useState<StorySeriesRow[]>([]);
  const [selectedSample, setSelectedSample] = useState<StorySeriesRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  
  // Form state
  const [emoji, setEmoji] = useState('');
  const [naturalLanguageName, setNaturalLanguageName] = useState('');
  const [headline, setHeadline] = useState('');
  const [storyBody, setStoryBody] = useState('');
  const [defaultFooterNote, setDefaultFooterNote] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Character counters
  const headlineCharCount = headline.length;
  const storyBodyCharCount = storyBody.length;
  const defaultFooterNoteCharCount = defaultFooterNote.length;
  
  // Fetch samples on load
  useEffect(() => {
    fetchSamples();
  }, []);
  
  // Update form when selected sample changes
  useEffect(() => {
    if (selectedSample) {
      setEmoji(selectedSample.emoji || '');
      setNaturalLanguageName(selectedSample.natural_language_name || '');
      setHeadline(selectedSample.headline || '');
      setStoryBody(selectedSample.story_body || '');
      setDefaultFooterNote(selectedSample.default_footer_note || '');
      setImagePreview(selectedSample.sample_image_url || null);
    } else {
      // Reset form for new sample
      setEmoji('');
      setNaturalLanguageName('');
      setHeadline('');
      setStoryBody('');
      setDefaultFooterNote('');
      setImagePreview(null);
      setImageFile(null);
    }
  }, [selectedSample]);
  
  const fetchSamples = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching samples from Supabase...');
      
      // First try to fetch all samples
      const { data, error } = await supabase
        .from('story_series')
        .select('*');
        
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Fetched data:', data);
      
      // Filter samples in memory if needed
      const filteredSamples = data?.filter(sample => sample.is_sample === true) || [];
      
      console.log('Filtered samples:', filteredSamples);
      
      setSamples(filteredSamples);
      
      // Select the first sample if available
      if (filteredSamples.length > 0) {
        setSelectedSample(filteredSamples[0]);
      }
    } catch (error) {
      console.error('Error fetching samples:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch samples. Check console for details.',
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `story_samples/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('story_samples')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('story_samples')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      let sampleImageUrl = selectedSample?.sample_image_url || null;
      
      // Upload new image if selected
      if (imageFile) {
        sampleImageUrl = await uploadImage(imageFile);
      }
      
      const sampleData = {
        emoji,
        natural_language_name: naturalLanguageName,
        headline,
        story_body: storyBody,
        default_footer_note: defaultFooterNote,
        sample_image_url: sampleImageUrl,
        is_sample: true,
      };
      
      if (selectedSample) {
        // Update existing sample
        const { error } = await supabase
          .from('story_series')
          .update(sampleData)
          .eq('id', selectedSample.id);
          
        if (error) throw error;
      } else {
        // Create new sample
        const { error } = await supabase
          .from('story_series')
          .insert([{ ...sampleData, id: uuidv4() }]);
          
        if (error) throw error;
      }
      
      // Refresh samples
      await fetchSamples();
      
      toast({
        title: 'Success',
        description: 'Sample saved successfully',
      });
    } catch (error) {
      console.error('Error saving sample:', error);
      toast({
        title: 'Error',
        description: 'Failed to save sample',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleNewSample = () => {
    setSelectedSample(null);
  };
  
  const handleSampleSelect = (sampleId: string) => {
    const sample = samples.find(s => s.id === sampleId);
    if (sample) {
      setSelectedSample(sample);
    }
  };
  
  const createInitialSample = async () => {
    try {
      setIsSaving(true);
      
      const initialSample = {
        id: uuidv4(),
        emoji: '🎁',
        natural_language_name: 'Welcome Sample',
        headline: 'Welcome to Legacy Locker',
        story_body: 'This is a sample story. Edit this to create your own sample.',
        default_footer_note: 'Created with Legacy Locker',
        is_sample: true,
      };
      
      const { error } = await supabase
        .from('story_series')
        .insert([initialSample]);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Initial sample created successfully',
      });
      
      // Refresh samples
      await fetchSamples();
    } catch (error) {
      console.error('Error creating initial sample:', error);
      toast({
        title: 'Error',
        description: 'Failed to create initial sample',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Story Samples</h1>
        <Button onClick={createInitialSample} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Create Initial Sample
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : samples.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No samples found</h2>
          <p className="mb-6">Create your first sample to get started.</p>
          <Button onClick={createInitialSample} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create Initial Sample
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Sample Details</h2>
              <Button onClick={handleNewSample} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Sample
              </Button>
            </div>
            
            {/* Sample Selector */}
            <div className="mb-6">
              <Label htmlFor="sample-selector">Select Sample</Label>
              <Select
                value={selectedSample?.id || ''}
                onValueChange={handleSampleSelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sample to edit" />
                </SelectTrigger>
                <SelectContent>
                  {samples.map((sample) => (
                    <SelectItem key={sample.id} value={sample.id}>
                      {sample.natural_language_name || sample.display_title || 'Unnamed Sample'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="emoji">Emoji</Label>
                <Input
                  id="emoji"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="e.g. 🏀"
                />
              </div>
              
              <div>
                <Label htmlFor="naturalLanguageName">Natural Language Name</Label>
                <Input
                  id="naturalLanguageName"
                  value={naturalLanguageName}
                  onChange={(e) => setNaturalLanguageName(e.target.value)}
                  placeholder="e.g. Basketball Fan's Journey"
                />
              </div>
              
              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. The First Game"
                  maxLength={25}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {headlineCharCount}/25 characters
                </div>
              </div>
              
              <div>
                <Label htmlFor="storyBody">Story Body</Label>
                <Textarea
                  id="storyBody"
                  value={storyBody}
                  onChange={(e) => setStoryBody(e.target.value)}
                  placeholder="Enter the story text..."
                  className="min-h-[200px]"
                  maxLength={1700}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {storyBodyCharCount}/1700 characters
                </div>
              </div>
              
              <div>
                <Label htmlFor="defaultFooterNote">Default Footer Note (Optional)</Label>
                <Textarea
                  id="defaultFooterNote"
                  value={defaultFooterNote}
                  onChange={(e) => setDefaultFooterNote(e.target.value)}
                  placeholder="Enter a default footer note..."
                  className="min-h-[80px]"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {defaultFooterNoteCharCount}/100 characters
                </div>
              </div>
              
              <div>
                <Label htmlFor="imageUpload">Sample Image</Label>
                <div className="mt-2 flex items-center space-x-4">
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
                    <div className="text-sm text-gray-500">
                      Image selected
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleSave} 
                className="w-full"
                disabled={isSaving || isUploading}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Sample
              </Button>
            </div>
          </div>
          
          {/* Right Column - Preview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'front' | 'back')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="front">Front</TabsTrigger>
                <TabsTrigger value="back">Back</TabsTrigger>
              </TabsList>
              
              <TabsContent value="front" className="mt-4">
                <Card className="w-full aspect-[3/4] overflow-hidden">
                  <CardContent className="p-0 h-full">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Sample card front" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-400">No image uploaded</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="back" className="mt-4">
                <Card className="w-full aspect-[3/4] overflow-hidden">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="text-4xl mb-2">{emoji}</div>
                    <h3 className="text-xl font-bold mb-4">{headline || 'Headline'}</h3>
                    <div className="flex-grow overflow-y-auto">
                      <p className="text-gray-700 whitespace-pre-line">
                        {storyBody || 'Story body will appear here...'}
                      </p>
                    </div>
                    {defaultFooterNote && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500 italic">
                          {defaultFooterNote}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSamplesPage; 