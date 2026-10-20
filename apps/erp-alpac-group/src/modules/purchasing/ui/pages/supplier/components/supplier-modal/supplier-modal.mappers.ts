import { ConstitutionEnum } from "@app/core/enums/constitution.enum";
import { IdentificationEnum } from "@app/core/enums/identification.enum";
import { type PaymentMethodType } from "@app/core/enums/payment-method.enum";
import { SupplierExclusiveStatusEnum } from "@app/core/enums/supplier-exclusive-status.enum";
import { SupplierTypeEnum } from "@app/core/enums/supplier-type.enum";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";

export const constitutionStringOptions = Object.values(ConstitutionEnum)
  .map((item) => ({ value: item.stringValue, label: item.label }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const identificationStringOptions = Object.values(IdentificationEnum)
  .map((item) => ({ value: item.stringValue, label: item.label }))
  .sort((a, b) => a.label.localeCompare(b.label));

const constitutionByNumericValue = new Map<number, string>(
  Object.values(ConstitutionEnum).map((item) => [item.value, item.stringValue]),
);

const identificationByNumericValue = new Map<number, string>(
  Object.values(IdentificationEnum).map((item) => [item.value, item.stringValue]),
);

const identificationNumericByString = new Map<string, number>(
  Object.values(IdentificationEnum).map((item) => [item.stringValue, item.value]),
);

export const resolveConstitutionType = (
  value?: string | number | null,
): string => {
  if (value == null || value === "") return "";
  if (typeof value === "number") {
    return constitutionByNumericValue.get(value) ?? "";
  }
  const asString = String(value);
  if (
    asString === ConstitutionEnum.Legal.stringValue ||
    asString === ConstitutionEnum.Natural.stringValue
  ) {
    return asString;
  }
  const asNumber = Number(asString);
  if (!Number.isNaN(asNumber)) {
    return constitutionByNumericValue.get(asNumber) ?? "";
  }
  return "";
};

export const getIdentificationTypeByConstitution = (
  constitutionType?: string,
): string => {
  if (constitutionType === ConstitutionEnum.Legal.stringValue) {
    return IdentificationEnum.RUC.stringValue;
  }
  if (constitutionType === ConstitutionEnum.Natural.stringValue) {
    return IdentificationEnum.NATIONAL_ID.stringValue;
  }
  return "";
};

export const resolveIdentificationType = (
  identificationType?: string | number | null,
  constitutionType?: string | number | null,
): string => {
  const resolvedConstitution = resolveConstitutionType(constitutionType);

  if (typeof identificationType === "number") {
    return (
      identificationByNumericValue.get(identificationType) ??
      getIdentificationTypeByConstitution(resolvedConstitution)
    );
  }

  if (
    resolvedConstitution === ConstitutionEnum.Legal.stringValue &&
    identificationType === IdentificationEnum.NATIONAL_ID.stringValue
  ) {
    return IdentificationEnum.RUC.stringValue;
  }

  if (identificationType) {
    const asString = String(identificationType);
    if (identificationNumericByString.has(asString)) return asString;
    const asNumber = Number(asString);
    if (!Number.isNaN(asNumber)) {
      const mapped = identificationByNumericValue.get(asNumber);
      if (mapped) return mapped;
    }
  }

  return getIdentificationTypeByConstitution(resolvedConstitution);
};

export const hasConstitutionData = (constitutionType?: string | null) =>
  constitutionType === ConstitutionEnum.Natural.stringValue ||
  constitutionType === ConstitutionEnum.Legal.stringValue;

export const toIdentificationNumericValue = (
  identificationType?: string | null,
): number =>
  identificationNumericByString.get(String(identificationType ?? "")) ??
  IdentificationEnum.NATIONAL_ID.value;

export const mapSupplierPaymentMethods = (
  methods?: { payment_method_type?: PaymentMethodType; is_active?: boolean }[],
): PaymentMethodType[] => {
  if (!methods?.length) return ["ACH"];
  const active = methods
    .filter((method) => method.is_active !== false && method.payment_method_type)
    .map((method) => method.payment_method_type as PaymentMethodType);
  return active.length > 0 ? active : ["ACH"];
};

export const emptyFormValues: Partial<CreateSupplierRequest> = {
  suppliers_legal_name: "",
  commercial_name: "",
  constitution_type: "",
  identification_type: undefined,
  identification_number: "",
  supplier_type: SupplierTypeEnum.Ordinary.stringValue,
  payment_methods: ["ACH"],
  supplier_details: {
    credit_days: 0,
    has_credit: false,
    exclusive_status: SupplierExclusiveStatusEnum.None.stringValue,
    exclusive_brands_or_parts: "",
    supplier_type: SupplierTypeEnum.Ordinary.stringValue,
    currency: "NIO",
    credit_limit: null,
    credit_currency: "USD",
    alert_days_before_due: 5,
    apply_ir_retention: false,
    apply_municipal_retention: false,
    is_tax_exempt: false,
    preferred_payment_method: "ACH",
    contact_name: "",
    contact_phone_number: "",
    contact_email: "",
    email_support: "",
    address: "",
  },
  bank_accounts: [],
  products: [],
};
