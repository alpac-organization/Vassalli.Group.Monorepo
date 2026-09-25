import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { formatDate } from "@app/shared/utils/string.utils";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { purchaseRequestConsolidatedPdfStyle as styles } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-consolidated-pdf/styles/purchase-request-consolidated-pdf.styles";
import type { PurchaseRequestConsolidatedPdfProps } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-consolidated-pdf/types/purchase-request-consolidated-pdf.types";
import { DOCUMENT_TITLE } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-consolidated-pdf/constants/purchase-req-consolidated";
import {
	resolvePeriodLabel,
	formatFormDate,
} from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-consolidated-pdf/utils/purchase-req-consolitad";

const FOOTER_MIN_PRESENCE = 140;

export function PurchaseRequestConsolidatedPDF({
	data,
}: PurchaseRequestConsolidatedPdfProps) {
	const { urlImage } = useCompanyStore();
	const products = data.products ?? [];
	const categoryName =
		products[0]?.product_details?.category_information?.name ?? "";
	const periodLabel = resolvePeriodLabel(data.request_type);
	const solicitante =
		data.information_from_requesting_area?.work_area_name ??
		data.information_from_requesting_area?.description ??
		"";

	return (
		<Document>
			<Page size="LETTER" style={styles.page} wrap>
				<View style={styles.headerRow} wrap={false}>
					<View style={styles.headerLeft}>
						{urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
					</View>
				</View>

				<Text style={styles.documentTitle}>{DOCUMENT_TITLE}</Text>

				<View style={styles.metaBox} wrap={false}>
					<View style={styles.infoLeft}>
						<Text style={styles.infoLine}>Solicitante: {solicitante}</Text>
						<Text style={styles.infoLine}>Periodo: {periodLabel}</Text>
						<Text style={styles.infoLine}>Categoria: {categoryName}</Text>
					</View>
					<View style={styles.infoRight}>
						<Text style={styles.infoLine}>Solicitud: {data.code}</Text>
						<Text style={styles.infoLine}>
							Fecha: {formatFormDate(data.request_date ?? "")}
						</Text>
					</View>
				</View>

				<View style={styles.table}>
					{/* Se repite en cada página para mantener contexto de columnas */}
					<View style={styles.tableHeaderRow} fixed wrap={false}>
						<Text style={[styles.cell, styles.colCode, styles.headerText]}>
							Código
						</Text>
						<Text style={[styles.cell, styles.colName, styles.headerText]}>
							Nombre Del Articulo
						</Text>
						<Text style={[styles.cell, styles.colUnit, styles.headerText]}>
							Unidad
						</Text>
						<Text style={[styles.cell, styles.colQty, styles.headerText]}>
							Cantidad Solicitada
						</Text>
						<Text style={[styles.cell, styles.colDelivered, styles.headerText]}>
							Cant. Ent./ Prod. Pend.
						</Text>
						<Text style={[styles.cell, styles.colStock, styles.headerText]}>
							Stock Emp solicitante
						</Text>
						<Text
							style={[
								styles.cell,
								styles.colObs,
								styles.headerText,
								styles.cellLast,
							]}
						>
							Observaciones
						</Text>
					</View>

					{products.map((item, index) => {
						const productCode =
							item.product_details?.category_information?.code ?? "";
						const productName =
							item.product_details?.product_name ?? item.description ?? "";
						const unit =
							item.unit_measure_information?.name ??
							item.unit_measure_information?.symbol ??
							"";
						const observations =
							item.justification ?? item.additional_data ?? "";

						return (
							<View
								key={
									item.purchase_request_item_id ?? `${productCode}-${index}`
								}
								style={styles.tableRow}
								wrap={false}
							>
								<Text style={[styles.cell, styles.colCode, styles.center]}>
									{productCode}
								</Text>
								<Text style={[styles.cell, styles.colName]}>{productName}</Text>
								<Text style={[styles.cell, styles.colUnit, styles.center]}>
									{unit}
								</Text>
								<Text style={[styles.cell, styles.colQty, styles.center]}>
									{item.quantity}
								</Text>
								<Text style={[styles.cell, styles.colDelivered, styles.center]}>
									{""}
								</Text>
								<Text style={[styles.cell, styles.colStock, styles.center]}>
									{""}
								</Text>
								<Text style={[styles.cell, styles.colObs, styles.cellLast]}>
									{observations}
								</Text>
							</View>
						);
					})}
				</View>

				<View
					style={styles.closingBlock}
					wrap={false}
					minPresenceAhead={FOOTER_MIN_PRESENCE}
				>
					<View style={styles.footerBox}>
						<View style={styles.metaSection}>
							<View style={styles.metaLeft}>
								<Text style={styles.metaLine}>
									Solicitante del Area:{" "}
									{data.creator_user_information?.fullname ?? ""}
								</Text>
								<View style={styles.authLine} />
								<Text style={styles.metaLine}>
									Solicitado: {formatDate(data.request_date ?? "")}
								</Text>
								<View style={styles.authLine} />
								<Text style={styles.metaLine}>
									Modificado: {formatDate(data.request_date ?? "")}
								</Text>
								<View style={styles.authLine} />
							</View>
							<View style={styles.metaRight}>
								<Text style={styles.authLabel}>
									Autorización:{" "}
									{data.reviewer_user_information?.fullname ?? ""}
								</Text>
								<View style={styles.authLine} />
							</View>
						</View>

						<View style={styles.receiptDivider}>
							<View style={styles.receiptBox}>
								<View style={styles.receiptLeft}>
									<Text style={styles.receiptLabel}>Recibi conforme:</Text>
									<View style={styles.receiptSignatureLine} />
								</View>
								<View style={styles.receiptRight}>
									<View style={styles.receiptDateLine}>
										<Text style={styles.receiptLabel}>Fecha:</Text>
										<Text style={styles.receiptDateValue}>
											{formatDate(data.request_date ?? "")}
										</Text>
									</View>
									<View style={styles.receiptDateLine}>
										<Text style={styles.receiptLabel}>Hora:</Text>
										<Text style={styles.receiptDateValue}>{"-"}</Text>
									</View>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.statusBar}>
						<Text style={styles.statusItem}>
							Solicitado: {formatDate(data.request_date ?? "")}
						</Text>
						<Text style={styles.statusItem}>
							Autorizado: {formatDate(data.revision_date ?? "")}
						</Text>
						<Text style={styles.statusItem}>
							Revisado por: {data.reviewer_user_information?.fullname ?? ""}
						</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
}
