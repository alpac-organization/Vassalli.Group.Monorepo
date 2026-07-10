import { InputText } from "@alpac/design-system";

export const DriverData = () => {
    return (
        <>
            <h5 className="text-black mb-5!">Datos del Conductor</h5>
            <div className="grid grid-cols-3 gap-4">

                <InputText
                    label="Nombre del Conductor"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <InputText
                    label="Licencia"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <InputText
                    label="Número de Cédula"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <InputText
                    label="Teléfono"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <InputText
                    label="Placa Cabezal"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <InputText
                    label="Placa Rastra"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <InputText
                    label="Transporte"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />
            </div>
        </>
    );
}