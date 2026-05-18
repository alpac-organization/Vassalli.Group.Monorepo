import { useEffect } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { setDocumentFavicon } from "@app/shared/utils/set-document-favicon";
import defaultColorLogo from "@app/assets/logos/color/vasalli-neutral-logo.png";

export const SyncAuthenticatedCompanyDocument = () => {
  const companyName = useUserStore((s) => s.companyName);
  const companyId = useUserStore((s) => s.companyId);
  const urlImage = useCompanyStore((s) => s.urlImage);

  useEffect(() => {
    if (!companyName.trim()) return;

    document.title = companyName;

    const faviconSrc = urlImage.trim() ? urlImage : defaultColorLogo;
    setDocumentFavicon(faviconSrc, companyId.trim() || "session");
  }, [companyName, companyId, urlImage]);

  return null;
};
