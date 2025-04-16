import React, { useMemo, useState } from 'react';
import { Search, ChevronRight } from "lucide-react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { StoryOption } from '@/types/supabase';
import { Button } from "@/components/ui/button";

interface SearchableCommandMenuProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleStorySeriesSelection: (series: StoryOption) => void;
  filterType: 'signature' | 'custom' | 'concierge' | null;
  allOptions: StoryOption[];
  filteredSearchResults: StoryOption[];
}

const getUniqueValues = (options: StoryOption[], key: keyof Pick<StoryOption, 'categoryDisplay' | 'subcategoryDisplay'>): string[] => {
  return Array.from(new Set(options.map(option => option[key]).filter(Boolean))) as string[];
};

const SearchableCommandMenu: React.FC<SearchableCommandMenuProps> = ({
  searchQuery,
  setSearchQuery,
  handleStorySeriesSelection,
  filterType,
  allOptions,
  filteredSearchResults,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Debug: Log the props received by SearchableCommandMenu
  React.useEffect(() => {
    console.log("SearchableCommandMenu props:", {
      searchQuery,
      filterType,
      allOptionsCount: allOptions.length,
      filteredSearchResultsCount: filteredSearchResults.length,
    });
  }, [searchQuery, filterType, allOptions, filteredSearchResults]);

  React.useEffect(() => {
      setSelectedTheme(null);
      setSelectedSubject(null);
  }, [searchQuery, filterType]);

  // Options specifically for hierarchical browsing (Signature & Custom)
  const optionsForHierarchicalBrowsing = useMemo(() => {
    const baseOptions = filterType ? allOptions.filter(option => option.type === filterType) : allOptions;
    // Exclude Concierge from this list
    return baseOptions.filter(o => o.type === 'signature' || o.type === 'custom');
  }, [allOptions, filterType]);

  // --- Derived lists for hierarchical browsing ---
  const signatureOptions = useMemo(() => optionsForHierarchicalBrowsing.filter(o => o.type === 'signature'), [optionsForHierarchicalBrowsing]);
  const customOptions = useMemo(() => optionsForHierarchicalBrowsing.filter(o => o.type === 'custom'), [optionsForHierarchicalBrowsing]);

  const signatureThemes = useMemo(() => getUniqueValues(signatureOptions, 'categoryDisplay'), [signatureOptions]);
  const customThemes = useMemo(() => getUniqueValues(customOptions, 'categoryDisplay'), [customOptions]);

  const availableSubjects = useMemo(() => {
    if (!selectedTheme) return [];
    // Look in the combined hierarchical options
    const themeOptions = optionsForHierarchicalBrowsing.filter(o => o.categoryDisplay === selectedTheme);
    return getUniqueValues(themeOptions, 'subcategoryDisplay');
  }, [optionsForHierarchicalBrowsing, selectedTheme]);

  const finalOptionsForSelection = useMemo(() => {
    if (!selectedTheme || !selectedSubject) return [];
    // These are the specific Signature items with context
    return signatureOptions.filter(
      o => o.categoryDisplay === selectedTheme &&
           o.subcategoryDisplay === selectedSubject &&
           o.locationDisplay
    );
  }, [signatureOptions, selectedTheme, selectedSubject]);
  // --- End Derived Lists ---

  // Find a representative Concierge option for the static button
  const representativeConciergeOption = useMemo(() => {
      return allOptions.find(o => o.type === 'concierge');
  }, [allOptions]);

  // Determine view state
  const showSearchResults = searchQuery.trim().length > 0;
  const showFinalSelectionLevel = !showSearchResults && selectedTheme && selectedSubject;
  const showSubjects = !showSearchResults && selectedTheme && !selectedSubject;
  const showThemesAndConcierge = !showSearchResults && !selectedTheme && !selectedSubject;

  // Debug: Log when search results should be displayed
  React.useEffect(() => {
    if (showSearchResults) {
      console.log("Search results should be displayed now!");
      console.log("Search results count:", filteredSearchResults.length);
    }
  }, [showSearchResults, filteredSearchResults]);

  // Debug: Log the view state
  React.useEffect(() => {
    console.log("View state:", {
      showSearchResults,
      searchQuery,
      filteredSearchResultsCount: filteredSearchResults.length,
    });
  }, [showSearchResults, searchQuery, filteredSearchResults]);

  // Handle item selection (navigation or final choice)
  const handleSelect = (item: StoryOption | string, level: 'theme' | 'subject' | 'context') => {
    if (level === 'theme') {
      setSelectedTheme(item as string);
    } else if (level === 'subject') {
      const subject = item as string;
      // Check if any options for this theme+subject have a context/location (relevant for Signature)
      const hasContextOptions = signatureOptions.some(
        o => o.categoryDisplay === selectedTheme && o.subcategoryDisplay === subject && o.locationDisplay
      );

      if (hasContextOptions) {
        setSelectedSubject(subject);
      } else {
        // No context level, find the specific option (Signature or Custom) and select it directly
        const optionToSelect = optionsForHierarchicalBrowsing.find(
          o => o.categoryDisplay === selectedTheme && o.subcategoryDisplay === subject && !o.locationDisplay
        );
        if (optionToSelect) {
          handleStorySeriesSelection(optionToSelect);
        }
      }
    } else if (level === 'context') {
      handleStorySeriesSelection(item as StoryOption);
    }
  };

   // Handle the click on the static Concierge item
   const handleConciergeSelect = () => {
      if (representativeConciergeOption) {
          handleStorySeriesSelection(representativeConciergeOption);
      } else {
          // Fallback: create a minimal object if no concierge row exists in DB
          // This ensures the parent component knows Concierge was selected
          console.warn("No concierge data found in DB, creating fallback selection object.")
          handleStorySeriesSelection({ 
              id: 'concierge-fallback', // Use a specific ID
              label: 'Concierge Edition',
              type: 'concierge',
              categoryDisplay: 'Concierge' // Provide a category
          });
      }
  };


  // Render Breadcrumbs
  const renderBreadcrumbs = () => {
    if (showSearchResults || filterType === 'concierge' || (!selectedTheme && !selectedSubject)) return null;

    let rootLabel = "Editions"; // Default start
    let determinedType: 'signature' | 'custom' | null = null;

    // Priority 1: Use the explicit filter if it's signature or custom
    if (filterType === 'signature' || filterType === 'custom') {
      determinedType = filterType;
    } 
    // Priority 2: If no filter (or concierge filter), determine type from selected theme
    else if (selectedTheme) {
      const themeType = optionsForHierarchicalBrowsing.find(o => o.categoryDisplay === selectedTheme)?.type;
      // Explicitly check if the found type is one we handle hierarchically
      if (themeType === 'signature' || themeType === 'custom') {
          determinedType = themeType;
      }
    }
    
    // Set the label if a type was determined
    if(determinedType) {
        rootLabel = `${determinedType.charAt(0).toUpperCase() + determinedType.slice(1)} Editions`;
    }

    return (
      <div className="flex items-center px-3 pt-2 pb-1 text-sm text-muted-foreground border-b mb-2">
         <span className="font-medium mr-1">{rootLabel}</span>
         {selectedTheme && (
           <>
            <span className="mx-1">/</span>
             <Button
               variant="link"
               className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
               onClick={() => {
                 setSelectedTheme(null);
                 setSelectedSubject(null);
               }}
             >
               {selectedTheme}
             </Button>
           </>
         )}
         {selectedSubject && (
           <>
             <span className="mx-1">/</span>
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedSubject(null)}
              >
                {selectedSubject}
              </Button>
           </>
         )}
       </div>
     );
   };

  // Check if a theme contains any subjects
  const themeHasSubjects = (theme: string): boolean => {
     return optionsForHierarchicalBrowsing.some(o => o.categoryDisplay === theme && o.subcategoryDisplay);
  }

  // Check if a subject (within a theme) contains any contexts
   const subjectHasContexts = (theme: string | null, subject: string): boolean => {
     if (!theme) return false;
     // Only relevant for Signature options
     return signatureOptions.some(o => 
         o.categoryDisplay === theme && 
         o.subcategoryDisplay === subject && 
         o.locationDisplay
     );
   }

  return (
    <Command className="rounded-lg border-0 shadow-none bg-white">
      <div className="p-4">
        <CommandInput
          placeholder="Search themes, locations, or teams..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="h-10 text-base"
        />
      </div>

      {renderBreadcrumbs()}

      {/* Direct rendering of search results with fallback to CommandList when not searching */}
      {showSearchResults ? (
        <div className="p-4 overflow-y-auto max-h-[400px]">
          {filteredSearchResults.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              No results found for "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSearchResults.map((option) => {
                const displayPath = [option.categoryDisplay, option.subcategoryDisplay, option.locationDisplay]
                  .filter(Boolean)
                  .join(' / ');
                const editionTypeLabel = `${option.type.charAt(0).toUpperCase() + option.type.slice(1)} Edition`;
                
                return (
                  <div 
                    key={option.id}
                    onClick={() => handleStorySeriesSelection(option)}
                    className="p-3 rounded-md cursor-pointer hover:bg-legacy-green/10 border border-transparent hover:border-legacy-green/20"
                  >
                    <div className="font-medium">{displayPath}</div>
                    <div className="text-xs text-muted-foreground mt-1">{editionTypeLabel}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <CommandList className="max-h-[400px] overflow-y-auto p-2">
          {!selectedTheme && signatureThemes.length === 0 && customThemes.length === 0 && !representativeConciergeOption && (
            <CommandEmpty>No options available{filterType ? ` for ${filterType} editions` : ''}.</CommandEmpty>
          )}
          
          {/* FINAL SELECTION LEVEL (Contexts for Signature) */} 
          {showFinalSelectionLevel && (
               <CommandGroup heading={selectedSubject || 'Select Location'}> 
                   {finalOptionsForSelection.length === 0 && <CommandEmpty>No specific locations found.</CommandEmpty>} 
                   {finalOptionsForSelection.map((option) => (
                       <CommandItem 
                           key={option.id}
                           onSelect={() => handleSelect(option, 'context')}
                           className="py-2 cursor-pointer hover:bg-legacy-green/5 rounded-md mb-1"
                       >
                           {option.locationDisplay} 
                       </CommandItem>
                   ))}
               </CommandGroup>
          )}

          {/* SUBJECT VIEW */} 
          {showSubjects && (
               <CommandGroup heading={selectedTheme || 'Select Subject'}> 
                   {availableSubjects.length === 0 && <CommandEmpty>No subcategories found.</CommandEmpty>} 
                   {availableSubjects.map((subject) => {
                       const hasContexts = subjectHasContexts(selectedTheme, subject);
                       return (
                           <CommandItem 
                               key={subject}
                               onSelect={() => handleSelect(subject, 'subject')}
                               className="flex items-center justify-between py-2 cursor-pointer hover:bg-legacy-green/5 rounded-md mb-1"
                           >
                               <span>{subject}</span>
                               {hasContexts && (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" /> 
                               )}
                           </CommandItem>
                       );
                   })}
               </CommandGroup>
          )}

          {/* INITIAL THEME VIEW (Split by Edition Type + Concierge) */} 
          {showThemesAndConcierge && (
              <>
                   {/* Signature Themes */} 
                   {(!filterType || filterType === 'signature') && signatureThemes.length > 0 && (
                       <CommandGroup heading="Signature Editions" className="mb-3">
                           {signatureThemes.map((theme) => {
                               const hasSubs = themeHasSubjects(theme);
                               return (
                                   <CommandItem 
                                       key={theme}
                                       onSelect={() => handleSelect(theme, 'theme')}
                                       className="flex items-center justify-between py-2 cursor-pointer hover:bg-legacy-green/5 rounded-md mb-1"
                                   >
                                       <span>{theme}</span>
                                       {hasSubs && (
                                           <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                       )}
                                   </CommandItem>
                               );
                           })}
                       </CommandGroup>
                   )}
                   
                   {/* Custom Themes */} 
                   {(!filterType || filterType === 'custom') && customThemes.length > 0 && (
                        <CommandGroup heading="Custom Editions" className="mb-3">
                            {customThemes.map((theme) => {
                                const hasSubs = themeHasSubjects(theme);
                                return (
                                    <CommandItem 
                                        key={theme}
                                        onSelect={() => handleSelect(theme, 'theme')}
                                        className="flex items-center justify-between py-2 cursor-pointer hover:bg-legacy-green/5 rounded-md mb-1"
                                    >
                                        <span>{theme}</span>
                                        {hasSubs && (
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    )}
                    
                   {/* Concierge Link Item */} 
                   {(!filterType || filterType === 'concierge') && (
                        <CommandGroup heading="Concierge Edition" className="mb-3">
                            <CommandItem 
                                key="concierge-start-link" 
                                onSelect={handleConciergeSelect}
                                className="flex items-center justify-between py-2 cursor-pointer hover:bg-legacy-green/5 rounded-md mb-1"
                            >
                                <span>Start a Concierge Edition</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </CommandItem>
                        </CommandGroup>
                    )}
              </>
          )}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchableCommandMenu;
