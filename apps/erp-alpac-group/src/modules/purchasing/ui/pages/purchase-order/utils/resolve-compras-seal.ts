import {
  ALPAC_COMPANY_NAME,
  ALPAC_CORINTO_NAME,
} from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-pdf/constants/purchase-request-pdf.constants";
import selloCorinto from "@app/assets/signatures/compras/sellos/corinto/sello-administracion.png";
import selloManagua from "@app/assets/signatures/compras/sellos/managua/sello-administracion.png";

/**
 * Elige el sello de Compras  según el nombre de
 * sucursal o empresa. Se usa en los PDF de orden y de solicitud de pago.
 */
export function resolveComprasSealSrc(
  branchOrCompanyName?: string | null,
): string | null {
  const name = branchOrCompanyName?.trim() ?? "";
  if (!name) return null;

  const normalized = name.toLowerCase();

  if (name === ALPAC_CORINTO_NAME || normalized.includes("corinto")) {
    return selloCorinto;
  }

  if (
    name === ALPAC_COMPANY_NAME ||
    normalized.includes("managua") ||
    normalized.includes("pacífico") ||
    normalized.includes("pacifico")
  ) {
    return selloManagua;
  }

  return null;
}
