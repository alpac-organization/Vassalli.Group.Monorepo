import {
  AMINSA_COMPANY_NAME,
  ALPAC_COMPANY_NAME,
  AVASA_COMPANY_NAME,
  TMN_COMPANY_NAME,
  VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME,
} from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
import alpacSignature from "@app/assets/signatures/alpac/firmaValeria.jpg";
import avasaSignature from "@app/assets/signatures/avasa-and-aminsa/joseMorales.jpg";
import tmnSignature from "@app/assets/signatures/tmn/endersonLara.jpg";
interface SignatureInfo {
  name: string;
  role?: string;
}
export interface Signatures {
  solicitado: SignatureInfo;
  revisado: SignatureInfo;
  aprobado: SignatureInfo | null;
  signatureImage: string;
}

export function getSignatures(company: string): Signatures {
  switch (company) {
    case AMINSA_COMPANY_NAME:
    case AVASA_COMPANY_NAME:
      return {
        solicitado: { name: "Talento Humano" },
        revisado: { name: "Jose Morales" },
        aprobado: { name: "Maria Loáisiga" },
        signatureImage: avasaSignature,
      };
    case ALPAC_COMPANY_NAME:
      return {
        solicitado: { name: "Aracelly Guillen" },
        revisado: { name: "Valeria López" },
        aprobado: { name: "Isolina Reyes" },
        signatureImage: alpacSignature,
      };
    case TMN_COMPANY_NAME:
      return {
        solicitado: { name: "Talento Humano" },
        revisado: { name: "Enderson Lara" },
        aprobado: null,
        signatureImage: tmnSignature,
      };
    case VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME:
      return {
        solicitado: { name: "Talento Humano" },
        revisado: { name: "Jackson Treminio" },
        aprobado: { name: "Maicol Cruz Morales" },
        signatureImage: "",
      };
    default:
      return {
        solicitado: { name: "Talento Humano" },
        revisado: { name: "Jackson Treminio" },
        aprobado: { name: "Maicol Cruz Morales" },
        signatureImage: "",
      };
  }
}
