import { Fragment, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Descomentar si usas react-router para redirigir
import { DashBoardCard, Modal } from "@alpac/design-system";
import { useModules } from "../../hooks/useModules";
import { HeaderHome } from "./hearder/header";

import { useAuth } from "@app/modules/auth/ui/hooks/useAuth";
import { Loader } from "@app/shared/components/loaders/loader";
import { Navbar } from "@app/shared/components/navbar/navbar";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { EmptyModulesState } from "./empty-modules-state/empty-modules-state";
import { useNavigate } from "react-router-dom";

export const HomePage = function () {
  const navigate = useNavigate();
  const [isLogout, setLogout] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: "",
  });

  const company_id = CookieStorageAdapter.getCompanyAlias() ?? "";
  const { startProcessToCloseSession } = useAuth();

  const { obtainActiveModulesByCompanyId, verifyAccessMutation } = useModules(
    parseInt(company_id),
  );
  const { data: modulesAvailables } = obtainActiveModulesByCompanyId;

  const handleLogout = async function () {
    try {
      setLogout(true);
      const companyId = CookieStorageAdapter.getCompanyAlias() ?? "";
      const refreshToken = CookieStorageAdapter.getRefreshToken() ?? "";

      await startProcessToCloseSession.mutateAsync({
        company_id: parseInt(companyId),
        refresh_token: refreshToken,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLogout(false);
    }
  };

  const handleCardClick = async (moduleCode: string) => {
    setIsValidating(true);

    try {
      const minimumDelay = new Promise((resolve) => setTimeout(resolve, 1500));

      const requestPromise = verifyAccessMutation.mutateAsync(moduleCode);

      const [response] = await Promise.all([requestPromise, minimumDelay]);
      if (response.has_Access) {
        console.log(response.has_Access);
        //navigate(`/modulo/${moduleCode}`);
        navigate("dashboard");
      } else {
        console.log(response.has_Access);
        console.log(response.message);
        console.log(
          `Acceso concedido al módulo ${moduleCode}. Redirigiendo...`,
        );
        setModalState({
          isOpen: true,
          message: response.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      setModalState({
        isOpen: true,
        message:
          error?.response?.data?.Error?.Description ||
          "Ocurrió un error al intentar validar el acceso al módulo.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Quitar esto obtenerlo de zustand store
  const userName = "Andrés";
  const companyName = "Alpac Group Nicaragua";

  const getLoaderTitle = () => {
    if (isLogout) return "Cerrando Sesión...";
    if (isValidating) return "Validando datos...";
    return "Cargando Módulos...";
  };

  return (
    <Fragment>
      {(obtainActiveModulesByCompanyId.isLoading ||
        startProcessToCloseSession.isPending ||
        isValidating) && <Loader title={getLoaderTitle()} />}

      <Navbar
        onLogout={handleLogout}
        user_name={userName}
        email="example@gmail.com"
      />

      <HeaderHome company_name={companyName} username={userName} />

      <div className="max-w-330 m-auto mt-2 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        {(modulesAvailables || []).length === 0 ? (
          <EmptyModulesState />
        ) : (
          (modulesAvailables || []).map((module) => (
            <DashBoardCard
              key={module.module_code || module.module_name} // Ideal usar un identificador único
              title={module.module_name}
              image="https://"
              onClick={() => handleCardClick(module.module_code)}
              description={module.description}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={modalState.isOpen}
        title="Acceso Denegado"
        variant="warning"
        description={modalState.message}
        onClose={() => {
          setModalState({ isOpen: false, message: "" });
        }}
      />
    </Fragment>
  );
};
