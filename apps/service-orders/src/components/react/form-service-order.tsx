import { Button, Checkbox, Stepper } from "@alpac/design-system";
import { type ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Client } from "./service-order-sections/client/client";
import { Product } from "./service-order-sections/product/product";
import { Destination } from "./service-order-sections/destination/destination";
import { Logistics } from "./service-order-sections/logistics/logistics";
import { Documentation } from "./service-order-sections/documentation/documentation";
import { Services } from "./service-order-sections/services/services";

type ServiceOrderFormValues = {
   clientName: string;
   ruc: string;
   email: string;
   phone: string;
   merchandiseDescription: string;
   destinationCountry: string;
   estimatedFobValue: string;
   acceptTerms: boolean;
};

type StepPanelProps = {
   stepIndex: number;
   currentStep: number;
   children: ReactNode;
};

function StepPanel({ stepIndex, currentStep, children }: StepPanelProps) {
   const isActive = stepIndex === currentStep;
   const isPast = stepIndex < currentStep;

   return (
      <div
         className={[
            "col-start-1 row-start-1 transition-all duration-300 ease-in-out",
            isActive
               ? "z-10 translate-x-0 opacity-100"
               : isPast
                 ? "pointer-events-none z-0 -translate-x-8 opacity-0"
                 : "pointer-events-none z-0 translate-x-8 opacity-0",
         ].join(" ")}
         aria-hidden={!isActive}
      >
         {children}
      </div>
   );
}

export function FormServiceOrder() {

   const [currentStep, setCurrentStep] = useState(0);

   const steps = [
      "Datos de cliente",
      "Mercancía",
      "Destino",
      "Logística",
      "Documentación",
      "Servicios"
   ];

   const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<ServiceOrderFormValues>({
      defaultValues: {
         clientName: "",
         ruc: "",
         email: "",
         phone: "",
         merchandiseDescription: "",
         destinationCountry: "",
         estimatedFobValue: "",
         acceptTerms: false,
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

   const handleNext = async (e: React.MouseEvent) => {
      e.preventDefault();

      if (currentStep < steps.length - 1) {
         setCurrentStep((prev) => prev + 1);
      }
   };

   const handleBack = (e: React.MouseEvent) => {
      e.preventDefault();
      if (currentStep > 0) {
         setCurrentStep((prev) => prev - 1);
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
            Solicitud de exportación — complete los datos básicos para iniciar el proceso.
         </p>

         <div className="mb-10">
            <Stepper steps={steps} currentStep={currentStep} />
         </div>

         <div className="grid min-h-[300px] overflow-hidden">
            <StepPanel stepIndex={0} currentStep={currentStep}>
               <Client />
            </StepPanel>

            <StepPanel stepIndex={1} currentStep={currentStep}>
               <Product />
            </StepPanel>

            <StepPanel stepIndex={2} currentStep={currentStep}>
               <Destination />
            </StepPanel>

            <StepPanel stepIndex={3} currentStep={currentStep}>
               <Logistics />
            </StepPanel>

            <StepPanel stepIndex={4} currentStep={currentStep}>
               <Documentation />
            </StepPanel>

            <StepPanel stepIndex={5} currentStep={currentStep}>
               <Services />
            </StepPanel>
         </div>

         <div className="flex flex-col gap-4">

            <div className="mt-4 flex flex-col gap-4 border-t border-slate-200 pt-4 dark:border-slate-600">
               <div className="flex items-center gap-2.5">
                  <Controller
                     name="acceptTerms"
                     control={control}
                     rules={{
                        validate: (value) =>
                           value || "Debe aceptar los términos y condiciones",
                     }}
                     render={({ field }) => (
                        <Checkbox
                           aria-label="Aceptar términos y condiciones"
                           checked={field.value}
                           onChange={(e) => field.onChange(e.target.checked)}
                           className="shrink-0"
                        />
                     )}
                  />
                  <p className="m-0 text-[15px] leading-normal text-neutral-700 dark:text-neutral-200">
                     Acepto los{" "}
                     <a
                        href="/terms-conditions"
                        className="font-medium text-alpac-primary-500 underline-offset-2 hover:underline dark:text-blue-400"
                     >
                        Términos y Condiciones
                     </a>
                  </p>
               </div>

               {errors.acceptTerms?.message && (
                  <p className="m-0 text-sm text-red-500">{errors.acceptTerms.message}</p>
               )}

               <div className="flex justify-end gap-4">

                  <Button
                     type="button"
                     label="Anterior"
                     size="giant"
                     onClick={handleBack}
                     isHiddenLabelOnMobile
                     className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  />

                  <Button
                     type="button"
                     label="Siguiente"
                     size="giant"
                     onClick={handleNext}
                     isHiddenLabelOnMobile
                     className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  />

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
