import { Dropdown, InputText, Textarea } from "@alpac/design-system";
import { Controller, FormProvider, useForm } from "react-hook-form";

const inputClassName =
    "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

type ProductProps = {
    styleClass?: string;
};

export const Product = ({ styleClass = "" }: ProductProps) => {

    const methods = useForm();

    return (
        <FormProvider {...methods}>
            <div className={`flex flex-col gap-4 ${styleClass}`}>
                <Textarea
                    label="Descripción de la mercancía"
                    placeholder="Ej. Azúcar en sacos de 25 kg..."
                    rows={3}
                    isRequired
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...methods.register("merchandiseDescription", {
                        required: "La descripción de la mercancía es requerida",
                        minLength: {
                            value: 10,
                            message: "La descripción debe tener al menos 10 caracteres",
                        },
                    })}
                />

                <Controller
                    name="destinationCountry"
                    control={methods.control}
                    rules={{ required: "Seleccione el país de destino" }}
                    render={({ field }) => (
                        <Dropdown
                            label="País de destino"
                            placeholder="Seleccione un país"
                            options={[]}
                            isRequired
                            className={inputClassName}
                            labelClassName={labelClassName}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />

                {/*             <InputText
               label="Valor FOB estimado (USD)"
               type="number"
               placeholder="Ej. 15000"
               isRequired
               className={inputClassName}
               labelClassName={labelClassName}
               {...register("estimatedFobValue", {
                  required: "El valor FOB estimado es requerido",
                  min: {
                     value: 1,
                     message: "Ingrese un valor mayor a 0",
                  },
               })}
               error={errors.estimatedFobValue?.message}
            /> */}
                Descripción, cantidad, valor...
            </div>
        </FormProvider>

    );
}




