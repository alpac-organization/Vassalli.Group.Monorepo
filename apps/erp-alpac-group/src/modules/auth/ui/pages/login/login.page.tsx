import { Fragment, useEffect, useMemo, useState } from "react";
import { FormLayout } from "@app/shared/layouts";
import { Controller, useForm } from "react-hook-form";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { Alert, Button, Dropdown, InputText } from "@alpac/design-system";
import fondoLogin from "@app/assets/login/fondoLogin.webp";
import { ContentLoaded } from "@app/shared/components/content-loaded/content-loaded";
import { useAuth } from "@app/modules/auth/ui/hooks/useAuth";
import { useImage } from "@app/shared/hooks/useImage";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { LoginRequest } from "@app/modules/auth/domain/ApiContract/Requests/login.request";

export const LoginPage = function () {
  const { getMappedError } = useMappedError();
  const { GetCompaniesQuery } = useCompanies();
  const { startLoginProcess } = useAuth();
  const [showAuthError, setShowAuthError] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading } = GetCompaniesQuery;

  const companyOptions = useMemo(() => {
    return data?.map((c) => ({ label: c.alias, value: c.company_id })) || [];
  }, [data]);

  const {
    handleSubmit,
    register,
    setError,
    reset,
    control,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<LoginRequest>({
    mode: "onChange",
    defaultValues: {
      password: "",
      username: "",
      company_id: "",
    },
  });

  const selectedCompanyId = watch("company_id");

  const currentCompany = useMemo(() => {
    return data?.find((c) => c.company_id === selectedCompanyId);
  }, [data, selectedCompanyId]);

  const { urlImage } = useImage(currentCompany?.alias || "alpac");

  const handleLogin = async function (state: LoginRequest) {
    try {
      setShowAuthError(false);
      if (state.company_id === "") {
        setError("company_id", {
          type: "value",
          message: "Debe seleccionar la empresa de origen",
        });
      }
      await startLoginProcess.mutateAsync({
        password: state.password,
        username: state.username,
        company_id: state.company_id,
      });
    } catch (error) {
      const mappedError = getMappedError(error as ApiErrorResponse);
      setShowAuthError(true);
      setIsExiting(false);
      setErrorMessage(mappedError.description);
    } finally {
      reset();
    }
  };

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
    return <ContentLoaded />;
  }

  return (
    <Fragment>
      <div
        className="relative h-dvh w-full flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${fondoLogin})` }}
      >
        <div className="absolute inset-0 bg-black/5 backdrop-brightness-[0.30] backdrop-blur-xs z-0"></div>

        <div className="relative z-10 w-full flex items-center justify-center">
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
                  validate: (val) => val !== "" || "Selección inválida",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Empresas"
                    options={companyOptions}
                    placeholder="Seleccione su empresa"
                    onChange={(value) => {
                      field.onChange(value);
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
                {...register("username", {
                  required: "El usuario o correo es requerido",
                })}
                error={errors.username && errors.username.message}
              />

              <InputText
                label="Contraseña"
                type="password"
                placeholder="Ingrese su contraseña"
                isPassword
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
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

              {showAuthError && (
                <div
                  className={`w-full flex flex-col mt-5 animate-fade-alert ${isExiting ? "hide" : ""}`}
                >
                  <Alert
                    title="Error"
                    message={errorMessage || "Ocurrio un error inesperado"}
                    type="error"
                    onClose={handleDismiss}
                  />
                </div>
              )}
            </form>
          </FormLayout>
        </div>
      </div>
    </Fragment>
  );
};
