export interface RegisterNavieraModalProps {
  isOpen: boolean;
  company_id: string;
  module_code: string;
  onClose: () => void;
  onCreated?: () => void;
}
