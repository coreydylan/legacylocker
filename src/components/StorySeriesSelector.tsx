import React, { useState, useMemo } from 'react';
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
import { SeriesType } from '@/types/onboarding';
import { getAllStoryOptions } from "@/data/storySeriesData";
import { useSessionStore } from '@/lib/sessionStore';
import OnboardingModal from './OnboardingModal';
import EditionTypeCard from './story-selector/EditionTypeCard';
import SearchableCommandMenu from './story-selector/SearchableCommandMenu';

const StorySeriesSelector = () => {
  const { session, resetSession } = useSessionStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSeriesForModal, setSelectedSeriesForModal] = useState<SeriesType | null>(null);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'signature' | 'custom' | 'concierge' | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [seriesToConfirm, setSeriesToConfirm] = useState<SeriesType | null>(null);
  
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
  
  const handleEditionSelection = (editionType: 'signature' | 'custom' | 'concierge', series?: SeriesType) => {
    if (series) {
      handleStorySeriesSelection(series);
    } else {
      setFilterType(editionType);
      setDialogOpen(true);
    }
  };
  
  const handleStorySeriesSelection = (series: SeriesType) => {
    const isActiveSession = !!(session && (session.selectedEdition || session.customData?.length > 0 || session.signatureData?.some(d => d.enabled)));

    console.log(`[handleStorySeriesSelection] Selected: ${series.label}, Is Active Session: ${isActiveSession}`);

    if (isActiveSession) {
      console.log("[handleStorySeriesSelection] Active session detected, opening confirmation dialog.");
      setSeriesToConfirm(series);
      setConfirmDialogOpen(true);
      setDialogOpen(false);
    } else {
      console.log("[handleStorySeriesSelection] No active session detected, proceeding directly.");
      proceedWithSelection(series);
    }
  };

  const proceedWithSelection = (series: SeriesType) => {
    console.log(`[proceedWithSelection] Proceeding with series: ${series.label}`);
    setSelectedSeriesForModal(series);
    setDialogOpen(false);
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setOnboardingModalOpen(true);
  };

  const handleStartFresh = () => {
    console.log("[handleStartFresh] Resetting session and starting fresh.");
    resetSession();
    if (seriesToConfirm) {
      proceedWithSelection(seriesToConfirm);
    }
    setSeriesToConfirm(null);
    setConfirmDialogOpen(false);
  };

  const handleContinueCurrentSession = () => {
    console.log("[handleContinueCurrentSession] Continuing with existing session.");
    if (session?.selectedEdition) {
      setSelectedSeriesForModal(session.selectedEdition);
    } else {
      console.warn("Continuing session, but no selectedEdition found in session data.");
      setSelectedSeriesForModal(null);
    }
    setOnboardingModalOpen(true);
    setSeriesToConfirm(null);
    setConfirmDialogOpen(false);
  };

  const renderSeriesDisplay = () => {
    if (selectedSeriesForModal) return selectedSeriesForModal.label;
    return "Select a Story Series";
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
                  <Button 
                    variant="outline" 
                    role="combobox"
                    aria-expanded={dialogOpen}
                    className="w-full justify-between py-6 text-lg bg-white border-legacy-green/20 hover:border-legacy-green focus:border-legacy-green focus:ring-legacy-green"
                  >
                    {renderSeriesDisplay()}
                    <span className="ml-2 h-5 w-5 shrink-0 opacity-50">▼</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-playfair text-center">Select Your Story Series</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                      Browse our curated collection of story series or search for specific themes and locations.
                    </DialogDescription>
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
                onClick={() => handleEditionSelection('concierge', { 
                  id: 'concierge',
                  label: 'Concierge Edition', 
                  type: 'concierge',
                  description: 'Work with our professional writers...'
                })}
              />
            </div>
          </div>
        </div>
      </section>
      
      <OnboardingModal 
        isOpen={onboardingModalOpen} 
        onClose={() => {
          setOnboardingModalOpen(false);
          setSelectedSeriesForModal(null);
        }} 
        selectedSeries={selectedSeriesForModal}
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
