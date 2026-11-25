import { Image, Text, View } from "@react-pdf/renderer";

import { equipmentReportBaseStyles as styles } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.styles";
import { formatDate, formatGeneratedAt } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.utils";

export type EquipmentReportPdfHeaderProps = {
   title: string;
   report: {
      generated_at: string;
      generated_by: string | null;
      from: string;
      to: string;
   };
   logoUrl?: string | null;
};

export function EquipmentReportPdfHeader({ title, report, logoUrl }: EquipmentReportPdfHeaderProps) {
   return (
      <View style={styles.header} wrap={false}>
         <View style={styles.headerLeft}>
            {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
         </View>
         <View style={styles.headerCenter}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>Generado: {formatGeneratedAt(report.generated_at)}</Text>
            <Text style={styles.subtitle}>Generado por: {report.generated_by || "—"}</Text>
            <Text style={styles.subtitle}>
               Periodo: {formatDate(report.from)} - {formatDate(report.to)}
            </Text>
         </View>
         <View style={styles.spacer} />
      </View>
   );
}
