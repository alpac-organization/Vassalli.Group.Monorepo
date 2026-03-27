export interface PersonalFormData {
  //solo campos de lectura
  identificationNumber: string;
  identificationType: string;
  registeredBy: string;

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
}
