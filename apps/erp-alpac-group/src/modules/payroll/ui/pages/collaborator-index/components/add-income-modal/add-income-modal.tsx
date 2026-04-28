import { useState } from "react";
import { X } from "lucide-react";
import { Modal, Alert, Button } from "@alpac/design-system";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { NewPermissionCollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { RoleEnum } from "@app/core/enums/role.enum";
import { AddIncomeForm } from "../add-income-form/add-income-form";

import type { AddIncomeModalProps } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-income-modal/add-income-modal.types";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import { AddIncomeTable } from "../add-income-table/add-income-table";

export const AddIncomeModal = (
   props: AddIncomeModalProps
): React.ReactNode => {

   const { role } = useUserStore();

   const [foundCollaborator, setFoundCollaborator] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
   const [isSearching, setIsSearching] = useState(false);
   const [searchError, setSearchError] = useState<string | null>(null);

   const formFieldVariants: Variants = {
      hidden: { opacity: 0, y: 14 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
   };

   const searchErrorVariants: Variants = {
      initial: { opacity: 0, y: 16, height: 0, overflow: 'hidden' },
      animate: { opacity: 1, y: 0, height: 'auto', overflow: 'visible' },
      exit: { opacity: 0, y: 8, height: 0, overflow: 'hidden' },
   };

   const isAdministrator = role === RoleEnum.ADMINISTRATOR

   const handleClose = () => {
      setFoundCollaborator(null);
      setSearchError(null);
      props.onClose();
   };

   return (
      <Modal
         isOpen={props.isOpen}
         onClose={handleClose}
         title="Agregar Ingreso"
         variant="form"
         size="5xl"
         description="Complete la información del ingreso"
      >
         <div className="flex flex-col gap-5">
            {foundCollaborator ? (
               <motion.div
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative min-w-0 flex flex-row items-center gap-4 w-full"
               >
                  <div className="min-w-0 flex-1">
                     <NewPermissionCollaboratorSummary
                        fullName={foundCollaborator?.full_name ?? ""}
                        workPosition={foundCollaborator?.work_position ?? ""}
                        isFullNameLoading={isSearching}
                        isWorkPositionLoading={isSearching}
                        title="Colaborador"
                        subtitle="Cargo"
                     />
                  </div>

                  <div className="absolute right-0 group flex items-center">
                     <button
                        type="button"
                        className="rounded-full p-1.5 transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-300 dark:text-white dark:hover:text-white dark:hover:bg-white/15"
                        onClick={() => setFoundCollaborator(null)}
                     >
                        <X size={20} />
                     </button>
                     <div className="absolute right-10 px-2 py-1 text-xs text-white bg-slate-800 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                        Quitar colaborador
                     </div>
                  </div>
               </motion.div>
            ) : (
               <motion.div
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
               >
                  <CollaboratorSearchForm
                     label="Buscar colaborador"
                     onSuccess={(collaborator) => {
                        setFoundCollaborator(collaborator);
                        setIsSearching(false);
                     }}
                     onError={(error) => {
                        setSearchError(error);
                        setIsSearching(false);
                        setFoundCollaborator(null);
                     }}
                     onSearchStart={() => {
                        setSearchError(null);
                        setIsSearching(true);
                     }}
                  />
               </motion.div>
            )}

            <AnimatePresence>
               {searchError && (
                  <motion.div
                     key="search-error"
                     variants={searchErrorVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     transition={{ duration: 0.3 }}
                     onAnimationComplete={(definition) => {
                        if (definition === "animate") {
                           setTimeout(() => setSearchError(null), 5000);
                        }
                     }}
                  >
                     <Alert
                        type="error"
                        title="Error"
                        message={searchError}
                     />
                  </motion.div>
               )}
            </AnimatePresence>

            <AnimatePresence>
               {((isAdministrator) && !!foundCollaborator) && (
                  <motion.div
                     key="collaborator-result"
                     initial={{ opacity: 0, y: 16, height: 0, overflow: 'hidden' }}
                     animate={{ opacity: 1, y: 0, height: 'auto', overflow: 'visible' }}
                     exit={{ opacity: 0, y: 8, height: 0, overflow: 'hidden' }}
                     transition={{
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.45, ease: "easeOut", delay: 0.1 },
                        y: { duration: 0.3, ease: "easeOut", delay: 0.1 },
                     }}
                     className="flex flex-col gap-4 sm:gap-5">

                     <AddIncomeForm />

                     {/* <AddIncomeTable /> */}

                  </motion.div>
               )}
            </AnimatePresence>

            <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6"></div>

            <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
               <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  onClick={handleClose}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
               />
               <Button
                  type="submit"
                  size="giant"
                  label={false ? "Enviando..." : "Agregar ingreso"}
                  disabled={false}
                  isLoading={false}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
               />
            </div>

         </div>
      </Modal>
   );
};