import { create } from "zustand";
import { triggerBackgroundRefetch } from "@app/shared/utils/server-error-recovery";

const RECOVERY_INTERVAL_MS = 8000;
const FIRST_RETRY_DELAY_MS = 1500;

let recoveryIntervalId: ReturnType<typeof setInterval> | null = null;
let firstRetryTimeoutId: ReturnType<typeof setTimeout> | null = null;

function stopBackgroundRecovery(): void {
  if (recoveryIntervalId) {
    clearInterval(recoveryIntervalId);
    recoveryIntervalId = null;
  }
  if (firstRetryTimeoutId) {
    clearTimeout(firstRetryTimeoutId);
    firstRetryTimeoutId = null;
  }
}

function startBackgroundRecovery(): void {
  if (recoveryIntervalId || firstRetryTimeoutId) return;

  firstRetryTimeoutId = setTimeout(() => {
    firstRetryTimeoutId = null;
    triggerBackgroundRefetch();
    recoveryIntervalId = setInterval(() => {
      triggerBackgroundRefetch();
    }, RECOVERY_INTERVAL_MS);
  }, FIRST_RETRY_DELAY_MS);
}

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
    startBackgroundRecovery();
  },
  clearServerError: () => {
    stopBackgroundRecovery();
    set({
      isVisible: false,
      status: null,
    });
  },
}));
