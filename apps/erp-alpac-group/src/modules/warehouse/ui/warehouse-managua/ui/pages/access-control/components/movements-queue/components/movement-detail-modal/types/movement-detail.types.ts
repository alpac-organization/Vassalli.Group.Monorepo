import type { DataAccessControl } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

export type MovementDetailModalProps = {
  isOpen: boolean;
  movement: DataAccessControl | null;
  onClose: () => void;
};
