import { create } from "zustand";

interface ApiStatusState {
  activeRequestsCount: number;
  isSlowLoading: boolean;
  startRequest: () => void;
  finishRequest: () => void;
  reset: () => void;
}

let activeCount = 0;
let timer: ReturnType<typeof setTimeout> | null = null;

export const useApiStatusStore = create<ApiStatusState>((set) => ({
  activeRequestsCount: 0,
  isSlowLoading: false,

  startRequest: () => {
    activeCount++;
    set({ activeRequestsCount: activeCount });

    // When the first active request starts, start 3-second timer
    if (activeCount === 1) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (activeCount > 0) {
          set({ isSlowLoading: true });
        }
      }, 3000);
    }
  },

  finishRequest: () => {
    activeCount = Math.max(0, activeCount - 1);
    set({ activeRequestsCount: activeCount });

    // When all active requests have finished, clear timer and hide slow status
    if (activeCount === 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      set({ isSlowLoading: false });
    }
  },

  reset: () => {
    activeCount = 0;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    set({ activeRequestsCount: 0, isSlowLoading: false });
  },
}));
