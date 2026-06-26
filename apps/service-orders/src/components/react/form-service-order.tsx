import { Button, InputText, Textarea, Checkbox } from "@alpac/design-system";
import { useForm } from "react-hook-form";

type ServiceOrderFormValues = {
   clientName: string;
   email: string;
   phone: string;
   description: string;
};

const inputClassName =
   "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export function FormServiceOrder() {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting }
   } = useForm<ServiceOrderFormValues>({
      defaultValues: {
         clientName: "",
         email: "",
         phone: "",
         description: "",
      },
   });

   const onSubmit = async (data: ServiceOrderFormValues) => {
      try {
         // TODO: enviar al backend
         console.log("Orden de servicio:", data);
         reset();
      } catch (error) {
         console.error("Error al enviar la orden:", error);
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="mx-auto w-[800px] rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-gray-600 dark:bg-[#272B34] dark:shadow-black/30"
      >
         <h1 className="mb-2 text-center text-2xl font-semibold text-neutral-900 dark:text-white">
            Nueva orden de servicio
         </h1>
         <p className="mb-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Complete los datos para registrar su solicitud.
         </p>

         <div className="flex flex-col gap-4">
            <InputText
               label="Nombre del cliente"
               placeholder="Ej. Juan Pérez"
               isRequired
               className={inputClassName}
               labelClassName={labelClassName}
               {...register("clientName", {
                  required: "El nombre del cliente es requerido",
               })}
               error={errors.clientName?.message}
            />

            <InputText
               label="Correo electrónico"
               type="email"
               placeholder="correo@ejemplo.com"
               isRequired
               className={inputClassName}
               labelClassName={labelClassName}
               {...register("email", {
                  required: "El correo es requerido",
                  pattern: {
                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                     message: "Ingrese un correo válido",
                  },
               })}
               error={errors.email?.message}
            />

            <InputText
               label="Teléfono"
               type="tel"
               placeholder="Ej. 8888-8888"
               isRequired
               className={inputClassName}
               labelClassName={labelClassName}
               {...register("phone", {
                  required: "El teléfono es requerido",
               })}
               error={errors.phone?.message}
            />

            <Textarea
               label="Descripción del servicio"
               placeholder="Describa el servicio que necesita..."
               rows={4}
               isRequired
               className={inputClassName}
               labelClassName={labelClassName}
               {...register("description", {
                  required: "La descripción es requerida",
                  minLength: {
                     value: 10,
                     message: "La descripción debe tener al menos 10 caracteres",
                  },
               })}
               error={errors.description?.message}
            />

            <div className="mt-4 flex flex-col gap-4 border-t border-slate-200 pt-4 dark:border-slate-600">
               <div className="flex items-center gap-2.5">
                  <Checkbox
                     aria-label="Aceptar términos y condiciones"
                     checked={false}
                     onChange={(e) => console.log(e.target.checked)}
                     className="shrink-0"
                  />
                  <p className="m-0 text-[15px] leading-normal text-neutral-700 dark:text-neutral-200">
                     Acepto los{" "}
                     <a
                        href="/service-orders"
                        className="font-medium text-alpac-primary-500 underline-offset-2 hover:underline dark:text-blue-400"
                     >
                        Términos y Condiciones
                     </a>
                  </p>
               </div>

               <div className="flex justify-end">
                  <Button
                     type="submit"
                     label="Enviar solicitud"
                     size="medium"
                     isLoading={isSubmitting}
                     className="min-w-40!"
                  />
               </div>
            </div>
         </div>
      </form>
   );
}
