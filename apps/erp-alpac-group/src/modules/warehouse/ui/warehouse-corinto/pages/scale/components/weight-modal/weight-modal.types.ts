import type { ScaleRecord } from "@app/modules/warehouse/ui/warehouse-corinto/types/driver.types";

export type WeightModalProps = {
   isOpen: boolean;
   onClose: () => void;
   record: ScaleRecord | null;
};

export type WeightStageCardProps = {
   accent: "blue" | "amber" | "emerald";
   label: string;
   value: string;
   meta?: string;
   subMeta?: string;
   isPending?: boolean;
   highlighted?: boolean;
};