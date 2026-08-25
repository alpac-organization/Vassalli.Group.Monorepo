export type Platform = "ios" | "android" | "desktop";

export interface NotificationBannerProps {
	permissionGranted: boolean | null;
	requestPermission: () => Promise<void>;
	isLoading: boolean;
}
