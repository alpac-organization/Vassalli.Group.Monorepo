import {
  AMINSA_COMPANY_NAME,
  ALPAC_COMPANY_NAME,
  AVASA_COMPANY_NAME,
  TMN_COMPANY_NAME,
  VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME,
  ALPAC_CORINTO_NAME,
  BRANCH_SIGNATURE_KEYS,
} from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
import alpacSignature from "@app/assets/signatures/alpac/firmaValeria.jpg";
import avasaSignature from "@app/assets/signatures/avasa-and-aminsa/joseMorales.jpg";
import tmnSignature from "@app/assets/signatures/tmn/endersonLara.jpg";
import talentoHumanoSignature from "@app/assets/signatures/alpac/firmaAracellyGuillen.jpg";
import vigemsaSignature from "@app/assets/signatures/vigemsa/firmaJacksonTreminio.jpg";
import lilibethHerreraSignature from "@app/assets/signatures/alpac/firmaLilibeth.png";
import lucreciaSignature from "@app/assets/signatures/alpac/firmaLucrecia.jpg";
interface SignatureInfo {
  name: string;
  role?: string;
  signatureImage?: string;
}
export interface Signatures {
  solicitado: SignatureInfo;
  revisado: SignatureInfo;
  aprobado: SignatureInfo | null;
  signatureImage: string;
}

export function resolveSignatureKey(
  companyName: string,
  branchName?: string | null,
): string {
  const branch = branchName?.trim();
  if (branch && BRANCH_SIGNATURE_KEYS[branch]) {
    return BRANCH_SIGNATURE_KEYS[branch];
  }
  return companyName;
}

export function getSignaturesForPayroll(
  companyName: string,
  branchName?: string | null,
): Signatures {
  return getSignatures(resolveSignatureKey(companyName, branchName));
}

export function getReviewedSignatureImage(signatures: Signatures): string {
  return signatures.revisado.signatureImage ?? signatures.signatureImage;
}

export function getSignatures(company: string): Signatures {
  switch (company) {
    case AMINSA_COMPANY_NAME:
    case AVASA_COMPANY_NAME:
      return {
        solicitado: {
          name: "Talento Humano",
          signatureImage: talentoHumanoSignature,
        },
        revisado: { name: "Jose Morales" },
        aprobado: { name: "Maria Loáisiga" },
        signatureImage: avasaSignature,
      };
    case ALPAC_COMPANY_NAME:
      return {
        solicitado: {
          name: "Aracelly Guillen",
          signatureImage: talentoHumanoSignature,
        },
        revisado: { name: "Valeria López" },
        aprobado: { name: "Isolina Reyes" },
        signatureImage: alpacSignature,
      };
    case ALPAC_CORINTO_NAME:
      return {
        solicitado: {
          name: "Lilibeth Herrera",
          signatureImage: lilibethHerreraSignature,
        },
        revisado: {
          name: "Lucrecia Varela",
          signatureImage: lucreciaSignature,
        },
        aprobado: { name: "Isolina Reyes" },
        signatureImage: alpacSignature,
      };
    case TMN_COMPANY_NAME:
      return {
        solicitado: {
          name: "Talento Humano",
          signatureImage: talentoHumanoSignature,
        },
        revisado: { name: "Enderson Lara" },
        aprobado: null,
        signatureImage: tmnSignature,
      };
    case VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME:
      return {
        solicitado: {
          name: "Talento Humano",
          signatureImage: talentoHumanoSignature,
        },
        revisado: { name: "Jackson Treminio" },
        aprobado: { name: "Maicol Cruz Morales" },
        signatureImage: vigemsaSignature,
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
