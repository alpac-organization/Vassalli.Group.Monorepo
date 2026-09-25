export const MONTHLY_TAB_ID = "monthly-applications";
export const MONTHLY_NOTE_STORAGE_PREFIX =
	"purchasing.monthly-request-note.dismissed-at-v2";
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const getMonthlyNoteStorageKey = (userKey: string) =>
	`${MONTHLY_NOTE_STORAGE_PREFIX}:${userKey}`;

export const shouldShowMonthlyNote = (userKey: string): boolean => {
	if (typeof window === "undefined") return false;

	const key = getMonthlyNoteStorageKey(userKey);
	const raw = localStorage.getItem(key);

	if (!raw) return true;

	const dismissedAt = Number(raw);
	if (Number.isNaN(dismissedAt)) {
		localStorage.removeItem(key);
		return true;
	}

	const isExpired = Date.now() - dismissedAt >= ONE_DAY_MS;
	if (isExpired) {
		localStorage.removeItem(key);
		return true;
	}

	return false;
};

export const dismissMonthlyNote = (userKey: string): void => {
	localStorage.setItem(getMonthlyNoteStorageKey(userKey), String(Date.now()));
};
