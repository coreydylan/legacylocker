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
import StorySeriesPricing from './story-selector/StorySeriesPricing';
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

      return {
        id: row.id,
        label: row.display_title,
        type: type,
        categoryDisplay: row.theme ?? 'Other',
        subcategoryDisplay: row.subject ?? undefined,
        locationDisplay: row.context ?? undefined,
        searchKeywords: [],
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
      return lowerLabel.includes(query) || 
             lowerCategory.includes(query) || 
             lowerSubcategory.includes(query) || 
             lowerLocation.includes(query);
    });
  }, [searchQuery, allStoryOptions, filterType]);

  const safeFilteredOptions = useMemo(() => {
    return Array.isArray(filteredOptions) ? filteredOptions : [];
  }, [filteredOptions]);

  const handleEditionSelection = (editionType: 'signature' | 'custom' | 'concierge') => {
    setFilterType(editionType);
    setDialogOpen(true);
  };

  const handleStorySeriesSelection = (series: SeriesType | StoryOption) => {
    if (isStartOverConfirmationRequired) {
      setSeriesToConfirm(series);
      setConfirmDialogOpen(true);
    } else {
      proceedWithSelection(series);
    }
  };

  const proceedWithSelection = (series: SeriesType | StoryOption) => {
    setSelectedSeriesForModal(series);
    setDialogOpen(false);
    setOnboardingModalOpen(true);
  };

  const handleStartFresh = () => {
    resetSessionAndState();
    if (seriesToConfirm) {
      proceedWithSelection(seriesToConfirm);
    }
    setConfirmDialogOpen(false);
  };

  const handleContinueCurrentSession = () => {
    if (seriesToConfirm) {
      proceedWithSelection(seriesToConfirm);
    }
    setConfirmDialogOpen(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedSeriesForModal(null);
    }
  };

  return (
    <section id="story-selector" className="w-full">
      <StorySeriesPricing onEditionSelect={handleEditionSelection} />
      
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Fresh?</AlertDialogTitle>
            <AlertDialogDescription>
              You already have a story series in progress. Would you like to start fresh with a new series?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleContinueCurrentSession}>
              Continue Current Series
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStartFresh}>
              Start Fresh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
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

      <OnboardingModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
        selectedSeries={selectedSeriesForModal}
      />
    </section>
  );
};

export default StorySeriesSelector;
