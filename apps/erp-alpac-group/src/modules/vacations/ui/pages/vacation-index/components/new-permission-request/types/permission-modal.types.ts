import type { ChannelEnum } from "@app/core/enums/channel.enum";

export type NewPermissionRequestModalProps = {
   isOpen: boolean;
   onClose?: () => void;
   collaboratorFullName?: string;
   collaboratorWorkPosition?: string;
   isCollaboratorFullNameLoading?: boolean;
   isCollaboratorWorkPositionLoading?: boolean;
   channel: ChannelEnum;
   onRequestSuccess?: () => void;
   onRequestError?: (description: string) => void;
};
