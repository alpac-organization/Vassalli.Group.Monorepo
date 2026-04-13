import type { QueryClient } from "@tanstack/react-query";

let queryClientRef: QueryClient | null = null;

export function registerQueryClientForServerRecovery(
  queryClient: QueryClient,
): void {
  queryClientRef = queryClient;
}

export function triggerBackgroundRefetch(): void {
  if (!queryClientRef) return;
  void queryClientRef.refetchQueries({ type: "active" });
}
