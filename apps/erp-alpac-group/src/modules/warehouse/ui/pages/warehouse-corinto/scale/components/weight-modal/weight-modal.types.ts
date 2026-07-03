import type { ScaleRecord } from "../../../../types/driver.types";

export type WeightModalProps = {
   isOpen: boolean;
   onClose: () => void;
   record: ScaleRecord | null;
};
