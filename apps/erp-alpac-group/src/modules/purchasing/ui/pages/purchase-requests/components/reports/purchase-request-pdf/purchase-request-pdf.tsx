import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { purchaseRequestPdfStyle } from "./purchase-request-pdf.styles";

import type { GetPurchaseRequestDetailResponse, PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatDate } from "@app/shared/utils/string.utils";

export interface RequisitionDocumentProps {
   data: GetPurchaseRequestDetailResponse & {
      products: PurchaseRequestProductInformation[]
   };
}

export function PurchaseRequestPDF({ data }: RequisitionDocumentProps) {

   const { urlImage } = useCompanyStore();
   const { companyAlias } = useUserStore();

   const styles = purchaseRequestPdfStyle;

   return (
      <Document>
         <Page size="LETTER" style={styles.page}>
            <View style={styles.headerRow}>
               <View style={styles.headerLeft}>
                  {urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
                  <Text style={styles.requisitionNumber}>{data?.code}</Text>
               </View>
               <View style={styles.headerCenter}>
                  <Text style={styles.companyName}>{companyAlias}</Text>
                  <Text style={styles.documentTitle}>REQUISICION DE COMPRAS</Text>
               </View>
            </View>

            <View style={styles.table}>
               <View style={styles.tableRow}>
                  <Text style={[styles.cell, styles.colQty, styles.headerText]}>CANTIDAD</Text>
                  <Text style={[styles.cell, styles.colDesc, styles.headerText]}>
                     DESCRIPCION DEL ARTICULO
                  </Text>
                  <Text style={[styles.cell, styles.colJust, styles.headerText, styles.cellLast]}>
                     JUSTIFICACION
                  </Text>
               </View>

               {data.products.map((item, index) => {

                  const isLast = index === data?.products?.length - 1;

                  return (
                     <View
                        key={`${item.description}-${index}`}
                        style={[styles.tableRow, isLast ? styles.tableRowLast : {}]}
                     >
                        <Text style={[styles.cell, styles.colQty, styles.center]}>
                           {item.quantity}
                        </Text>
                        <Text style={[styles.cell, styles.colDesc]}>{item.description}</Text>
                        <Text style={[styles.cell, styles.colJust, styles.cellLast]}>
                           {item.justification}
                        </Text>
                     </View>
                  );
               })}
            </View>

            <View style={styles.metaSection}>
               <View style={styles.metaLeft}>
                  <Text style={styles.metaLine}>
                     Solicitante del Area: {data?.creator_user_information?.fullname ?? ""}
                  </Text>
                  <View style={styles.authLine} />
                  <Text style={styles.metaLine}>Solicitado: {formatDate(data?.request_date ?? "")}</Text>
                  <View style={styles.authLine} />
                  <Text style={styles.metaLine}>Modificado: {formatDate(data?.request_date ?? "")}</Text>
                  <View style={styles.authLine} />
               </View>
               <View style={styles.metaRight}>
                  <Text style={styles.authLabel}>
                     Autorización: {data?.reviewer_user_information?.fullname ?? ""}
                  </Text>
                  <View style={styles.authLine} />
               </View>
            </View>

            <View style={styles.receiptBox}>
               <View style={styles.receiptLeft}>
                  <Text style={styles.receiptLabel}>Recibi conforme:</Text>
                  <View style={styles.receiptSignatureLine} />
               </View>
               <View style={styles.receiptRight}>
                  <View style={styles.receiptDateLine}>
                     <Text style={styles.receiptLabel}>Fecha:</Text>
                     <Text style={styles.receiptDateValue}>{formatDate(data?.request_date ?? "")}</Text>
                  </View>
                  <View style={styles.receiptDateLine}>
                     <Text style={styles.receiptLabel}>Hora:</Text>
                     <Text style={styles.receiptDateValue}>{"-"}</Text>
                  </View>
               </View>
            </View>

            <View style={styles.statusBar}>
               <Text style={styles.statusItem}>Solicitado: {formatDate(data?.request_date ?? "")}</Text>
               <Text style={styles.statusItem}>Autorizado: {formatDate(data?.revision_date ?? "")}</Text>
               <Text style={styles.statusItem}>Revisado por: {data?.reviewer_user_information?.fullname ?? ""}</Text>
            </View>
         </Page>
      </Document>
   );
}
