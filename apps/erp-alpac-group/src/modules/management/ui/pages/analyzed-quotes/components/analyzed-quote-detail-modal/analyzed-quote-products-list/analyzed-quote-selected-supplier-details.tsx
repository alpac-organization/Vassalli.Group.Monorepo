import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { resolvePaymentMethodsLabel } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-products-list/analyzed-quote-products-list.utils";

const SupplierDetailField = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="flex min-w-0 flex-col gap-0.5">
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {label}
    </span>
    <span className="wrap-break-words text-sm text-slate-700 dark:text-slate-200">
      {value?.trim() || "—"}
    </span>
  </div>
);

export const AnalyzedQuoteSelectedSupplierDetails = ({
  supplierId,
}: {
  supplierId: string;
}) => {
  const { companyId, moduleCode } = useUserStore();

  const { GetSupplierDetails } = useSupplier({
    supplierDetailFilters: {
      company_id: companyId,
      module_code: moduleCode,
      supplier_id: supplierId,
    },
  });

  const { data: supplierDetails, isFetching } = GetSupplierDetails;
  const details = supplierDetails?.supplier_details;

  if (isFetching && !supplierDetails) {
    return (
      <div className="border-t border-slate-100 bg-slate-50/80 px-3 py-3 text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-slate-400">
        Cargando detalle del proveedor...
      </div>
    );
  }

  if (!supplierDetails || !details) return null;

  const supplierName =
    supplierDetails.supplier_legal_name?.trim() || "Proveedor";
  const paymentModality = details.has_credit
    ? `Crédito (${details.credit_days ?? 0} días)`
    : "Contado";
  const creditCurrency = details.credit_currency === "NIO" ? "NIO" : "USD";
  const creditLimit =
    details.credit_limit != null
      ? formatCurrency(details.credit_limit, creditCurrency)
      : "Sin límite fijado";
  const primaryAccount =
    supplierDetails.bank_accounts?.find((account) => account.is_primary) ??
    supplierDetails.bank_accounts?.[0];

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/80 px-3 py-3 dark:border-neutral-700 dark:bg-neutral-900/40">
      <div className="flex flex-wrap items-center gap-2">
        <p className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Detalle del Proveedor Seleccionado
        </p>
        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
          {supplierName}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SupplierDetailField
          label="Razón Social"
          value={supplierDetails.supplier_legal_name}
        />
        <SupplierDetailField
          label="Nombre comercial"
          value={supplierDetails.commercial_name}
        />
        <SupplierDetailField
          label="Identificación"
          value={
            [
              supplierDetails.identification_type,
              supplierDetails.identification_number,
            ]
              .filter(Boolean)
              .join(" · ") || null
          }
        />
        <SupplierDetailField label="Contacto" value={details.contact_name} />
        <SupplierDetailField
          label="Teléfono"
          value={details.contact_phone_number}
        />
        <SupplierDetailField label="Correo" value={details.contact_email} />
        <SupplierDetailField
          label="Correo de soporte"
          value={details.email_support}
        />
        <SupplierDetailField
          label="Modalidad de pago"
          value={paymentModality}
        />
        <SupplierDetailField
          label="Métodos de pago"
          value={resolvePaymentMethodsLabel(
            supplierDetails.supplier_payment_methods,
          )}
        />
        {details.has_credit ? (
          <SupplierDetailField label="Límite de crédito" value={creditLimit} />
        ) : null}
        <SupplierDetailField label="Dirección" value={details.address} />
        {primaryAccount ? (
          <SupplierDetailField
            label="Cuenta bancaria"
            value={`${primaryAccount.bank_name} · ${primaryAccount.account_number}`}
          />
        ) : null}
      </div>
    </div>
  );
};
