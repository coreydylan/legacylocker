import React from 'react';
import { Search, ChevronRight } from "lucide-react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { SeriesType } from '@/types/onboarding';
import { storySeriesData, getAllStoryOptions } from "@/data/storySeriesData";
import { customEditionOptions, ancestralEditionOptions, corporateEditionOptions, conciergeSeriesOptions } from "@/data/editionOptions";

interface SearchableCommandMenuProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubcategory: (subcategory: string | null) => void;
  handleStorySeriesSelection: (series: SeriesType) => void;
  filterType: 'signature' | 'custom' | 'concierge' | null;
  filteredOptions: ReturnType<typeof getAllStoryOptions>;
}

const SearchableCommandMenu: React.FC<SearchableCommandMenuProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  selectedSubcategory,
  setSelectedCategory,
  setSelectedSubcategory,
  handleStorySeriesSelection,
  filterType,
  filteredOptions,
}) => {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput 
        placeholder="Search for themes, locations, or interests..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="h-12 text-base"
      />
      
      <CommandList className="max-h-[400px] overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>
        
        {!searchQuery && !selectedCategory && (
          <>
            {(!filterType || filterType === 'signature') && (
              <CommandGroup heading="Signature Editions">
                {storySeriesData.map((category) => (
                  <CommandItem 
                    key={category.name}
                    onSelect={() => setSelectedCategory(category.name)}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-legacy-green/5"
                  >
                    <span className="font-medium">{category.display}</span>
                    <ChevronRight className="h-4 w-4" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {(!filterType || filterType === 'custom') && (
              <CommandGroup heading="Custom Editions">
                <CommandItem 
                  className="py-1 font-medium text-sm text-muted-foreground hover:bg-transparent pointer-events-none"
                >
                  Personal
                </CommandItem>
                {customEditionOptions.map((option) => (
                  <CommandItem 
                    key={option.id}
                    onSelect={() => handleStorySeriesSelection({
                      id: option.id,
                      label: option.label,
                      type: 'custom'
                    })}
                    className="py-3 cursor-pointer hover:bg-legacy-green/5"
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </CommandItem>
                ))}
                
                <CommandItem 
                  className="py-1 font-medium text-sm text-muted-foreground hover:bg-transparent pointer-events-none mt-2"
                >
                  Ancestral
                </CommandItem>
                {ancestralEditionOptions.map((option) => (
                  <CommandItem 
                    key={option.id}
                    onSelect={() => handleStorySeriesSelection({
                      id: option.id,
                      label: option.label,
                      type: 'custom'
                    })}
                    className="py-3 cursor-pointer hover:bg-legacy-green/5"
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </CommandItem>
                ))}
                
                <CommandItem 
                  className="py-1 font-medium text-sm text-muted-foreground hover:bg-transparent pointer-events-none mt-2"
                >
                  Corporate
                </CommandItem>
                {corporateEditionOptions.map((option) => (
                  <CommandItem 
                    key={option.id}
                    onSelect={() => handleStorySeriesSelection({
                      id: option.id,
                      label: option.label,
                      type: 'custom'
                    })}
                    className="py-3 cursor-pointer hover:bg-legacy-green/5"
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </CommandItem>
                ))}
                
                <CommandItem 
                  onSelect={() => handleStorySeriesSelection({
                    id: 'custom',
                    label: 'Build Your Own Story',
                    type: 'custom'
                  })}
                  className="py-3 cursor-pointer hover:bg-legacy-green/5 mt-2"
                >
                  <div className="flex flex-col">
                    <span>Build Your Own Story</span>
                    <span className="text-xs text-muted-foreground">Create your own unique 12-card story series.</span>
                  </div>
                </CommandItem>
              </CommandGroup>
            )}
            
            {(!filterType || filterType === 'concierge') && (
              <CommandGroup heading="Concierge Editions">
                {conciergeSeriesOptions.map((option) => (
                  <CommandItem 
                    key={option.id}
                    onSelect={() => handleStorySeriesSelection({
                      id: option.id,
                      label: option.label,
                      type: 'concierge'
                    })}
                    className="py-3 cursor-pointer hover:bg-legacy-green/5"
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
        
        {!searchQuery && selectedCategory && !selectedSubcategory && (
          <>
            <div className="flex items-center px-2 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCategory(null)}
                className="text-xs flex items-center"
              >
                {storySeriesData.find(c => c.name === selectedCategory)?.display}
              </Button>
              <span className="mx-1">/</span>
              <span className="text-xs text-muted-foreground">Select a subcategory</span>
            </div>
            <CommandGroup heading="Subcategories">
              {storySeriesData
                .find(c => c.name === selectedCategory)
                ?.subcategories.map((subcategory) => (
                  <CommandItem 
                    key={subcategory.name}
                    onSelect={() => {
                      if (subcategory.locations.length === 0) {
                        const category = storySeriesData.find(c => c.name === selectedCategory);
                        if (!category) return;
                        
                        handleStorySeriesSelection({
                          id: `${category.name}-${subcategory.name}`,
                          label: `${category.display} - ${subcategory.display}`,
                          type: 'signature'
                        });
                      } else {
                        setSelectedSubcategory(subcategory.name);
                      }
                    }}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-legacy-green/5"
                  >
                    <span>{subcategory.display}</span>
                    {subcategory.locations.length > 0 && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </>
        )}
        
        {!searchQuery && selectedCategory && selectedSubcategory && (
          <>
            <div className="flex items-center px-2 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCategory(null)}
                className="text-xs flex items-center"
              >
                {storySeriesData.find(c => c.name === selectedCategory)?.display}
              </Button>
              <span className="mx-1">/</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedSubcategory(null)}
                className="text-xs flex items-center"
              >
                {storySeriesData
                  .find(c => c.name === selectedCategory)
                  ?.subcategories.find(s => s.name === selectedSubcategory)?.display}
              </Button>
              <span className="mx-1">/</span>
              <span className="text-xs text-muted-foreground">Select a location</span>
            </div>
            <CommandGroup heading="Locations">
              {storySeriesData
                .find(c => c.name === selectedCategory)
                ?.subcategories
                .find(s => s.name === selectedSubcategory)
                ?.locations.map((location) => {
                  const category = storySeriesData.find(c => c.name === selectedCategory);
                  const subcategory = category?.subcategories.find(s => s.name === selectedSubcategory);
                  if (!category || !subcategory) return null;
                  
                  return (
                    <CommandItem 
                      key={location.name}
                      onSelect={() => handleStorySeriesSelection({
                        id: `${category.name}-${subcategory.name}-${location.name}`,
                        label: `${subcategory.display} - ${location.display}`,
                        type: 'signature'
                      })}
                      className="py-3 cursor-pointer hover:bg-legacy-green/5"
                    >
                      {location.display}
                    </CommandItem>
                  );
                })
              }
            </CommandGroup>
          </>
        )}
        
        {searchQuery && (
          <CommandGroup heading="Search Results">
            {filteredOptions.map((option, index) => (
              <CommandItem 
                key={`${option.categoryName}-${option.subcategoryName}-${option.locationName || index}`}
                onSelect={() => handleStorySeriesSelection({
                  id: `${option.categoryName}-${option.subcategoryName}-${option.locationName || 'search'}`,
                  label: option.fullDisplay,
                  type: 'signature'
                })}
                className="py-3 cursor-pointer hover:bg-legacy-green/5"
              >
                <div className="flex flex-col">
                  <span>{option.fullDisplay}</span>
                  <span className="text-xs text-muted-foreground">{option.categoryDisplay}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default SearchableCommandMenu;
