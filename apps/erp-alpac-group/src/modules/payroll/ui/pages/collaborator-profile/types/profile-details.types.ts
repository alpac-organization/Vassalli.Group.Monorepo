export interface PersonalFormData {
  identification_number: string;
  /** Valor crudo del API (p. ej. Man, Woman). */
  gender: string;
  /** Código numérico 0–7 como string para estado civil. */
  marital_status: string;
  birthdate: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  address: string;
  personalEmail: string;
  personalPhone: string;
  /** `sub_catalog_id` del catálogo departamentos, string para RHF. */
  department_id: string;
  /** Nombre departamento desde API (fallback de etiqueta). */
  departament: string;
}
export interface WorkFormData {
  entry_date?: Date;
  jobPosition: string;
  workArea: string;
  workEmail?: string;
  workPhoneNumber?: string;
  inssNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  branchName?: string;
  salaryAmount?: string;
  currency?: string;
  salaryType?: string;
}
export interface ProfileSummary {
  displayName: string;
  logoSrc: string;
  companyName?: string;
  className?: string;
}
