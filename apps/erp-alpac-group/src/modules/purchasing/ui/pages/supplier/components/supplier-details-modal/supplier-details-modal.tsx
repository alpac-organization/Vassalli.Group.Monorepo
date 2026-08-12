import { Modal } from "@alpac/design-system";
import type { SupplierDetailsModalProps } from "./supplier-details-modal.types";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import {
   HeadsetIcon,
   MailIcon,
   MapPinHouseIcon,
   PhoneIcon,
   UserIcon,
} from "lucide-react";
import { Loader } from "@app/shared/components/loaders/loader";

const sectionTitleClassName =
   "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const SupplierDetailsModal = ({
   isOpen,
   onClose,
   selectedSupplier,
}: SupplierDetailsModalProps) => {
   const { companyId, moduleCode } = useUserStore();

   const { GetSupplierDetails } = useSupplier({
      supplierDetailFilters:
         isOpen && selectedSupplier?.supplier_id
            ? {
               company_id: companyId,
               module_code: moduleCode,
               supplier_id: selectedSupplier.supplier_id,
            }
            : undefined,
   });

   const {
      data: supplierDetails,
      isPending: isSupplierDetailsPending,
      isFetching: isSupplierDetailsFetching
   } = GetSupplierDetails;
   const details = supplierDetails?.supplier_details;

   const isLoading = isSupplierDetailsPending || isSupplierDetailsFetching;

   const paymentModality = details?.has_credit
      ? `Crédito (${details.credit_days ?? 0} días)`
      : "Contado";

   const handleClose = () => {
      onClose();
   };

   return (
      <>
         {isOpen && isLoading && (
            <Loader title="Cargando detalle de la solicitud..." />
         )}

         <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Detalle del proveedor"
            variant="form"
            size="6xl"
            description={`Información registrada de ${selectedSupplier?.supplier_legal_name ?? " proveedor"}`}
         >
            <div className="grid gap-8 lg:grid-cols-3">
               <section className="flex flex-col gap-3 lg:col-span-2">
                  <h5 className={sectionTitleClassName}>
                     Información Legal
                  </h5>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                     <DetailField
                        label="Razón social"
                        value={supplierDetails?.supplier_legal_name}
                     />
                     <DetailField
                        label="Número de identificación"
                        value={supplierDetails?.identification_number}
                     />
                     <DetailField
                        label="Tipo de identificación"
                        value={supplierDetails?.identification_type}
                     />
                     <DetailField
                        label="Tipo de constitución"
                        value={supplierDetails?.constitution_type}
                     />
                  </div>
               </section>

               <section className="flex flex-col gap-3">
                  <h5 className={sectionTitleClassName}>
                     Condiciones comerciales
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                     <DetailField
                        label="Modalidad de pago"
                        value={supplierDetails ? paymentModality : undefined}
                     />
                  </div>
               </section>

               <section className="flex flex-col gap-3 lg:col-span-3">
                  <h5 className={sectionTitleClassName}>
                     Información de contacto
                  </h5>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                     <DetailField
                        label="Nombre de contacto"
                        value={details?.contact_name}
                        icon={<UserIcon size={18} />}
                     />
                     <DetailField
                        label="Teléfono"
                        value={details?.contact_phone_number}
                        icon={<PhoneIcon size={18} />}
                     />
                     <DetailField
                        label="Correo de contacto"
                        value={details?.contact_email}
                        icon={<MailIcon size={18} />}
                     />
                     <DetailField
                        label="Correo de soporte"
                        value={details?.email_support}
                        icon={<HeadsetIcon size={18} />}
                     />
                     <DetailField
                        label="Dirección"
                        value={details?.address}
                        containerClass="lg:col-span-4"
                        icon={<MapPinHouseIcon size={18} />}
                     />
                  </div>
               </section>
            </div>
         </Modal>
      </>
   );
};
