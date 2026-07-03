import { Modal } from "@alpac/design-system";
import type { RegisterArrivedModalProps } from "./register-arrived-modal.types";

export const RegisterArrivedModal = (props: RegisterArrivedModalProps) => {
    return (
        <Modal
            isOpen={props.isOpen}
            onClose={() => { }}
            title="Registrar Llegada"
            variant="form"
            size="3xl"
            description="Complete la información de los viáticos">

        </Modal>
    );
}