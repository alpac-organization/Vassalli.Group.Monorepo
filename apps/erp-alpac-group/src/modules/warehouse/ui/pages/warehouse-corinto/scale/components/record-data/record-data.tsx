import { Dropdown, InputText } from "@alpac/design-system";

export const RecordData = () => {
    return (
        <>
            <h5 className="text-black mb-5!">Datos del Registro</h5>
            <div className="grid grid-cols-3 gap-4">

                <InputText
                    label="Cliente"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <Dropdown
                    label="Bodega"
                    isRequired
                    placeholder="Seleccione..."
                    options={[]}
                    appearance="dark"
                    labelClassName="text-black!"
                    valueClassName="text-black!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600!"
                />

                <InputText
                    label="Orden de Entrega"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <InputText
                    label="Orden de Transporte"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <InputText
                    label="Bultos"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <Dropdown
                    label="Presentación"
                    isRequired
                    placeholder="Seleccione..."
                    options={[]}
                    appearance="dark"
                    labelClassName="text-black!"
                    valueClassName="text-black!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600!"
                />

                <Dropdown
                    label="Calidad"
                    isRequired
                    placeholder="Seleccione..."
                    options={[]}
                    appearance="dark"
                    labelClassName="text-black!"
                    valueClassName="text-black!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600!"
                />              

            </div>
        </>
    );
}