export interface SelectCostCenterProps
{
    readonly areaId: string;
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSelect: (props: OnSelectProps) => void;
}

export interface OnSelectProps {
    costCenterId: string | null;
    costCenterName: string | null;
}