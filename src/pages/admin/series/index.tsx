import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Search, Plus, ExternalLink } from 'lucide-react';

interface StorySeries {
  id: string;
  theme: string | null;
  subject: string | null;
  context: string | null;
  series_type: string | null;
  edition: string | null;
  display_title: string;
  custom_edition_prompt: string | null;
  hidden_team: string | null;
  natural_language_name: string | null;
  region_key: string | null;
  emoji: string | null;
}

const AdminSeriesPage = () => {
  const { toast } = useToast();
  const [series, setSeries] = useState<StorySeries[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<StorySeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [themes, setThemes] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    if (!series) return;
    
    let filtered = [...series];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.theme.toLowerCase().includes(term) || 
        s.subject.toLowerCase().includes(term) ||
        s.context.toLowerCase().includes(term)
      );
    }
    
    // Apply theme filter
    if (selectedTheme && selectedTheme !== 'all') {
      filtered = filtered.filter(s => s.theme === selectedTheme);
    }
    
    // Apply region filter
    if (selectedRegion && selectedRegion !== 'all') {
      filtered = filtered.filter(s => s.context === selectedRegion);
    }
    
    setFilteredSeries(filtered);
  }, [series, searchTerm, selectedTheme, selectedRegion]);

  const fetchSeries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('story_series')
        .select('*')
        .order('natural_language_name', { ascending: true });
      
      if (error) throw error;
      
      setSeries(data || []);
      
      // Extract unique themes and regions for filters
      const uniqueThemes = [...new Set(data?.map(item => item.theme).filter(Boolean) as string[])];
      const uniqueRegions = [...new Set(data?.map(item => item.region_key).filter(Boolean) as string[])];
      
      setThemes(uniqueThemes);
      setRegions(uniqueRegions);
    } catch (error) {
      console.error('Error fetching series:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch story series',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Story Series</h1>
        <Button asChild>
          <Link to="/admin/series/new">
            <Plus className="h-4 w-4 mr-2" />
            New Series
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search series..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedTheme} onValueChange={handleThemeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All themes</SelectItem>
            {themes.map(theme => (
              <SelectItem key={theme} value={theme}>{theme}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {regions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : filteredSeries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No series found</h2>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <Button asChild>
            <Link to="/admin/series/new">
              <Plus className="h-4 w-4 mr-2" />
              Create New Series
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Context</TableHead>
                <TableHead>Emoji</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSeries.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.natural_language_name || item.display_title}
                  </TableCell>
                  <TableCell>{item.theme || '-'}</TableCell>
                  <TableCell>{item.subject || '-'}</TableCell>
                  <TableCell>{item.context || '-'}</TableCell>
                  <TableCell>{item.emoji || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/series/${item.id}`}>
                        Manage Samples
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminSeriesPage; 