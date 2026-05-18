import { Fragment, useEffect, useMemo, useState } from "react";
import { FormLayout } from "@app/shared/layouts";
import { Controller, useForm } from "react-hook-form";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { Alert, Button, Dropdown, InputText } from "@alpac/design-system";
import fondoLogin from "@app/assets/login/fondoLogin.webp";
import { ContentLoaded } from "@app/shared/components/content-loaded/content-loaded";
import { useAuth } from "@app/modules/auth/ui/hooks/useAuth";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { LoginRequest } from "@app/modules/auth/domain/ApiContract/Requests/login.request";
import type { GetCompaniesResponse } from "@app/modules/auth/domain/ApiContract/Responses/get-companies.response";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { setDocumentFavicon } from "@app/shared/utils/set-document-favicon";
import defaultColorLogo from "@app/assets/logos/color/vasalli-neutral-logo.png";
import defaultNeutralLogo from "@app/assets/logos/blanco/vasalli-logo.png";

const DEFAULT_LOGIN_BRANDING = "Grupo Vasalli";

function resolveGrupoVasalliCompanyId(
  companies: GetCompaniesResponse[] | undefined,
): string | null {
  if (!Array.isArray(companies) || companies.length === 0) return null;
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").trim();
  const match = companies.find((c) => {
    const alias = normalize(c.alias);
    const name = normalize(c.company_name);
    const blob = `${alias} ${name}`;
    return blob.includes("vasalli") || blob.includes("vassalli");
  });
  return match?.company_id ?? null;
}

export const LoginPage = function () {
  const { getMappedError } = useMappedError();
  const { GetCompaniesQuery } = useCompanies();
  const { startLoginProcess } = useAuth();
  const [showAuthError, setShowAuthError] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading } = GetCompaniesQuery;

  const companyOptions = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((c: GetCompaniesResponse) => ({
      label: c.alias,
      value: c.company_id,
      image: c.image_url ?? "",
    }));
  }, [data]);

  const {
    handleSubmit,
    register,
    setError,
    reset,
    setValue,
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

  const defaultCompanyId = useMemo(
    () => resolveGrupoVasalliCompanyId(Array.isArray(data) ? data : undefined),
    [data],
  );

  useEffect(() => {
    if (!defaultCompanyId) return;
    setValue("company_id", defaultCompanyId, {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [defaultCompanyId, setValue]);

  const brandingName = useMemo(() => {
    if (!Array.isArray(data) || !selectedCompanyId) {
      return DEFAULT_LOGIN_BRANDING;
    }
    const company = data.find((c) => c.company_id === selectedCompanyId);

    return company?.company_name || company?.alias || DEFAULT_LOGIN_BRANDING;
  }, [data, selectedCompanyId]);

  useEffect(() => {
    document.title = brandingName;
  }, [brandingName]);

  const companyLogos = useMemo(() => {
    if (!Array.isArray(data) || !selectedCompanyId) {
      return { color: defaultColorLogo, neutral: defaultNeutralLogo };
    }
    const company = data.find((c) => c.company_id === selectedCompanyId);
    if (!company) {
      return { color: defaultColorLogo, neutral: defaultNeutralLogo };
    }

    const colorLogo = company.image_url ?? defaultColorLogo;
    const neutralLogo =
      company.neutral_image_url ?? company.image_url ?? defaultNeutralLogo;

    useCompanyStore.setState({
      urlImage: colorLogo,
      neutralUrlImage: neutralLogo,
    });

    return { color: colorLogo, neutral: neutralLogo };
  }, [data, selectedCompanyId]);

  useEffect(() => {
    setDocumentFavicon(companyLogos.color, selectedCompanyId || "default");
  }, [companyLogos.color, selectedCompanyId]);

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
      reset({
        password: "",
        username: "",
        company_id: defaultCompanyId ?? "",
      });
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

  if (isLoading || startLoginProcess.isPending) {
    return <ContentLoaded imageUrl={companyLogos.neutral} />;
  }

  return (
    <Fragment>
      <div
        className="relative h-dvh w-full flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${fondoLogin})` }}
      >
        <div className="absolute inset-0 bg-black/5 backdrop-brightness-[0.30] backdrop-blur-xs z-0"></div>

        <div className="relative z-10 w-full flex items-center justify-center">
          <FormLayout
            imageUrl={companyLogos.color}
            copyrightEntityName={brandingName}
          >
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
