export const PAYROLL_SELECTION_STORAGE_KEY = "payroll:selection";
export const DROPDOWN_DISABLED_TRIGGER_CLASS =
  "pointer-events-none! opacity-50! saturate-75! cursor-not-allowed!";

export const VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME =
  "Vigilancia Empresarial S.A";
export const ALPAC_COMPANY_NAME = "Almacenadora del Pacífico, S.A";
export const ALPAC_CORINTO_NAME = "Almacenadora del Pacífico Corinto";

/** Sucursales con firmas distintas a las de la empresa (login). */
export const BRANCH_SIGNATURE_KEYS: Record<string, string> = {
  [ALPAC_CORINTO_NAME]: ALPAC_CORINTO_NAME,
};
export const AMINSA_COMPANY_NAME = "Agencia marítima internacional, S.A.";
export const AVASA_COMPANY_NAME = "Agencias VASSALI, S.A";
export const TMN_COMPANY_NAME = "Transporte Multimodal de Nicaragua, S.A.";
export const TMN_TRANSPORT_NAME =
  "Transportes Multimodales de Nicaragua Transportistas";

export const payrollTypeOptions = [
  { label: "Ordinaria", value: "Ordinary" },
  // { label: "Variable", value: "Provided" },
  //  { label: "Prestacionado", value: "Prestacionado" },
];
