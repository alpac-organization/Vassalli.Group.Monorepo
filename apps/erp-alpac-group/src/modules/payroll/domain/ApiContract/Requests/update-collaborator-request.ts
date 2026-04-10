export interface UpdateCollaboratorProfileDetailsRequest {
  /**
   * Id de la empresa
   * @example "123e4567-e89b-12d3-a456-426614174000"
   * @required
   */
  company_id: string;
  /**
   * Codigo del modulo de Nomina, Contabilidad, Facturacion, Inventario, etc
   * @example "123e4567-e89b-12d3-a456-426614174000"
   * @required
   */
  module_code: string;
  /*
   * Numero de identificación del colaborador
   * @example "001-120395-0000X"
   * @required
   */
  identification_number: string;
  personal_information?: UpdatePersonalInformationRequest;
  working_information?: UpdateWorkingInformationRequest;
  // salary_information?: UpdateSalaryInformationRequest;
}
export interface UpdatePersonalInformationRequest {
  address?: string;
  personal_email?: string;
  personal_phone_number?: string;
  marital_status?: number;
  departament_id?: number;
}
export interface UpdateWorkingInformationRequest {
  work_email?: string;
  work_phone_number?: string;
}
// export interface UpdateSalaryInformationRequest {
//   salary?: number;
//   currency?: string | number;
//   salary_type?: number;
// }
