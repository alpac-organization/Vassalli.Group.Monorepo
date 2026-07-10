import { Modal } from "@alpac/design-system";
import type { RegisterArrivedModalProps } from "./register-arrived-modal.types";
import { useCallback } from "react";

export const RegisterArrivedModal = (props: RegisterArrivedModalProps) => {

    const handleCloseModal = useCallback(() => { 
        props.onClose?.();
    }, []);

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={handleCloseModal}
            title="Registrar Llegada"
            variant="form"
            size="3xl"
            description="Complete la información de los viáticos">

        </Modal>
    );
}