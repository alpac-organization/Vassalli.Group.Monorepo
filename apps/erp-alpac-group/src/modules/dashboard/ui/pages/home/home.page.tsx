import { useState } from 'react';
import { DashBoardCard, Modal } from '@alpac/design-system';
import { useModules } from '@app/modules/dashboard/ui/hooks/useModules';
import { HeaderHome } from '@app/modules/dashboard/ui/pages/home/hearder/header';

import { useAuth } from '@app/modules/auth/ui/hooks/useAuth';
import { Loader } from '@app/shared/components/loaders/loader';
import { Navbar } from '@app/shared/components/navbar/navbar';
import { CookieStorageAdapter } from '@app/core/adapters/cookie-storage-adapter';
import { EmptyModulesState } from './empty-modules-state/empty-modules-state';
import { useUserStore } from '@app/shared/stores/useUserStore';
import { validateNameAndLastName } from '@app/shared/utils/string.utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { m, LazyMotion } from 'framer-motion';
import { ModuleEnum } from '@app/core/enums/module.enum';
import { useCompanyStore } from '@app/shared/stores/useCompanyStore';
import { useTheme } from '@alpac/design-system';
import { NotificationSidebar } from '@app/shared/components/notification/notification-sidebar/notification-sidebar';
import { SettingIndex } from '@app/modules/setting/ui/pages/setting-index/setting-index';

const loadFeatures = () => import('framer-motion').then((res) => res.domAnimation);

export const HomePage = function () {
   const navigate = useNavigate();
   const { theme } = useTheme();
   const { pathname } = useLocation();

   const [isLogout, setLogout] = useState(false);
   const [showModal, setShowModal] = useState(false);

   const { userName, fullName, email, companyId, companyName } = useUserStore();

   const { startProcessToCloseSession } = useAuth();
   const { obtainActiveModulesByCompanyId } = useModules(companyId);
   const { data: modulesAvailables } = obtainActiveModulesByCompanyId;
   const { urlImage, neutralUrlImage } = useCompanyStore();

   const firstName = fullName ? fullName.split(' ')[0] : userName;

   const validatedEmail = email ? email : userName;
   const validatedName = validateNameAndLastName(fullName);

   const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;
   const isSettingPage = pathname.endsWith('/setting');

   const handleLogout = async function () {
      try {
         setLogout(true);

         const companyId = useUserStore.getState().companyId ?? '';
         const refreshToken = CookieStorageAdapter.getRefreshToken() ?? '';

         await startProcessToCloseSession.mutateAsync({
            company_id: companyId,
            refresh_token: refreshToken,
         });
      } catch (error) {
         throw error;
      } finally {
         setLogout(false);
      }
   };

   return (
      <LazyMotion features={loadFeatures} strict>
         <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
         >
            {(obtainActiveModulesByCompanyId.isLoading ||
               startProcessToCloseSession.isPending) && (
                  <Loader
                     title={isLogout ? 'Cerrando Sesión...' : 'Cargando Modulos...'}
                  />
               )}

            <Navbar
               isSettingPage={isSettingPage}
               onLogout={handleLogout}
               user_name={firstName}
               email={validatedEmail}
               urlImage={activeLogo}
            />

            {isSettingPage ? (
               <SettingIndex />
            ) : (
               <>
                  <HeaderHome company_name={companyName} username={validatedName} />
                  <div className="max-w-330 m-auto mt-2 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
                     {(modulesAvailables || []).length === 0 ? (
                        <EmptyModulesState />
                     ) : (
                        (modulesAvailables || []).map((module) => (
                           <DashBoardCard
                              key={module.module_name}
                              title={module.module_name}
                              image={module.image_url}
                              onClick={() => {
                                 useUserStore.setState({
                                    moduleCode: module.module_code,
                                    role: module.role_type,
                                 });

                                 if (!module.module_code) {
                                    setShowModal(true);
                                    return;
                                 }

                                 if (module.module_code === ModuleEnum.WORK_MANAGEMENT) {
                                    navigate(`${module.path_redirect}/collaborator-profile`);
                                 } else {
                                    navigate(module.path_redirect);
                                 }
                              }}
                              description={module.description}
                           />
                        ))
                     )}
                  </div>
               </>
            )}

            <Modal
               isOpen={showModal}
               title="Ha ocurrido un error"
               variant="warning"
               description="No se ha podido cargar el modulo seleccionado."
               onClose={() => {
                  setShowModal(false);
               }}
            />

            <NotificationSidebar />
         </m.div>
      </LazyMotion>
   );
};
