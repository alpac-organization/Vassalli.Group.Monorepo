import { memo } from "react";
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";

import type { StockDailyReportPdfProps } from "./stock-daily-report.types";
import { stockDailyReportStyles as styles } from "./stock-daily-report.styles";

function getStatusBadgeStyle(status: string | null) {
   switch (status) {
      case "Sin stock":
         return styles.statusBadgeDanger;
      case "Bajo mínimo":
         return styles.statusBadgeWarning;
      case "Sobre máximo":
         return styles.statusBadgeInfo;
      case "Normal":
         return styles.statusBadgeSuccess;
      default:
         return styles.statusBadgeNeutral;
   }
}

function getStatusBadgeTextStyle(status: string | null) {
   switch (status) {
      case "Sin stock":
         return styles.statusBadgeDangerText;
      case "Bajo mínimo":
         return styles.statusBadgeWarningText;
      case "Sobre máximo":
         return styles.statusBadgeInfoText;
      case "Normal":
         return styles.statusBadgeSuccessText;
      default:
         return styles.statusBadgeNeutralText;
   }
}

function StockDailyReportPdfComponent({ report, logoUrl }: StockDailyReportPdfProps) {
   return (
      <Document>
         <Page size="A4" orientation="portrait" style={styles.page} wrap>
            <View style={styles.header} wrap={false}>
               <View style={styles.headerLeft}>
                  {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
               </View>
               <View style={styles.headerCenter}>
                  
                  <Text style={styles.title}>REPORTE DE STOCK DIARIO</Text>
                  <Text style={styles.subtitle}>
                     Generado: {new Date(report.generated_at).toLocaleString()}
                  </Text>
                  <Text style={styles.subtitle}>
                     Generado por: {report.generated_by_user_name || report.generated_by || "—"}
                  </Text>
               </View>
               <View style={{ width: 70 }} />
            </View>

            <View style={styles.divider} />

             <View style={{ marginBottom: 8 }}>
                <Text style={styles.sectionTitle}>Resumen</Text>
                <Text style={styles.subtitle}>
                   Total: {report.total_products} | Sin stock: {report.out_of_stock_count} | Bajo mínimo: {report.below_minimum_count} | Normal: {report.normal_count} | Sobre máximo: {report.over_maximum_count}
                </Text>
             </View>

            {report.branches.length === 0 ? (
               <Text style={styles.empty}>No hay datos para los filtros seleccionados.</Text>
            ) : (
               report.branches.map((branch) => (
                  <View key={branch.branch_id || branch.branch_name || "branch"} wrap={false}>
                     <Text style={styles.branchTitle}>
                        {branch.branch_name || "Sucursal no asignada"}
                     </Text>

                     {branch.areas.map((area) => (
                        <View key={area.area_id || area.area_name || "area"} wrap={false}>
                           <Text style={styles.areaTitle}>
                              <Text style={{ fontWeight: "bold", color: "#111827" }}>Área: </Text>
                               <Text style={{ fontWeight: "normal", color: "#374151" }}>{area.area_name || "Área no asignada"}</Text>
                           </Text>

                           {area.cost_centers.map((costCenter) => (
                              <View key={costCenter.cost_center_id || costCenter.cost_center_name || "cc"} wrap={false}>
                                 <Text style={styles.costCenterTitle}>
                                    <Text style={{ fontWeight: "bold", color: "#111827" }}>Centro de costo: </Text>
                                    <Text style={{ fontWeight: "normal", color: "#374151" }}>{costCenter.cost_center_name || "Centro de costo no asignado"}</Text>
                                 </Text>


                                 {costCenter.usage_types.map((usageType) => (
                                    <View key={usageType.usage_type || "usage"} wrap={false}>
                                       <Text style={styles.usageTypeTitle}>
                                          {usageType.usage_type || "Tipo de uso no asignado"}
                                       </Text>

                                       <View style={styles.table}>
                                          <View style={styles.tableHeader} wrap={false}>
                                             <Text style={[styles.cell, styles.headerCell, styles.colCode]}>Código</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colName]}>Producto</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colDesc]}>Descripción</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colStock]}>Stock</Text>
                                             
                                             <Text style={[styles.cell, styles.headerCell, styles.colMin]}>Mínimo</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colMax]}>Máximo</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colUnit]}>Unidad de medida</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colStatus]}>Estado</Text>
                                          </View>

                                          {usageType.products.map((product, index) => (
                                             <View
                                                key={`${product.product_code}-${index}`}
                                                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                                                wrap={false}
                                             >
                                                <Text style={[styles.cell, styles.colCode]}>
                                                   {product.product_code || "—"}
                                                </Text>
                                                <Text style={[styles.cell, styles.colName]}>
                                                   {product.product_name || "—"}
                                                </Text>
                                                <Text style={[styles.cell, styles.colDesc]}>
                                                   {product.product_description || "—"}
                                                </Text>
                                                <Text style={[styles.cell, styles.colStock]}>
                                                   {product.inventory_stock}
                                                </Text>
                                                <Text style={[styles.cell, styles.colMin]}>
                                                   {product.minimum_stock}
                                                </Text>
                                                <Text style={[styles.cell, styles.colMax]}>
                                                   {product.maximum_stock ?? "—"}
                                                </Text>
                                                <Text style={[styles.cell, styles.colUnit]}>
                                                   {product.unit_measure || "—"}
                                                </Text>
                                                <View style={[styles.cell, styles.colStatus, { alignItems: "center", justifyContent: "center" }]}>
                                                   <View style={[styles.statusBadge, getStatusBadgeStyle(product.stock_status)]}>
                                                      <Text style={[styles.statusBadgeText, getStatusBadgeTextStyle(product.stock_status)]}>
                                                         {product.stock_status || "—"}
                                                      </Text>
                                                   </View>
                                                </View>
                                             </View>
                                          ))}
                                       </View>
                                    </View>
                                 ))}
                                 <Text style={{ textAlign: "right", fontSize: 8, color: "#6b7280", marginTop: 2 }}>
                                    Productos: {costCenter.product_count} · Sin stock: {costCenter.out_of_stock_count} · Bajo mínimo: {costCenter.below_minimum_count} · Normal: {costCenter.normal_count} · Sobre máximo: {costCenter.over_maximum_count}
                                 </Text>
                              </View>
                           ))}
                        </View>
                     ))}
                  </View>
               ))
            )}
         <Text style={styles.footer}>Documento generado para impresión</Text>
         </Page>
      </Document>
   );
}

export const StockDailyReportPdf = memo(StockDailyReportPdfComponent);