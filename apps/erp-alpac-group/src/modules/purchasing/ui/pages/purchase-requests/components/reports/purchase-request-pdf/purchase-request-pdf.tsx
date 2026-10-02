import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { purchaseRequestPdfStyle } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-pdf/styles/purchase-request-pdf.styles";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatDate } from "@app/shared/utils/string.utils";
import type { RequisitionDocumentProps } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-pdf/types/purchase-req-pdf";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import {
	ALPAC_COMPANY_NAME,
	ALPAC_CORINTO_NAME,
} from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-pdf/constants/purchase-request-pdf.constants";
import selloCorinto from "@app/assets/signatures/compras/sellos/corinto/sello-administracion.png";
import selloManagua from "@app/assets/signatures/compras/sellos/managua/sello-administracion.png";

const DOCUMENT_TITLE = "REQUISICION DE COMPRAS";
const FOOTER_MIN_PRESENCE = 140;

export function PurchaseRequestPDF({ data }: RequisitionDocumentProps) {
	const { urlImage } = useCompanyStore();
	const { companyAlias } = useUserStore();
	const styles = purchaseRequestPdfStyle;
	const products = data.products ?? [];

	const reviewerName = data?.reviewer_user_information?.fullname?.trim() ?? "";
	const branchName = data?.branch_information?.branch_name?.trim() ?? "";
	const isApproved =
		data?.request_status === PurchaseRequestStatusEnum.Approved.textValue;
	const isCorinto = branchName === ALPAC_CORINTO_NAME;
	const isManagua = branchName === ALPAC_COMPANY_NAME;
	const showSeal = isApproved && (isCorinto || isManagua);
	const selloSrc = isCorinto ? selloCorinto : selloManagua;

	return (
		<Document>
			<Page size="LETTER" style={styles.page} wrap>
				<View style={styles.headerRow} wrap={false}>
					<View style={styles.headerLeft}>
						{urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
						<Text style={styles.requisitionNumber}>{data?.code}</Text>
					</View>
					<View style={styles.headerCenter}>
						<Text style={styles.companyName}>{companyAlias}</Text>
						<Text style={styles.documentTitle}>{DOCUMENT_TITLE}</Text>
					</View>
				</View>

				<View style={styles.table}>
					<View style={styles.tableHeaderRow} fixed wrap={false}>
						<Text style={[styles.cell, styles.colQty, styles.headerText]}>
							CANTIDAD
						</Text>
						<Text style={[styles.cell, styles.colProduct, styles.headerText]}>
							PRODUCTO
						</Text>
						<Text style={[styles.cell, styles.colDesc, styles.headerText]}>
							DESCRIPCION
						</Text>
						<Text
							style={[
								styles.cell,
								styles.colJust,
								styles.headerText,
								styles.cellLast,
							]}
						>
							JUSTIFICACION
						</Text>
					</View>

					{products.map((item, index) => {
						const productName = item.product_details?.product_name?.trim() ?? "";
						const description = item.description?.trim() ?? "";

						return (
							<View
								key={
									item.purchase_request_item_id ??
									`${productName || description || index}`
								}
								style={styles.tableRow}
								wrap={false}
							>
								<Text style={[styles.cell, styles.colQty, styles.center]}>
									{item.quantity}
								</Text>
								<Text style={[styles.cell, styles.colProduct]}>
									{productName}
								</Text>
								<Text style={[styles.cell, styles.colDesc]}>
									{description}
								</Text>
								<Text style={[styles.cell, styles.colJust, styles.cellLast]}>
									{item.justification}
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
									{data?.creator_user_information?.fullname ?? ""}
								</Text>
								<View style={styles.authLine} />
								<Text style={styles.metaLine}>
									Solicitado: {formatDate(data?.request_date ?? "")}
								</Text>
								<View style={styles.authLine} />
							</View>
							<View style={styles.metaRight}>
								<Text style={styles.authLabel}>
									Autorización: {reviewerName}
								</Text>
								<View style={styles.authLine} />
								{showSeal ? (
									<Image src={selloSrc} style={styles.authorizationSeal} />
								) : null}
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
											{formatDate(data?.request_date ?? "")}
										</Text>
									</View>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.statusBar}>
						<Text style={styles.statusItem}>
							Solicitado: {formatDate(data?.request_date ?? "")}
						</Text>
						<Text style={styles.statusItem}>
							Autorizado: {formatDate(data?.revision_date ?? "")}
						</Text>
						<Text style={styles.statusItem}>
							Revisado por: {reviewerName}
						</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
}
