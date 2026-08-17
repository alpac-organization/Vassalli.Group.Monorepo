export type RegisterMerchandiseFormValues = {
  merchandise_name: string;
  description: string;
  category_id: string;
};

export type RegisterMerchandiseModalProps = {
  isOpen: boolean;
  company_id: string;
  module_code: string;
  onClose: () => void;
  onCreated: (merchandiseId: string, merchandiseName: string) => void;
};