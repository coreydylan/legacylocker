import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SeriesType } from '@/types/onboarding';
import { getAllStoryOptions } from "@/data/storySeriesData";
import OnboardingModal from './OnboardingModal';
import EditionTypeCard from './story-selector/EditionTypeCard';
import SearchableCommandMenu from './story-selector/SearchableCommandMenu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useSessionStore, isValidSession } from '@/lib/sessionStore';

const StorySeriesSelector = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<SeriesType | null>(null);
  
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'signature' | 'custom' | 'concierge' | null>(null);
  const [showSessionAlert, setShowSessionAlert] = useState(false);
  
  const allStoryOptions = useMemo(() => getAllStoryOptions(), []);
  
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return allStoryOptions;
    
    const query = searchQuery.toLowerCase();
    return allStoryOptions.filter(option => 
      option.categoryDisplay.toLowerCase().includes(query) || 
      option.subcategoryDisplay.toLowerCase().includes(query) || 
      option.locationDisplay.toLowerCase().includes(query) ||
      option.fullDisplay.toLowerCase().includes(query)
    );
  }, [searchQuery, allStoryOptions]);
  
  const handleStorySeriesSelection = (series: SeriesType) => {
    const { session, initialize, updateSession, resetSession } = useSessionStore.getState();
    
    if (isValidSession(session)) {
      if (!showSessionAlert) {
        setSelectedSeries(series);
        setShowSessionAlert(true);
        return;
      }
    }
    
    updateSession('selectedEdition', series);
    
    console.log('Session initialized/updated with series:', series);
    
    setSelectedSeries(series);
    setDialogOpen(false);
    setOpen(false);
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    
    setOnboardingModalOpen(true);
  };

  const openSelectorWithFilter = (type: 'signature' | 'custom' | 'concierge') => {
    const hasSession = isValidSession(useSessionStore.getState().session);
    
    if (hasSession) {
      setFilterType(type);
      setShowSessionAlert(true);
      return;
    }
    
    setFilterType(type);
    setDialogOpen(true);
  };
  
  const renderSeriesDisplay = () => {
    if (!selectedSeries) return "Select a Story Series";
    return selectedSeries.display;
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    
    if (!open) {
      setSearchQuery('');
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setFilterType(null);
    }
  };
  
  const handleResetAndSelect = () => {
    const { resetSession } = useSessionStore.getState();
    resetSession();
    setShowSessionAlert(false);
    if (selectedSeries) {
      const { initialize, updateSession } = useSessionStore.getState();
      initialize();
      updateSession('selectedEdition', selectedSeries);

      console.log('Session initialized with series after reset:', selectedSeries);

      setDialogOpen(false);
      setOpen(false);
      setSearchQuery('');
      setSelectedCategory(null);
      setSelectedSubcategory(null);

      setOnboardingModalOpen(true);
    }
  };
  
  const startNewSession = () => {
    setShowSessionAlert(false);
    if (filterType) {
      setDialogOpen(true);
    } else if (selectedSeries) {
      setOnboardingModalOpen(true);
    }
  };

  return (
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
                <Button 
                  variant="outline" 
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between py-6 text-lg bg-white border-legacy-green/20 hover:border-legacy-green focus:border-legacy-green focus:ring-legacy-green"
                  onClick={() => setDialogOpen(true)}
                >
                  {renderSeriesDisplay()}
                  <span className="ml-2 h-5 w-5 shrink-0 opacity-50">▼</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-playfair text-center">Select Your Story Series</DialogTitle>
                </DialogHeader>
                
                <SearchableCommandMenu
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  setSelectedCategory={setSelectedCategory}
                  setSelectedSubcategory={setSelectedSubcategory}
                  handleStorySeriesSelection={handleStorySeriesSelection}
                  filterType={filterType}
                  filteredOptions={filteredOptions}
                />
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
              onClick={() => openSelectorWithFilter('signature')}
            />
            
            <EditionTypeCard
              title="Custom Edition"
              description="Create your own unique story series with our easy-to-use 12-card builder."
              onClick={() => openSelectorWithFilter('custom')}
            />
            
            <EditionTypeCard
              title="Concierge Edition"
              description="Work with our professional writers to create a completely bespoke story series."
              isPremium={true}
              onClick={() => handleStorySeriesSelection({
                id: 'concierge',
                display: 'Concierge Edition',
                type: 'concierge'
              })}
            />
          </div>
        </div>
      </div>
      
      <AlertDialog open={showSessionAlert} onOpenChange={setShowSessionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Continue Your Progress?</AlertDialogTitle>
            <AlertDialogDescription>
              We noticed you have an unfinished order. Would you like to continue where you left off or start fresh?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={startNewSession}>
              Start Fresh
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-legacy-green hover:bg-legacy-green/90" 
              onClick={handleResetAndSelect}
            >
              Continue My Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <OnboardingModal 
        isOpen={onboardingModalOpen} 
        onClose={() => setOnboardingModalOpen(false)} 
        selectedSeries={selectedSeries}
      />
    </section>
  );
};

export default StorySeriesSelector;
