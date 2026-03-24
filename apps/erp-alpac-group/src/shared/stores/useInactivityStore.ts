import { create } from "zustand";

interface InactivityState {
    isInactive: boolean;
    duration: number;
    setIsInactive: (isInactive: boolean, duration: number) => void;
    getDuration: () => number;
}

export const useInactivityStore = create<InactivityState>((set, get) => ({
    isInactive: false,
    duration: 0,
    setIsInactive: (isInactive: boolean, duration: number) => set({ isInactive, duration }),
    getDuration: (): number => {
        const { isInactive, duration } = get()
        return isInactive ? duration : 0
    },
}))

