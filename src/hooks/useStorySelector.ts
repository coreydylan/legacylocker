import { create } from 'zustand';

interface StorySelectorState {
  isOpen: boolean;
  filter: 'signature' | 'custom' | 'concierge' | null;
  openStorySelector: (options?: { filter?: 'signature' | 'custom' | 'concierge' }) => void;
  closeStorySelector: () => void;
}

export const useStorySelector = create<StorySelectorState>((set) => ({
  isOpen: false,
  filter: null,
  openStorySelector: (options = {}) => {
    set({ isOpen: true, filter: options.filter || null });
    // Scroll to the story selector section
    const selector = document.getElementById('story-selector');
    if (selector) {
      selector.scrollIntoView({ behavior: 'smooth' });
    }
  },
  closeStorySelector: () => set({ isOpen: false, filter: null }),
})); 