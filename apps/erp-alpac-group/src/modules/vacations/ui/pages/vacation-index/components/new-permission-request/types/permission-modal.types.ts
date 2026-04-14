export type NewPermissionRequestModalProps = {
   isOpen: boolean;
   onClose: () => void;
   collaboratorFullName?: string;
   collaboratorWorkPosition?: string;
   isCollaboratorFullNameLoading?: boolean;
   isCollaboratorWorkPositionLoading?: boolean;
   onRequestSuccess?: () => void;
   onRequestError?: (description: string) => void;
};
