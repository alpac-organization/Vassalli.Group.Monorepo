export interface PersonalFormData {
  //solo campos de lectura
  identificationNumber: string;
  gender: string;

  //campos editables
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  address: string;
  personalEmail: string;
  personalPhone: string;
  department: string;
}
export interface WorkFormData {
  startDate: string;
  jobPosition: string;
  workArea: string;
  workEmail?: string;
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
