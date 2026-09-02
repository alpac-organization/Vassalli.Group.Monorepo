export type RegisterDucatGeneralFormValues = {
  shipping_company_id: string;
  general_observations: string;
  is_in_transit: boolean;
};

export type RegisterDucatGeneralFormProps = {
  reception_id: string;
  company_id: string;
  module_code: string;
  startedAt: { start_date: string; start_time: string } | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};