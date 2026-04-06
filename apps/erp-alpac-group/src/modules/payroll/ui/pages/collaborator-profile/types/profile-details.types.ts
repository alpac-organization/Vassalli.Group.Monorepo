export interface PersonalFormData {
  //solo campos de lectura
  identification_type: string;
  identification_number: string;
  gender: string;
  marital_status: string;

  //campos editables
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  address: string;
  personalEmail: string;
  personalPhone: string;
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
