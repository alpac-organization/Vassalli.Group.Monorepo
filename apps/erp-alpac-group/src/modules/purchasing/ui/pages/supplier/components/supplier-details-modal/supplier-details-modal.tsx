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
import { BankAccountList } from "@app/modules/purchasing/ui/pages/supplier/components/bank-account-list/bank-account-list";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { PaymentMethodEnum } from "@app/core/enums/payment-method.enum";
import {
  isSupplierExclusive,
  SupplierExclusiveStatusEnum,
} from "@app/core/enums/supplier-exclusive-status.enum";
import { resolveSupplierTypeLabel } from "@app/core/enums/supplier-type.enum";

const sectionTitleClassName =
  "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

const resolvePaymentMethodLabel = (method?: string | number | null) => {
  if (!method) return "—";
  const found = Object.values(PaymentMethodEnum).find(
    (m) => m.stringValue === method || m.value === Number(method),
  );
  return found ? found.label : String(method);
};

const resolvePaymentMethodsLabel = (
  methods?: { payment_method_type?: string; is_active?: boolean }[],
) => {
  const labels = (methods ?? [])
    .filter(
      (method) => method.is_active !== false && method.payment_method_type,
    )
    .map((method) => resolvePaymentMethodLabel(method.payment_method_type));
  return labels.length > 0 ? labels.join(", ") : "—";
};

const resolveExclusiveStatusLabel = (status?: string | null) => {
  const found = Object.values(SupplierExclusiveStatusEnum).find(
    (item) => item.stringValue === status,
  );
  return found?.label ?? status ?? "—";
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

  const creditCurrency = details?.credit_currency === "NIO" ? "NIO" : "USD";

  const creditLimitFormatted =
    details?.credit_limit != null
      ? formatCurrency(details.credit_limit, creditCurrency)
      : "Sin límite fijado";

  const supplierName =
    supplierDetails?.supplier_legal_name ??
    selectedSupplier?.supplier_legal_name ??
    "proveedor";

  const exclusiveStatus =
    details?.exclusive_status ??
    supplierDetails?.exclusive_status ??
    selectedSupplier?.exclusive_status;
  const isExclusive = isSupplierExclusive(exclusiveStatus);
  const exclusiveBrandsOrParts = details?.exclusive_brands_or_parts?.trim();
  const exclusiveStatusComment = details?.exclusive_status_comment?.trim();

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
        size="7xl"
        description={`Información registrada de ${supplierName}`}
      >
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
              <h5 className={sectionTitleClassName}>Información Legal</h5>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DetailField label="Razón social" value={supplierName} />
                <DetailField
                  label="Nombre comercial"
                  value={supplierDetails?.commercial_name || "—"}
                />
                <DetailField
                  label="Tipo de proveedor"
                  value={resolveSupplierTypeLabel(
                    supplierDetails?.supplier_type ??
                      selectedSupplier?.supplier_type,
                  )}
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

            <section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
              <h5 className={sectionTitleClassName}>Condiciones Comerciales</h5>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DetailField
                  label="Modalidad de pago"
                  value={supplierDetails ? paymentModality : undefined}
                  icon={<CreditCardIcon size={16} />}
                />
                <DetailField
                  label="Límite de crédito"
                  value={
                    details?.has_credit ? creditLimitFormatted : "No aplica"
                  }
                />
                <DetailField
                  label="Alerta vencimiento"
                  value={
                    details?.has_credit
                      ? `${details?.alert_days_before_due ?? 0} días antes`
                      : "No aplica"
                  }
                />
                <DetailField
                  label="Métodos de pago"
                  value={resolvePaymentMethodsLabel(
                    supplierDetails?.supplier_payment_methods,
                  )}
                />
              </div>
            </section>

            <section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
              <h5 className={sectionTitleClassName}>
                Régimen Fiscal y Exclusividad
              </h5>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DetailField
                  label="Retención IR"
                  value={
                    details?.apply_ir_retention
                      ? "Aplica retención"
                      : "No aplica"
                  }
                  icon={<BadgePercentIcon size={16} />}
                />
                <DetailField
                  label="Retención Municipal"
                  value={
                    details?.apply_municipal_retention
                      ? "Aplica retención"
                      : "No aplica"
                  }
                  icon={<BadgePercentIcon size={16} />}
                />
                <DetailField
                  label="Exento de Impuestos"
                  value={details?.is_tax_exempt ? "Sí (Exento)" : "No"}
                  icon={<BadgePercentIcon size={16} />}
                />
                <DetailField
                  label="Proveedor Exclusivo"
                  value={isExclusive ? "Sí" : "No"}
                  icon={<ShieldCheckIcon size={16} />}
                />
                <DetailField
                  label="Estado de exclusividad"
                  value={resolveExclusiveStatusLabel(exclusiveStatus)}
                  icon={<ShieldCheckIcon size={16} />}
                />
                {exclusiveStatusComment ? (
                  <DetailField
                    label="Comentario de exclusividad"
                    value={exclusiveStatusComment}
                    containerClass="min-w-0 sm:col-span-2 xl:col-span-3"
                  />
                ) : null}
                {exclusiveBrandsOrParts ? (
                  <DetailField
                    label="Marcas o partes autorizadas"
                    value={exclusiveBrandsOrParts}
                    containerClass="min-w-0 sm:col-span-2 xl:col-span-3"
                  />
                ) : null}
              </div>
            </section>

            <section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
              <h5 className={sectionTitleClassName}>Información de Contacto</h5>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                  containerClass="min-w-0 sm:col-span-2 xl:col-span-3"
                  icon={<MapPinHouseIcon size={18} />}
                />
              </div>
            </section>

            <section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
              <h5 className={sectionTitleClassName}>
                Cuentas Bancarias Registradas
              </h5>
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
