export type Platform = "ios" | "android" | "desktop";

import type { PermissionRequestOutcome } from "@app/shared/hooks/useNotifications";

export interface NotificationBannerProps {
	permissionGranted: boolean | null;
	requestPermission: () => Promise<PermissionRequestOutcome>;
	isLoading: boolean;
}
