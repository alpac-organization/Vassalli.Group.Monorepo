export interface WarehouseModalProps {
    isOpen: boolean,
    onClose: () => void;
    onSubmit: (data: any) => void;
}