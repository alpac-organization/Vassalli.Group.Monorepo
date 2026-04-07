import type { AddCollaboratorRequest } from '@app/modules/payroll/domain/ApiContract/Requests/add-collaborator.request';
import type { Path } from 'react-hook-form';

export type AddCollaboratorModalProps = {
  isOpen: boolean;
  optionsWorkAreas: { label: string; value: number }[];
  optionsJobPositions: { label: string; value: number }[];
  optionsBranches: { label: string; value: number }[];
  optionsBanks: { label: string; value: number }[];
  onClose: () => void;
  onSubmit: (data: AddCollaboratorRequest) => void;
};

export const fieldsToValidate: Path<AddCollaboratorRequest>[][] = [
  [
    'first_name',
    'second_name',
    'third_name',
    'first_lastname',
    'second_lastname',
    'identification_number',
    'identification_type',
    'gender',
  ],
  [
    'personal_information.address',
    'personal_information.personal_email',
    'personal_information.personal_phone_number',
    // 'personal_information.departament',
    'personal_information.birthdate',
  ],
  [
    'working_information.work_area_id',
    'working_information.work_position_id',
    'working_information.branch_id',
    'working_information.bank_account_number',
    'working_information.work_email',
    'working_information.work_phon_number',
    'working_information.inss_number',
    'working_information.entry_date',
  ],
  [
    'salary_information.currency',
    'salary_information.salary',
    'salary_information.salary_type',
    'salary_information.sub_catalog_bank_id',
  ],
];
