import { useState } from "react";
import { Modal } from "@alpac/design-system";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { AddDeductionForm } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/add-deduction-form/add-deduction-form";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { X } from "lucide-react";

import type { AddDeductionModalProps } from "@app/modules/payroll/ui/pages/collaborator-index/components/deductions/add-deduction-modal/add-deduction-modal.types";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const AddDeductionModal = (props: AddDeductionModalProps): React.ReactNode => {

   const { role, identificationNumber } = useUserStore();

   const [foundCollaborator, setFoundCollaborator] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
   const [isSearching, setIsSearching] = useState(false);

   const isAdministrator = role === RoleEnum.ADMINISTRATOR;

   const handleCancel = () => {
      setFoundCollaborator(null)
      props.onClose?.()
   }

   return (
      <Modal
         isOpen={props.isOpen}
         onClose={handleCancel}
         title="Agregar Deducción"
         variant="form"
         size="4xl"
      >
         <LazyMotion features={loadFeatures}>
            <div className="flex flex-col gap-5">

               {/* ── Sección: Buscar Colaborador ── */}
               {!foundCollaborator &&
                  <CollaboratorSearchForm
                     onSuccess={(collaborator) => {
                        console.log("Collaborator found:", collaborator);
                        setFoundCollaborator(collaborator);
                        setIsSearching(false);
                     }}
                     onError={(errorMessage) => {
                        console.log("Error searching collaborator:", errorMessage);
                        setFoundCollaborator(null);
                        setIsSearching(false);
                     }}
                     onSearchStart={() => {
                        console.log("Searching collaborator...");
                        setFoundCollaborator(null);
                        setIsSearching(true);
                     }}
                     excludeIdentifications={[identificationNumber]}
                  />
               }

               <AnimatePresence>
                  {isAdministrator && foundCollaborator && (
                     <m.div
                        key="subsidy-form"
                        initial={{ opacity: 0, y: 16, height: 0, overflow: 'hidden' }}
                        animate={{ opacity: 1, y: 0, height: 'auto', overflow: 'visible' }}
                        exit={{ opacity: 0, y: 8, height: 0, overflow: 'hidden' }}
                        transition={{
                           height: { duration: 0.3, ease: "easeInOut" },
                           opacity: { duration: 0.45, ease: "easeOut", delay: 0.1 },
                           y: { duration: 0.3, ease: "easeOut", delay: 0.1 },
                        }}
                        className="flex flex-col gap-4 sm:gap-5"
                     >
                        <div className="relative min-w-0 flex flex-row items-center gap-4 w-full">

                           <div className="min-w-0 flex-1">
                              <CollaboratorSummary
                                 fullName={foundCollaborator?.full_name ?? ""}
                                 workPosition={foundCollaborator?.work_position ?? ""}
                                 isFullNameLoading={isSearching}
                                 isWorkPositionLoading={isSearching}
                              />
                           </div>

                           <div className="absolute right-0 top-0 sm:top-auto group flex items-center">
                              <button
                                 type="button"
                                 className={`rounded-full p-1.5 transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-300 dark:text-white dark:hover:text-white dark:hover:bg-white/15`}
                                 onClick={() => {
                                    setFoundCollaborator(null)
                                 }}
                                 aria-label="Quitar Colaborador"
                              >
                                 <X size={20} />
                              </button>

                              <div className="absolute -top-10 right-0 mt-2 px-2 py-1 text-xs text-white bg-slate-800 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                                 Quitar Colaborador
                              </div>
                           </div>
                        </div>

                        <AddDeductionForm
                           collaborator={foundCollaborator}
                           onCancel={handleCancel}
                           onRequestError={props.onRequestError}
                           onRequestSuccess={props.onRequestSuccess}
                        />
                     </m.div>
                  )}
               </AnimatePresence>
            </div>
         </LazyMotion>
      </Modal>
   );
};