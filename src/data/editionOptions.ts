
// Define the custom editions options
export const customEditionOptions = [
  { id: 'ourStory', label: 'Our Story', description: 'A collection of stories celebrating your journey together.', type: 'custom' as const },
  { id: 'yourChildhood', label: 'Your Childhood', description: 'Capturing the magic and memories of growing up.', type: 'custom' as const },
  { id: 'ourFamilyStory', label: 'Our Family Story', description: 'Document your family\'s unique history and experiences.', type: 'custom' as const },
  { id: 'firstYearOfMarriage', label: 'First Year of Marriage', description: 'Commemorate the special moments from your first year together.', type: 'custom' as const },
  { id: 'ourLoveStory', label: 'Our Love Story', description: 'The journey of your relationship from beginning to now.', type: 'custom' as const },
  { id: 'collegeJourney', label: 'College Journey', description: 'Relive the transformative years of education and growth.', type: 'custom' as const },
  { id: 'retirementReflections', label: 'Retirement Reflections', description: 'Looking back on a career and forward to new adventures.', type: 'custom' as const },
  { id: 'adventuresThroughTheYears', label: 'Adventures Through The Years', description: 'Chronicle your travels and experiences across time.', type: 'custom' as const },
];

// Options for ancestral editions
export const ancestralEditionOptions = [
  { 
    id: 'family-genealogy', 
    label: 'Our Family Genealogy', 
    description: 'Document your family tree and heritage with our customized service.', 
    type: 'custom' as const
  }
];

// Options for corporate editions
export const corporateEditionOptions = [
  { 
    id: 'team-story', 
    label: 'Our Team Story', 
    description: 'Celebrate your team\'s achievements and milestones.', 
    type: 'custom' as const
  },
  { 
    id: 'project-story', 
    label: 'Our Project Story', 
    description: 'Document the journey of a significant project from inception to completion.', 
    type: 'custom' as const
  },
  { 
    id: 'company-origin', 
    label: 'Our Company Origin', 
    description: 'Tell the founding story of your business or organization.', 
    type: 'custom' as const
  }
];

// Options for concierge editions
export const conciergeSeriesOptions = [
  { 
    id: 'family-legacy', 
    label: 'Family Legacy', 
    description: 'Preserve multi-generational family stories with our premium service.', 
    type: 'concierge' as const,
    isHighlighted: true
  },
  { 
    id: 'business-story', 
    label: 'Company History', 
    description: 'Document the journey of your business or organization with professional writers.', 
    type: 'concierge' as const
  },
  { 
    id: 'custom-concierge', 
    label: 'Fully Bespoke', 
    description: 'Work with our team to create something completely unique for any special occasion.', 
    type: 'concierge' as const
  },
];

export type EditionOption = {
  id: string;
  label: string;
  description: string;
  type: 'signature' | 'custom' | 'concierge';
  isHighlighted?: boolean;
};
