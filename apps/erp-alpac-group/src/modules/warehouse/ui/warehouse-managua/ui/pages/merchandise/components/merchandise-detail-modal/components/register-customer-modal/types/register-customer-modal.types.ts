export interface RegisterCustomerModalProps {
  isOpen: boolean;
  company_id: string;
  module_code: string;
  onClose: () => void;
  onCreated?: (customerId: string) => void;
  onRequestRegisterCustomerType?: () => void;
  newlyCreatedCustomerTypeId?: string | null;
}

export interface RegisterCustomerFormValues {
  cif: string;
  legal_name: string;
  picture_base64?: string;
  identification_number: string;
  identification_type: number;
  customer_type_id: string;
}
