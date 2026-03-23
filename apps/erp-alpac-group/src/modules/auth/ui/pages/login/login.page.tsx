import { Fragment, useMemo } from "react"
import { FormLayout } from "@app/shared/layouts"
import { Controller, useForm } from "react-hook-form";
import { useCompanies } from "../../hooks/useCompanies"
import { Button, Dropdown, InputText } from "@alpac/design-system";

import type { LoginRequest } from "./login.types";
import { ContentLoaded } from "@app/shared/components/content-loaded/content-loaded";
import { useAuth } from "../../hooks/useAuth";

export const LoginPage = function () {
   const { GetCompaniesQuery } = useCompanies();
   const { startLoginProcess } = useAuth();

   const { data, isLoading } = GetCompaniesQuery

   const companyOptions = useMemo(() => {
      return data?.map((c) => ({ label: c.alias, value: c.company_id })) || [];
   }, [data]);

   const { handleSubmit, register, setError, reset, control, formState: { errors, isDirty, isValid } } = useForm<LoginRequest>({
      defaultValues: {
         password: "",
         username: "",
         company_id: 0
      }
   });

   const handleLogin = async function (state: LoginRequest) {
      try {

         if (state.company_id === 0) {
            setError("company_id", {
               type: "value",
               message: "Debe seleccionar la empresa de origen",
            });
         }

         await startLoginProcess.mutateAsync({
            password: state.password,
            username: state.username,
            company_id: state.company_id
         });

      }
      catch (error) {
         console.error(error);
      }
      finally {
         reset();
      }
   }

   // Principal loading screen
   if (isLoading || startLoginProcess.isPending) {
      return (
         <ContentLoaded />
      )
   }

   return (
      <Fragment>
         <div className="h-full ">
            <FormLayout>
               <form
                  onSubmit={handleSubmit(handleLogin)}
                  className="h-full flex flex-col justify-center gap-2"
               >
                  <Controller
                     name="company_id"
                     control={control}
                     rules={{
                        required: "Debe seleccionar una empresa",
                        validate: (val) => val !== 0 || "Selección inválida"
                     }}
                     render={({ field }) => (
                        <Dropdown
                           label="Empresas"
                           options={companyOptions}
                           placeholder="Seleccione su empresa"
                           onChange={(value) => {
                              field.onChange(value)
                           }}
                           error={errors.company_id && errors.company_id.message}
                           value={field.value}
                        />
                     )}
                  />

                  <InputText
                     type="text"
                     label="Usuario / Correo"
                     placeholder="Ingrese su usuario o correo"
                     {
                     ...register("username", {
                        required: "El usuario o correo es requerido"
                     })
                     }
                     error={errors.username && errors.username.message}
                  />

                  <InputText
                     label="Contraseña"
                     type="password"
                     placeholder="Ingrese su contraseña"
                     isPassword
                     {
                     ...register("password", {
                        required: "La contraseña es requerida"
                     })
                     }
                     error={errors.password && errors.password.message}
                  />

                  <div className="w-full flex flex-col mt-5">
                     <Button
                        disabled={!isDirty || !isValid}
                        label="Iniciar sesión"
                        size="medium"
                     />
                  </div>
               </form>
            </FormLayout>
         </div>
      </Fragment>
   )
}