export type RegisterDucatDetailFormValues = {
  type: string;
  merchandise_id: string;
  total_bultos: string;
  total_weight: string;
  product_description: string;
  remitente: string;
  destination_area_observation: string;
};

export type RegisterDucatDetailFormProps = {
  reception_id: string;
  ducat_id: string;
  company_id: string;
  module_code: string;
  ducatNumber: string;
  type?: string;
};
