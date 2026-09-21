import { Modal } from "@alpac/design-system";
import type { SupplierDetailsModalProps } from "./supplier-details-modal.types";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import {
   BadgePercentIcon,
   CreditCardIcon,
   HeadsetIcon,
   MailIcon,
   MapPinHouseIcon,
   PhoneIcon,
   ShieldCheckIcon,
   UserIcon,
} from "lucide-react";
import { Loader } from "@app/shared/components/loaders/loader";
import { BankAccountList } from "../bank-account-list/bank-account-list";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { PaymentMethodEnum } from "@app/core/enums/payment-method.enum";

const sectionTitleClassName =
   "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

const resolvePaymentMethodLabel = (method?: string | number | null) => {
   if (!method) return "—";
   const found = Object.values(PaymentMethodEnum).find(
      (m) => m.stringValue === method || m.value === Number(method),
   );
   return found ? found.label : String(method);
};

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
      isFetching: isSupplierDetailsFetching,
   } = GetSupplierDetails;
   const details = supplierDetails?.supplier_details;

   const isLoading = isSupplierDetailsPending || isSupplierDetailsFetching;

   const paymentModality = details?.has_credit
      ? `Crédito (${details.credit_days ?? 0} días)`
      : "Contado";

   const creditCurrency = details?.credit_currency === "NIO"
      ? "NIO"
      : "USD";

   const creditLimitFormatted = details?.credit_limit != null
      ? formatCurrency(details.credit_limit, creditCurrency) : "Sin límite fijado";


   const supplierName =
      supplierDetails?.suppliers_legal_name ??
      selectedSupplier?.suppliers_legal_name ??
      "proveedor";

   return (
      <>
         {isOpen && isLoading && (
            <Loader title="Cargando detalle del proveedor..." />
         )}

         <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalle del proveedor"
            variant="form"
            size="6xl"
            description={`Información registrada de ${supplierName}`}
         >
            <div className="flex flex-col gap-6">
               <div className="grid gap-6 lg:grid-cols-3">
                  {/* Legal information */}
                  <section className="flex flex-col gap-3 lg:col-span-2">
                     <h5 className={sectionTitleClassName}>Información Legal</h5>
                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailField
                           label="Razón social"
                           value={supplierName}
                        />
                        <DetailField
                           label="Nombre comercial"
                           value={supplierDetails?.commercial_name || "—"}
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

                  {/* Financial conditions */}
                  <section className="flex flex-col gap-3">
                     <h5 className={sectionTitleClassName}>Condiciones Comerciales</h5>
                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <DetailField
                           label="Modalidad de pago"
                           value={supplierDetails ? paymentModality : undefined}
                           icon={<CreditCardIcon size={16} />}
                        />
                        <DetailField
                           label="Límite de crédito"
                           value={details?.has_credit ? creditLimitFormatted : "No aplica"}
                        />
                        <DetailField
                           label="Alerta vencimiento"
                           value={details?.has_credit ? `${details?.alert_days_before_due ?? 0} días antes` : "No aplica"}
                        />
                        <DetailField
                           label="Método de pago preferido"
                           value={resolvePaymentMethodLabel(details?.preferred_payment_method)}
                        />
                     </div>
                  </section>

                  {/* Taxes and Exclusivity */}
                  <section className="flex flex-col gap-3 lg:col-span-3">
                     <h5 className={sectionTitleClassName}>Régimen Fiscal y Exclusividad</h5>
                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <DetailField
                           label="Retención IR"
                           value={details?.apply_ir_retention ? "Aplica retención" : "No aplica"}
                           icon={<BadgePercentIcon size={16} />}
                        />
                        <DetailField
                           label="Retención Municipal"
                           value={details?.apply_municipal_retention ? "Aplica retención" : "No aplica"}
                           icon={<BadgePercentIcon size={16} />}
                        />
                        <DetailField
                           label="Exento de Impuestos"
                           value={details?.is_tax_exempt ? "Sí (Exento)" : "No"}
                        />
                        <DetailField
                           label="Proveedor Exclusivo"
                           value={details?.is_exclusive ? "Sí" : "No"}
                           icon={<ShieldCheckIcon size={16} />}
                        />
                        {details?.is_exclusive && details.exclusive_brands_or_parts && (
                           <DetailField
                              label="Marcas o partes autorizadas"
                              value={details.exclusive_brands_or_parts}
                              containerClass="sm:col-span-2 lg:col-span-4"
                           />
                        )}
                     </div>
                  </section>

                  {/* Contact info */}
                  <section className="flex flex-col gap-3 lg:col-span-3">
                     <h5 className={sectionTitleClassName}>Información de Contacto</h5>
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

                  {/* Bank Accounts */}
                  <section className="flex flex-col gap-3 lg:col-span-3">
                     <h5 className={sectionTitleClassName}>Cuentas Bancarias Registradas</h5>
                     <BankAccountList
                        accounts={supplierDetails?.bank_accounts ?? []}
                        readOnly={true}
                        onAddAccount={() => {}}
                        onDeleteAccount={() => {}}
                     />
                  </section>
               </div>
            </div>
         </Modal>
      </>
   );
};
