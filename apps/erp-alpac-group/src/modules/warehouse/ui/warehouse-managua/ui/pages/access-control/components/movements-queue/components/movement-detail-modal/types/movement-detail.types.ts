import type { RecordEntrance } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

export type MovementDetailModalProps = {
  isOpen: boolean;
  movement: RecordEntrance | null;
  onClose: () => void;
};
