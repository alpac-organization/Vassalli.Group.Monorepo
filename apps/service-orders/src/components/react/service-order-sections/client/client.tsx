import { InputText } from "@alpac/design-system";
import { FormProvider, useForm } from "react-hook-form";

const inputClassName =
   "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

type ClientProps = {
    styleClass?: string;
};

export const Client = ({ styleClass = "" }: ClientProps) => {
    const methods = useForm();

    return (
        <FormProvider {...methods}>
            <div className={`flex flex-col gap-4 ${styleClass}`}>
                <InputText
                    label="Razón social o nombre"
                    placeholder="Ej. Exportadora del Pacífico S.A."
                    isRequired
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...methods.register("clientName", {
                        required: "El nombre o razón social es requerido",
                    })}                    
                />

                <InputText
                    label="RUC"
                    placeholder="Ej. J0310000123456"
                    isRequired
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...methods.register("ruc", {
                        required: "El RUC es requerido",
                    })}
                />

                <InputText
                    label="Correo electrónico"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    isRequired
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...methods.register("email", {
                        required: "El correo es requerido",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Ingrese un correo válido",
                        },
                    })}
                />

                <InputText
                    label="Teléfono"
                    type="tel"
                    placeholder="Ej. 8888-8888"
                    isRequired
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...methods.register("phone", {
                        required: "El teléfono es requerido",
                    })}                
                />
            </div>
        </FormProvider>

    );
}




