export interface UpdateReceptionInfoFormValues {
  customer_id: string;
  package_amount: number;
  merchandise_weight: number;
  has_merchandise: boolean;
  merchandise?: string;
  merchandise_description?: string;
}

export interface UpdateReceptionInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  poCode?: string;
  initialData?: {
    customerId?: string | null;
    packageAmount?: number | null;
    merchandiseWeight?: number | null;
  } | null;
  onSuccess?: () => void;
}
