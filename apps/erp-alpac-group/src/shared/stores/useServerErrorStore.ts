import { create } from "zustand";

interface ServerErrorState {
  isVisible: boolean;
  status: number | null;
  showServerError: (payload: { status: number }) => void;
  clearServerError: () => void;
}

export const useServerErrorStore = create<ServerErrorState>((set) => ({
  isVisible: false,
  status: null,
  showServerError: ({ status }) => {
    set({
      isVisible: true,
      status,
    });
  },
  clearServerError: () => {
    set({
      isVisible: false,
      status: null,
    });
  },
}));
