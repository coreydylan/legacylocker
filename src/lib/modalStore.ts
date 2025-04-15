import { create } from 'zustand';

interface ModalState {
  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOnboardingOpen: false,
  openOnboarding: () => {
    console.log('Opening onboarding modal');
    set({ isOnboardingOpen: true });
  },
  closeOnboarding: () => {
    console.log('Closing onboarding modal');
    set({ isOnboardingOpen: false });
  },
})); 