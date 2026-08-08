import { SectionHeader, useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import type { QuotesPageHeaderProps } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-page-header/quotes-page-header.types";

export function QuotesPageHeader({
  title = "Cotizaciones",
  subtitle = "Historial de cotizaciones realizadas a proveedores",
}: QuotesPageHeaderProps) {
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  return (
    <SectionHeader title={title} subtitle={subtitle} logoImage={activeLogo} />
  );
}
