import { create } from "zustand";

interface InactivityState {
   isInactive: boolean;
   lastActivity: number;
   setIsInactive: (isInactive: boolean) => void;
   recordActivity: () => void;
}

export const useInactivityStore = create<InactivityState>((set) => ({
   isInactive: false,
   lastActivity: Date.now(),
   setIsInactive: (isInactive: boolean) => set({ isInactive }),
   recordActivity: () => set({ 
      isInactive: false, 
      lastActivity: Date.now() 
   }),
}));