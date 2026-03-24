import { Fragment, useState } from "react"
import { DashBoardCard, Modal } from "@alpac/design-system"
import { useModules } from "../../hooks/useModules";
import { HeaderHome } from "./hearder/header";

import { useAuth } from "@app/modules/auth/ui/hooks/useAuth";
import { Loader } from "@app/shared/components/loaders/loader";
import { Navbar } from "@app/shared/components/navbar/navbar"
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { EmptyModulesState } from "./empty-modules-state/empty-modules-state";

export const HomePage = function () {

   const [showModal, setShowModal] = useState(false);
   const [isLogout, setLogout] = useState(false);

   const company_id = CookieStorageAdapter.getCompanyAlias() ?? '';

   const { startProcessToCloseSession } = useAuth();
   const { obtainActiveModulesByCompanyId } = useModules(parseInt(company_id));
   const { data: modulesAvailables } = obtainActiveModulesByCompanyId

   const handleLogout = async function () {
      try {
         //Iniciar proceso para cerrar sesión
         setLogout(true);

         const companyId = CookieStorageAdapter.getCompanyAlias() ?? ""
         const refreshToken = CookieStorageAdapter.getRefreshToken() ?? ""

         await startProcessToCloseSession.mutateAsync({
            company_id: parseInt(companyId),
            refresh_token: refreshToken
         });
      }
      catch (error) {
         console.error(error);
      }
      finally {
         setLogout(false);
      }
   }

   //Quitar esto obtenerlo de zustand store
   const userName = "Andrés";
   const companyName = "Alpac Group Nicaragua";

   useEffect(() => {
      handleModulesAvailables();
   }, []);

   return (
      <Fragment>

         {
            (obtainActiveModulesByCompanyId.isLoading || startProcessToCloseSession.isPending) && (
               <Loader
                  title={isLogout ? "Cerrando Sesión..." : "Cargando Modulos..."}
               />
            )
         }

         <Navbar
            onLogout={handleLogout}
            user_name={userName}
            email="example@gmail.com"
         />

         <HeaderHome
            company_name={companyName}
            username={userName}
         />

         <div className="max-w-330 m-auto mt-2 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            {
               (modulesAvailables || []).length === 0 ? <EmptyModulesState />
                  : (modulesAvailables || []).map(module => (
                     <DashBoardCard
                        key={module.module_name}
                        title={module.module_name}
                        image="https://"
                        onClick={() => setShowModal(true)}
                        description={module.description}
                     />
                  ))
            }
         </div>

         <Modal
            isOpen={showModal}
            title="Ha ocurrido un error"
            variant="warning"
            description="Descripcion"
            onClose={() => {
               setShowModal(false);
            }}

         />

      </Fragment>
   )
}