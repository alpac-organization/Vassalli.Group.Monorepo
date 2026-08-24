export interface RegisterCustomerTypeModalProps {
  isOpen: boolean;
  company_id: string;
  module_code: string;
  onClose: () => void;
  onCreated?: (customerTypeId: string) => void;
}

export interface RegisterCustomerTypeFormValues {
  code: string;
  name: string;
}
