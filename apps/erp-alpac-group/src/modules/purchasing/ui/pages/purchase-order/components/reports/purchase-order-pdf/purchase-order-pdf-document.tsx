import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { PURCHASE_ORDER_PDF_COMPANY } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/constants/purchase-order-pdf.constants";
import { purchaseOrderPdfStyles as styles } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/styles/purchase-order-pdf.styles";
import type { PurchaseOrderPdfDocumentProps } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/types/purchase-order-pdf.types";
import { useUserStore } from "@app/shared/stores/useUserStore";

export function PurchaseOrderPdfDocument({
	viewModels,
}: PurchaseOrderPdfDocumentProps) {
	const { companyAlias } = useUserStore();

	return (
		<Document>
			{viewModels.map((viewModel, i) => {
				const {
					companyLogoUrl,
					supplierName,
					purchaseOrderCode,
					orderDateLabel,
					paymentCondition,
					materialsRequest,
					requestingDepartment,
					notes,
					requisitionCode,
					elaboratedBy,
					authorizedBy,
					items,
					totals,
				} = viewModel;

				const itemCount = items.length;

				return (
					<Page key={i} size="LETTER" style={styles.page}>
						<View style={styles.headerRow}>
							<View style={styles.headerLeft}>
								{companyLogoUrl ? (
									<Image src={companyLogoUrl} style={styles.logo} />
								) : null}
							</View>
							<View style={styles.headerCenter}>
								<Text style={styles.companyName}>{companyAlias}</Text>
							</View>
						</View>

						<Text style={styles.documentTitle}>
							{PURCHASE_ORDER_PDF_COMPANY.documentTitle}
						</Text>

						<View style={styles.infoRow}>
							<View style={styles.infoCol}>
								<View style={styles.infoLine}>
									<Text style={styles.infoLabel}>Nombre del Proveedor:</Text>
									<Text style={styles.infoValue}>{supplierName}</Text>
								</View>
								<View style={styles.infoLine}>
									<Text style={styles.infoLabel}>Orden de Compra No:</Text>
									<Text style={styles.infoValue}>{purchaseOrderCode}</Text>
								</View>
							</View>
							<View style={styles.infoCol}>
								<View style={styles.infoLine}>
									<Text style={styles.infoLabel}>Fecha:</Text>
									<Text style={styles.infoValue}>{orderDateLabel}</Text>
								</View>
								<View style={styles.infoLine}>
									<Text style={styles.infoLabel}>Condición de Pago:</Text>
									<Text style={styles.infoValue}>{paymentCondition}</Text>
								</View>
							</View>
						</View>

						<View style={styles.deptRow}>
							<View style={[styles.deptCell, styles.deptMaterials]}>
								<Text>
									Solicitud de Materiales
									{materialsRequest ? `: ${materialsRequest}` : ""}
								</Text>
							</View>
							<View style={[styles.deptCell, styles.deptRequesting]}>
								<Text>Departamento Solicitante: {requestingDepartment}</Text>
							</View>
							<View
								style={[
									styles.deptCell,
									styles.deptProforma,
									styles.deptCellLast,
								]}
							>
								<Text style={styles.proformaText}>
									{PURCHASE_ORDER_PDF_COMPANY.proformaLabel}
								</Text>
							</View>
						</View>

						<Text style={styles.supplyLabel}>
							{PURCHASE_ORDER_PDF_COMPANY.supplyRequestLabel}
						</Text>

						<View style={styles.table}>
							<View style={styles.tableRow} wrap={false}>
								<Text style={[styles.cell, styles.colQty, styles.headerText]}>
									Cantidad
								</Text>
								<Text style={[styles.cell, styles.colUm, styles.headerText]}>
									U/M
								</Text>
								<Text style={[styles.cell, styles.colCode, styles.headerText]}>
									Categoria
								</Text>
								<Text style={[styles.cell, styles.colDesc, styles.headerText]}>
									DESCRIPCION
								</Text>
								<Text
									style={[styles.cell, styles.colUnitPrice, styles.headerText]}
								>
									Precio Unitario
								</Text>
								<Text
									style={[
										styles.cell,
										styles.colTotal,
										styles.headerText,
										styles.cellLast,
									]}
								>
									Importe Total
								</Text>
							</View>

							{items.map((item, index) => {
								const isLast = index === itemCount - 1;
								return (
									<View
										key={`${item.productCode}-${index}`}
										style={[
											styles.tableRow,
											isLast ? styles.tableRowLast : {},
										]}
										wrap={false}
									>
										<Text style={[styles.cell, styles.colQty, styles.center]}>
											{item.quantityLabel}
										</Text>
										<Text style={[styles.cell, styles.colUm, styles.center]}>
											{item.unitMeasure}
										</Text>
										<Text style={[styles.cell, styles.colCode, styles.center]}>
											{item.productCode}
										</Text>
										<Text style={[styles.cell, styles.colDesc]}>
											{item.description}
										</Text>
										<Text
											style={[styles.cell, styles.colUnitPrice, styles.right]}
										>
											{item.unitPriceLabel}
										</Text>
										<Text
											style={[
												styles.cell,
												styles.colTotal,
												styles.right,
												styles.cellLast,
											]}
										>
											{item.lineTotalLabel}
										</Text>
									</View>
								);
							})}
						</View>

						<View style={styles.notesTotalsRow} wrap={false}>
							<View style={styles.notesCol}>
								<Text style={styles.notesText}>{notes}</Text>
							</View>
							<View style={styles.totalsCol}>
								<View style={styles.totalLine}>
									<Text style={styles.totalLabel}>SubTotal</Text>
									<Text style={styles.totalValue}>
										{totals.subtotalLabel}
									</Text>
								</View>
								<View style={styles.totalLine}>
									<Text style={styles.totalLabel}>Descuento</Text>
									<Text style={styles.totalValue}>
										{totals.discountLabel}
									</Text>
								</View>
								<View style={styles.totalLine}>
									<Text style={styles.totalLabel}>IVA</Text>
									<Text style={styles.totalValue}>{totals.ivaLabel}</Text>
								</View>
								<View style={styles.totalLine}>
									<Text style={styles.totalLabel}>EXO</Text>
									<Text style={styles.totalValue}>{totals.exoLabel}</Text>
								</View>
								<View style={styles.totalLine}>
									<Text style={[styles.totalLabel, styles.totalBold]}>
										Total
									</Text>
									<Text style={[styles.totalValue, styles.totalBold]}>
										{totals.totalLabel}
									</Text>
								</View>
							</View>
						</View>

						<Text style={styles.paymentNote}>
							{PURCHASE_ORDER_PDF_COMPANY.paymentInstruction}
						</Text>

						<View style={styles.metaRow} wrap={false}>
							<Text style={styles.metaItem}>Proveedor</Text>
							<Text style={styles.metaItem}>
								Requisicion: {requisitionCode}
							</Text>
							<Text style={styles.metaItem}>
								OC autorizada por:{authorizedBy ? ` ${authorizedBy}` : ""}
							</Text>
						</View>

						<View style={styles.signaturesRow} wrap={false}>
							<View style={styles.signatureBlock}>
								<View style={styles.signatureLine} />
								<Text style={styles.signatureLabel}>
									Elaborado Por: {elaboratedBy}
								</Text>
							</View>
							<View style={styles.signatureBlock}>
								<View style={styles.signatureLine} />
								<Text style={styles.signatureLabel}>Autorizado</Text>
							</View>
						</View>
					</Page>
				);
			})}
		</Document>
	);
}
