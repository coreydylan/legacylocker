import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSessionStore } from '@/lib/sessionStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import OnboardingModal from './OnboardingModal';
import EditionTypeCard from './story-selector/EditionTypeCard';
import SearchableCommandMenu from './story-selector/SearchableCommandMenu';
import { supabase } from '@/lib/supabaseClient';
import { StorySeriesRow, StoryOption } from '@/types/supabase';
import { SeriesType } from '@/types/onboarding';

const StorySeriesSelector = () => {
  const { 
    isStartOverConfirmationRequired, 
    resetSessionAndState, 
    initializeNewLocalSession 
  } = useSessionManager();
  const { session, sessionMetadata } = useSessionStore(state => ({
    session: state.session, 
    sessionMetadata: state.sessionMetadata 
  }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeriesForModal, setSelectedSeriesForModal] = useState<SeriesType | StoryOption | null>(null);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'signature' | 'custom' | 'concierge' | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [seriesToConfirm, setSeriesToConfirm] = useState<SeriesType | StoryOption | null>(null);
  
  const [allSeriesData, setAllSeriesData] = useState<StorySeriesRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorySeries = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('story_series')
          .select('*');

        if (fetchError) {
          throw fetchError;
        }
        
        console.log("Raw data from Supabase:", data);
        const teamsWithHiddenTeam = data?.filter(row => row.hidden_team) || [];
        console.log("Rows with hidden_team:", teamsWithHiddenTeam);
        
        setAllSeriesData(data || []);
      } catch (err: any) {
        console.error("Error fetching story series:", err);
        setError("Failed to load story series options.");
      } finally {
        setLoading(false);
      }
    };

    fetchStorySeries();
  }, []);

  const allStoryOptions = useMemo((): StoryOption[] => {
    return allSeriesData.map((row) => {
      let type: 'signature' | 'custom' | 'concierge' = 'signature';
      if (row.series_type === 'Custom Edition') type = 'custom';
      else if (row.series_type === 'Concierge Edition') type = 'concierge';

      let searchKeywords: string[] = [];
      if (row.hidden_team) {
        const rawKeywords = row.hidden_team.split(/[/,;\s\-_]+/);
        searchKeywords = rawKeywords
          .map(s => s.trim().toLowerCase())
          .filter(s => s && s.length > 1);
          
        const variations: string[] = [];
        searchKeywords.forEach(keyword => {
          variations.push(keyword);
          if (keyword.endsWith('s')) {
            variations.push(keyword.slice(0, -1));
          } else {
            variations.push(keyword + 's');
          }
          const words = keyword.split(' ');
          if (words.length > 1) {
            variations.push(words.slice(0, -1).join(' '));
            variations.push(words[words.length - 1]);
          }
          const cityMappings: { [key: string]: string[] } = {
            'new york': ['ny'],
            'san francisco': ['sf'],
            'los angeles': ['la'],
            'san diego': ['sd']
          };
          for (const city in cityMappings) {
            if (keyword.includes(city)) {
              cityMappings[city].forEach(abbr => {
                variations.push(abbr);
                variations.push(keyword.replace(city, abbr));
              });
            }
          }
        });
        searchKeywords = [...new Set([...searchKeywords, ...variations])];
      }

      return {
        id: row.id,
        label: row.display_title,
        type: type,
        categoryDisplay: row.theme ?? 'Other',
        subcategoryDisplay: row.subject ?? undefined,
        locationDisplay: row.context ?? undefined,
        searchKeywords: searchKeywords,
      };
    });
  }, [allSeriesData]);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return filterType
        ? allStoryOptions.filter(option => option.type === filterType)
        : allStoryOptions;
    }

    return allStoryOptions.filter(option => {
      if (filterType && option.type !== filterType) return false;
      const lowerLabel = option.label.toLowerCase();
      const lowerCategory = option.categoryDisplay.toLowerCase();
      const lowerSubcategory = option.subcategoryDisplay?.toLowerCase() || '';
      const lowerLocation = option.locationDisplay?.toLowerCase() || '';
      const titleMatch = lowerLabel.includes(query);
      const themeMatch = lowerCategory.includes(query);
      const subjectMatch = lowerSubcategory.includes(query);
      const contextMatch = lowerLocation.includes(query);
      const teamMatch = option.searchKeywords.some(keyword => keyword.includes(query));
      return themeMatch || subjectMatch || contextMatch || titleMatch || teamMatch;
    });
  }, [searchQuery, allStoryOptions, filterType]);

  const safeFilteredOptions = useMemo(() => {
    return Array.isArray(filteredOptions) ? filteredOptions : [];
  }, [filteredOptions]);

  const handleEditionSelection = (editionType: 'signature' | 'custom' | 'concierge', series?: SeriesType | StoryOption) => {
    if (series) {
      const seriesToSelect = {
        id: series.id,
        label: series.label,
        type: series.type,
      };
      handleStorySeriesSelection(seriesToSelect);
    } else {
      setFilterType(editionType);
      setDialogOpen(true);
    }
  };

  const handleStorySeriesSelection = (series: SeriesType | StoryOption) => {
    const requiresConfirmation = isStartOverConfirmationRequired();

    console.log(`[handleStorySeriesSelection] Selected: ${series.label}, Type: ${series.type}, Requires Confirmation: ${requiresConfirmation}`);

    if (requiresConfirmation) {
      console.log("[handleStorySeriesSelection] Active session detected, opening confirmation dialog.");
      setSeriesToConfirm(series);
      setConfirmDialogOpen(true);
      setDialogOpen(false);
    } else {
      console.log("[handleStorySeriesSelection] No active session detected or overwrite confirmed, proceeding directly.");
      proceedWithSelection(series);
    }
  };

  const proceedWithSelection = (series: SeriesType | StoryOption) => {
    console.log(`[proceedWithSelection] Proceeding with series: ${series.label}, ID: ${series.id}, Type: ${series.type}`);
    initializeNewLocalSession({
      id: series.id,
      label: series.label,
      type: series.type,
    });
    setSelectedSeriesForModal(series);
    setDialogOpen(false);
    setSearchQuery('');
    setFilterType(null);
    setOnboardingModalOpen(true);
  };

  const handleStartFresh = () => {
    console.log("[handleStartFresh] Resetting session and starting fresh.");
    resetSessionAndState();
    if (seriesToConfirm) {
      proceedWithSelection(seriesToConfirm);
    }
    setSeriesToConfirm(null);
    setConfirmDialogOpen(false);
  };

  const handleContinueCurrentSession = () => {
    console.log("[handleContinueCurrentSession] Continuing with existing session.");
    const existingEdition = session?.selectedEdition;
    if (existingEdition) {
      setSelectedSeriesForModal(existingEdition as SeriesType | StoryOption);
    } else {
      console.warn("Continuing session, but no selectedEdition found in session data.");
      setSelectedSeriesForModal(null);
    }
    setConfirmDialogOpen(false);
    setOnboardingModalOpen(true);
    setSeriesToConfirm(null);
  };

  const renderSeriesDisplay = () => {
    if (selectedSeriesForModal && onboardingModalOpen) return selectedSeriesForModal.label;
    if (sessionMetadata?.isActive && session?.selectedEdition) return session.selectedEdition.label;
    return "Select a Story Series";
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSearchQuery('');
      setFilterType(null);
    }
  };

  const renderTriggerButton = () => {
    let buttonText = renderSeriesDisplay();
    if (loading) {
      buttonText = "Loading Options...";
    } else if (error) {
      buttonText = "Error Loading Options";
    }

    return (
       <Button
         variant="outline"
         role="combobox"
         aria-expanded={dialogOpen}
         className="w-full justify-between py-6 text-lg bg-white border-legacy-green/20 hover:border-legacy-green focus:border-legacy-green focus:ring-legacy-green"
         disabled={loading || !!error}
         onClick={() => setDialogOpen(true)}
       >
         {buttonText}
         <span className={`ml-2 h-5 w-5 shrink-0 opacity-50 ${loading || error ? 'hidden' : ''}`}>▼</span>
       </Button>
    );
  }

  return (
    <>
      <section id="story-selector" className="w-full py-20 bg-legacy-cream">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-2 h-1 w-24 bg-legacy-gold mx-auto"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair text-legacy-dark">
              Choose from our growing library of stories—or create your own legacy.
            </h2>
            
            <div className="w-full max-w-md mx-auto mb-8">
              <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  {renderTriggerButton()}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white p-0">
                  <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="text-xl font-playfair text-center">Select Your Story Series</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                      Browse our curated collection or search for specific themes and locations.
                    </DialogDescription>
                  </DialogHeader>
                  {loading && <div className="p-6 text-center">Loading...</div>}
                  {error && <div className="p-6 text-center text-red-600">{error}</div>}
                  {!loading && !error && (
                    <SearchableCommandMenu
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      allOptions={allStoryOptions}
                      filteredSearchResults={safeFilteredOptions}
                      handleStorySeriesSelection={handleStorySeriesSelection}
                      filterType={filterType}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-center mb-12">
              <p className="text-legacy-dark/70 italic">
                From favorite sports teams to family legacies, we have a Story Series for everyone.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 card-container">
              <EditionTypeCard
                title="Signature Edition"
                description="Professionally written stories about history, sports, music, and cultural movements."
                onClick={() => handleEditionSelection('signature')}
              />
              
              <EditionTypeCard
                title="Custom Edition"
                description="Create your own unique story series with our easy-to-use 12-card builder."
                onClick={() => handleEditionSelection('custom')}
              />
              
              <EditionTypeCard
                title="Concierge Edition"
                description="Work with our professional writers to create a completely bespoke story series."
                isPremium={true}
                onClick={() => {
                   const conciergeOption = allStoryOptions.find(o => o.type === 'concierge');
                   if (conciergeOption) {
                      handleEditionSelection('concierge', conciergeOption);
                   } else {
                      console.warn("Concierge option not found in fetched data, handling generically.");
                      handleStorySeriesSelection({ id: 'concierge-generic', label: 'Concierge Edition', type: 'concierge' });
                   }
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      <OnboardingModal 
        isOpen={onboardingModalOpen} 
        onClose={() => {
          setOnboardingModalOpen(false);
        }} 
        selectedSeries={selectedSeriesForModal as SeriesType | null} 
      />

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Active Session Detected</AlertDialogTitle>
            <AlertDialogDescription>
              You're currently building a story edition! Would you like to continue with that or clear the existing data and start fresh with the new selection?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleContinueCurrentSession}>Continue Current</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartFresh}>Start Fresh</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StorySeriesSelector;
