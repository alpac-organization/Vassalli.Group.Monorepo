export interface OperationalOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  onOpenUpdateInfo?: (orderId: string) => void;
}
