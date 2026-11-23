export type OrderProductsStateVariant = "loading" | "error" | "empty";

export interface OrderProductsStateProps {
  variant: OrderProductsStateVariant;
  message?: string;
  onRetry?: () => void;
}
