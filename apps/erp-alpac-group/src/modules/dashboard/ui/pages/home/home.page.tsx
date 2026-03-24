import { Fragment, useEffect, useState } from "react"
import { DashBoardCard, Modal } from "@alpac/design-system"
import { Navbar } from "@app/shared/components/navbar/navbar"
import { useModules } from "../../hooks/useModules";
import type { ModulesAvailableResponse } from "@app/modules/dashboard/domain/ApiContract/Responses/modules-available.response";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { HeaderHome } from "./hearder/header";
import { EmptyModulesState } from "./empty-modules-state/empty-modules-state";
import { Loader } from "@app/shared/components/loaders/loader";

export const HomePage = function () {

   const [showModal, setShowModal] = useState(false);

   const [modulesAvailables, setModulesAvailables] = useState<ModulesAvailableResponse[]>([]);

   const { ObtainActiveModulesByCompanyId } = useModules();

   const handleModulesAvailables = async function () {
      try {
         const company_id = CookieStorageAdapter.getCompanyAlias();
         const modules = await ObtainActiveModulesByCompanyId.mutateAsync(Number(company_id))

         setModulesAvailables(modules);
      }
      catch (error) {
         console.log(error)
      }
   }

   const userName = "Andrés";
   const companyName = "Alpac Group Nicaragua";

   useEffect(() => {
      handleModulesAvailables();
   }, []);

   return (
      <Fragment>

         {
            ObtainActiveModulesByCompanyId.isPending && (
               <Loader />
            )
         }

         <Navbar />

         <HeaderHome
            company_name={companyName}
            username={userName}
         />

         <div className="max-w-330 m-auto mt-2 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            {
               modulesAvailables.length === 0 ? <EmptyModulesState />
                  : modulesAvailables.map(module => (
                     <DashBoardCard
                        key={module.module_name}
                        title={module.module_name}
                        image="https://"
                        onClick={() => setShowModal(true)}
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