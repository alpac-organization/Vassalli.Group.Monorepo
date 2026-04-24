export interface PersonalFormData {
   identification_number?: string;
   gender?: string;
   marital_status?: string;
   birthdate?: string;
   address?: string;
   personalEmail?: string;
   personalPhone?: string;
   department_id?: string;
   department?: string;
}

export interface WorkFormData {
   entry_date?: string;
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

/*export interface ProfileSummary {
   displayName: string;
   logoSrc: string;
   companyName?: string;
   className?: string;
}*/
