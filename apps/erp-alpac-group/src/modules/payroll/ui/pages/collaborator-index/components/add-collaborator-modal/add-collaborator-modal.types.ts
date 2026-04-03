import type { AddCollaboratorRequest } from '@app/modules/payroll/domain/ApiContract/Requests/add-collaborator.request';

export type AddCollaboratorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddCollaboratorRequest) => void;
};
