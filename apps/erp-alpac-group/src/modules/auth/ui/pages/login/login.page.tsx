import { Fragment, useEffect, useMemo, useState } from "react"
import { FormLayout } from "@app/shared/layouts"
import { Controller, useForm } from "react-hook-form";
import { useCompanies } from "../../hooks/useCompanies"
import { Alert, Button, Dropdown, InputText } from "@alpac/design-system";

import type { LoginRequest } from "./login.types";
import { ContentLoaded } from "@app/shared/components/content-loaded/content-loaded";
import { useAuth } from "../../hooks/useAuth";
import { useImage } from "../../hooks/useImage";

export const LoginPage = function () {
   const { GetCompaniesQuery } = useCompanies();
   const { startLoginProcess } = useAuth();
   const [showAuthError, setShowAuthError] = useState(false);
   const [isExiting, setIsExiting] = useState(false);

   const { data, isLoading } = GetCompaniesQuery

   const companyOptions = useMemo(() => {
      return data?.map((c) => ({ label: c.alias, value: c.company_id })) || [];
   }, [data]);


   const { handleSubmit, register, setError, reset, control, watch, formState: { errors, isDirty, isValid } } = useForm<LoginRequest>({
      mode: "onChange",
      defaultValues: {
         password: "",
         username: "",
         company_id: 0
      }
   });

   const selectedCompanyId = watch("company_id");

   const currentCompany = useMemo(() => {
      return data?.find((c) => c.company_id === selectedCompanyId);
   }, [data, selectedCompanyId]);

   const { urlImage } = useImage(currentCompany?.alias || "alpac");

   const handleLogin = async function (state: LoginRequest) {
      try {
         setShowAuthError(false);
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
         setShowAuthError(true);
         setIsExiting(false);
      }
      finally {
         reset();
      }
   }

   const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(() => {
         setShowAuthError(false);
         setIsExiting(false);
      }, 800);
   };

   useEffect(() => {
      if (showAuthError) {
         const timer = setTimeout(() => {
            handleDismiss();
         }, 5000);

         return () => clearTimeout(timer);
      }
   }, [showAuthError]);

   // Principal loading screen
   if (isLoading || startLoginProcess.isPending) {
      return (
         <ContentLoaded />
      )
   }

   return (
      <Fragment>
         <div className="h-dvh flex items-center justify-center">
            <FormLayout imageUrl={urlImage}>
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
                        required: "La contraseña es requerida",
                        minLength: {
                           value: 6,
                           message: "La contraseña debe tener al menos 6 caracteres"
                        }
                     })
                     }
                     error={errors.password && errors.password.message}
                  />

                  <div className="w-full flex flex-col mt-5">
                     <Button
                        disabled={!isDirty || !isValid}
                        label="Iniciar sesión"
                        isLoading={startLoginProcess.isPending}
                        size="giant"
                     />
                  </div>

                  {
                     showAuthError && (
                        <div className={`w-full flex flex-col mt-5 animate-fade-alert ${isExiting ? "hide" : ""}`}>
                           <Alert
                              title="Error"
                              message="Usuario o contraseña incorrectos"
                              type="error"
                              showCloseButton
                              onClose={handleDismiss}
                           />
                        </div>
                     )
                  }

               </form>
            </FormLayout>
         </div>
      </Fragment>
   )
}