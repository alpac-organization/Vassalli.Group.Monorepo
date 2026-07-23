export type RequisitionReportAction =
  | "requisition"
  | "Eventual"
  | "Mensual";

export type RequisitionGenerateReportsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  options: { label: string; value: RequisitionReportAction }[];
  appearance: "dark" | "default";
  selectedAction: RequisitionReportAction | null;
  onSelectedActionChange: (value: RequisitionReportAction | null) => void;
  onConfirm: () => void | Promise<void>;
  isConfirmLoading?: boolean;
};
