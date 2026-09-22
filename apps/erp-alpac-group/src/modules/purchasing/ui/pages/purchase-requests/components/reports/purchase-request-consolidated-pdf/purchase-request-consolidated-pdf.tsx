import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { formatDate } from "@app/shared/utils/string.utils";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { purchaseRequestConsolidatedPdfStyle as styles } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-consolidated-pdf/styles/purchase-request-consolidated-pdf.styles";
import type { PurchaseRequestConsolidatedPdfProps } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-consolidated-pdf/types/purchase-request-consolidated-pdf.types";

const FORM_CODE = "RC-SEG-02";
const DOCUMENT_TITLE = "SOLICITUD DE MATERIALES DE OFICINA Y OTROS";

const SPANISH_MONTHS = [
	"enero",
	"febrero",
	"marzo",
	"abril",
	"mayo",
	"junio",
	"julio",
	"agosto",
	"septiembre",
	"octubre",
	"noviembre",
	"diciembre",
] as const;

function formatFormDate(dateString: string): string {
	if (!dateString) return "";
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return "";

	const day = String(date.getUTCDate()).padStart(2, "0");
	const month = SPANISH_MONTHS[date.getUTCMonth()];
	const year = date.getUTCFullYear();

	return `${day}-${month}-${year}`;
}

function resolvePeriodLabel(requestType: string): string {
	if (requestType === PurchaseRequestEnum.Monthly.textValue) {
		return PurchaseRequestEnum.Monthly.label;
	}
	if (requestType === PurchaseRequestEnum.Eventual.textValue) {
		return PurchaseRequestEnum.Eventual.label;
	}
	return requestType;
}

export function PurchaseRequestConsolidatedPDF({
	data,
}: PurchaseRequestConsolidatedPdfProps) {
	const { urlImage } = useCompanyStore();
	const { companyAlias } = useUserStore();

	const products = data.products ?? [];
	const categoryName =
		products[0]?.product_details?.category_information?.name ?? "";
	const periodLabel = resolvePeriodLabel(data.request_type);
	const solicitante =
		data.information_from_requesting_area?.work_area_name ??
		data.information_from_requesting_area?.description ??
		"";
	const areaManager = data.creator_user_information?.fullname ?? "";
	const authorizedBy = data.reviewer_user_information?.fullname ?? "";

	return (
		<Document>
			<Page size="LETTER" style={styles.page}>
				<View style={styles.headerRow}>
					<View style={styles.headerLeft}>
						{urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
					</View>
					<View style={styles.headerCenter}>
						<Text style={styles.companyName}>{companyAlias}</Text>
					</View>
					<View style={styles.headerRight}>
						<Text style={styles.formCode}>{FORM_CODE}</Text>
					</View>
				</View>

				<Text style={styles.documentTitle}>{DOCUMENT_TITLE}</Text>

				<View style={styles.metaBox}>
					<View style={styles.metaLeft}>
						<Text style={styles.metaLine}>Solicitante: {solicitante}</Text>
						<Text style={styles.metaLine}>Periodo: {periodLabel}</Text>
						<Text style={styles.metaLine}>Categoria: {categoryName}</Text>
					</View>
					<View style={styles.metaRight}>
						<Text style={styles.metaLine}>Solicitud: {data.code}</Text>
						<Text style={styles.metaLine}>
							Fecha: {formatFormDate(data.request_date ?? "")}
						</Text>
					</View>
				</View>

				<View style={styles.table}>
					<View style={styles.tableRow}>
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
						const isLast = index === products.length - 1;
						const productCode =
							item.product_details?.category_information?.code ?? "";
						const productName =
							item.product_details?.product_name ?? item.description ?? "";
						const unit =
							item.unit_measure_information?.name ??
							item.unit_measure_information?.symbol ??
							"";
						const observations = item.justification ?? item.additional_data ?? "";

						return (
							<View
								key={item.purchase_request_item_id ?? `${productCode}-${index}`}
								style={[styles.tableRow, isLast ? styles.tableRowLast : {}]}
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

				<View style={styles.signaturesSection}>
					<View style={styles.signaturesLeft}>
						<View style={styles.signatureBlock}>
							<Text style={styles.signatureLabel}>
								Jefe de Area Solicitante: {areaManager}
							</Text>
							<View style={styles.signatureLine} />
						</View>
						<View style={styles.signatureBlock}>
							<Text style={styles.signatureLabel}>
								Autorizado Por: {authorizedBy}
							</Text>
							<View style={styles.signatureLine} />
						</View>
						<View style={styles.signatureBlock}>
							<Text style={styles.signatureLabel}>Modificado Por:</Text>
							<View style={styles.signatureLine} />
						</View>
					</View>
					<View style={styles.signaturesRight}>
						<View style={styles.signatureBlock}>
							<Text style={styles.signatureLabel}>Fecha de Entrega:</Text>
							<View style={styles.signatureLine} />
						</View>
						<View style={styles.signatureBlock}>
							<Text style={styles.signatureLabel}>Recibido por:</Text>
							<View style={styles.signatureLine} />
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
					<Text style={styles.statusItem}>Revisado:</Text>
				</View>
			</Page>
		</Document>
	);
}
