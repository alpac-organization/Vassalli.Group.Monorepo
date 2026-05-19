import {
  AMINSA_COMPANY_NAME,
  ALPAC_COMPANY_NAME,
  AVASA_COMPANY_NAME,
  TMN_COMPANY_NAME,
  VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME,
} from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
interface SignatureInfo {
  name: string;
  role?: string;
}

export interface Signatures {
  solicitado: SignatureInfo;
  revisado: SignatureInfo;
  aprobado: SignatureInfo | null;
}

export function getSignatures(company: string): Signatures {
  switch (company) {
    case AMINSA_COMPANY_NAME:
    case AVASA_COMPANY_NAME:
      return {
        solicitado: { name: "Talento Humano" },
        revisado: { name: "Jose Morales" },
        aprobado: { name: "Maria Loáisiga" },
      };
    case ALPAC_COMPANY_NAME:
      return {
        solicitado: { name: "Aracelly Guillen" },
        revisado: { name: "Valeria López" },
        aprobado: { name: "Isolina Reyes" },
      };
    case TMN_COMPANY_NAME:
      return {
        solicitado: { name: "Talento Humano" },
        revisado: { name: "Enderson Lara" },
        aprobado: null,
      };
    case VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME:
      return {
        solicitado: { name: "Talento Humano" },
        revisado: { name: "Jackson Treminio" },
        aprobado: { name: "Maicol Cruz Morales" },
      };
    default:
      return {
        solicitado: { name: "Talento Humano" },
        revisado: { name: "Jackson Treminio" },
        aprobado: { name: "Maicol Cruz Morales" },
      };
  }
}
