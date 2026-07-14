import { Button, Modal } from "@alpac/design-system";

import type { CustomerDetailsProps } from "./customer-details.types";

const mockCustomerDetail = {
    name: "Compañia Azucarera del Sur",
    identification: "J0310000000000",
    origin: "Nacional",
    phone: "8888-8888",
    email: "contacto@casur.com.ni",
    address: "Carretera a Corinto, Km 12",
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="min-w-0">
        <p className="m-0! mb-1! text-[11px]! font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            {label}
        </p>
        <p className="m-0! truncate text-[14px]! font-medium text-slate-800 dark:text-slate-100">
            {value}
        </p>
    </div>
);

export const CustomerDetails = (props: CustomerDetailsProps): React.ReactNode => {

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            title="Detalle del Cliente"
            description="Información general del cliente seleccionado"
            variant="default"
            size="3xl"
        >
            <div className="flex flex-col gap-5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-600 dark:bg-[#1f232b]">
                    <p className="m-0! mb-3! text-[11px]! font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                        Datos del cliente
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem label="Nombre" value={mockCustomerDetail.name} />
                        <DetailItem label="RUC / Identificación" value={mockCustomerDetail.identification} />
                        <DetailItem label="Origen" value={mockCustomerDetail.origin} />
                        <DetailItem label="Teléfono" value={mockCustomerDetail.phone} />
                        <DetailItem label="Correo electrónico" value={mockCustomerDetail.email} />
                        <DetailItem label="Dirección" value={mockCustomerDetail.address} />
                    </div>
                </div>

                <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6" />

                <div className="flex justify-end">
                    <Button
                        type="button"
                        size="giant"
                        label="Cerrar"
                        onClick={props.onClose}
                        className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
                    />
                </div>
            </div>
        </Modal>
    );
};
