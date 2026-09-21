import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatDate } from "@app/shared/utils/string.utils";
import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { quoteAnalysisPdfStyles as styles } from "@app/modules/finance/ui/pages/quote-analisys/templates/styles/quote-analysis.styles";
import {
	buildQuoteAnalysisPdfViewModel,
	getProviderHeaderColor,
	PROVIDERS_GROUP_HEADER_COLOR,
} from "@app/modules/finance/ui/pages/quote-analisys/templates/utils/quote-analysis.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";

export type QuoteAnalysisPDFProps = {
	detail: RequisitionAccountingReviewDetailsDto;
	products: PurchaseRequestProductInformation[];
	elaborationDate?: string;
};

const FIXED_WIDTH = {
	qty: "7%",
	um: "9%",
	desc: "18%",
} as const;

const PROVIDERS_TOTAL_WIDTH = "66%";

function getProviderBlockWidth(supplierCount: number): string {
	const remaining = 100 - 7 - 9 - 18;
	const count = Math.max(supplierCount, 1);
	return `${remaining / count}%`;
}

function getSubColWidth(): string {
	return "25%";
}

export function QuoteAnalysisPDF({
	detail,
	products,
	elaborationDate,
}: QuoteAnalysisPDFProps) {
	const { urlImage } = useCompanyStore();
	const viewModel = buildQuoteAnalysisPdfViewModel(detail, products);
	const { suppliers, items, totals, qualitative } = viewModel;
	const providerWidth = getProviderBlockWidth(suppliers.length);
	const subColWidth = getSubColWidth();
	const dateLabel = formatDate(
		elaborationDate || detail.sent_to_review_at || new Date().toISOString(),
	);

	return (
		<Document>
			<Page size="LETTER" orientation="landscape" style={styles.page}>
				<View style={styles.headerRow}>
					<View style={styles.headerLeft}>
						{urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
					</View>
					<View style={styles.headerCenter}>
						<Text style={styles.documentTitle}>
							CUADRO DE ANÁLISIS COMPARATIVO
						</Text>
						<Text style={styles.dateLine}>
							1. Fecha de elaboración: {dateLabel}
						</Text>
					</View>
					<View style={styles.headerRight} />
				</View>

				<View style={styles.table}>
					<View style={styles.row}>
						<View style={[styles.cell, { width: FIXED_WIDTH.qty }]}>
							<Text style={styles.headerCell}>Cantidad</Text>
						</View>
						<View style={[styles.cell, { width: FIXED_WIDTH.um }]}>
							<Text style={styles.headerCell}>UM</Text>
						</View>
						<View style={[styles.cell, { width: FIXED_WIDTH.desc }]}>
							<Text style={styles.headerCell}>Descripción</Text>
						</View>
						<View
							style={[
								styles.cell,
								styles.cellLast,
								{
									width: PROVIDERS_TOTAL_WIDTH,
									backgroundColor: PROVIDERS_GROUP_HEADER_COLOR,
								},
							]}
						>
							<Text style={styles.headerCell}>Proveedores</Text>
						</View>
					</View>

					{suppliers.length > 0 && (
						<View style={styles.row}>
							<View style={[styles.cell, { width: FIXED_WIDTH.qty }]} />
							<View style={[styles.cell, { width: FIXED_WIDTH.um }]} />
							<View style={[styles.cell, { width: FIXED_WIDTH.desc }]} />
							{suppliers.map((supplier, index) => (
								<View
									key={`hdr-${supplier.supplierId}`}
									style={[
										styles.cell,
										{
											width: providerWidth,
											backgroundColor: getProviderHeaderColor(index),
										},
										index === suppliers.length - 1 ? styles.cellLast : {},
									]}
								>
									<Text style={styles.headerCell}>{supplier.name}</Text>
								</View>
							))}
						</View>
					)}

					{suppliers.length > 0 && (
						<View style={styles.row}>
							<View style={[styles.cell, { width: FIXED_WIDTH.qty }]} />
							<View style={[styles.cell, { width: FIXED_WIDTH.um }]} />
							<View style={[styles.cell, { width: FIXED_WIDTH.desc }]} />
							{suppliers.map((supplier, index) => (
								<View
									key={`subhdr-${supplier.supplierId}`}
									style={[
										styles.cell,
										{ width: providerWidth, flexDirection: "row", padding: 0 },
										index === suppliers.length - 1 ? styles.cellLast : {},
									]}
								>
									{(["Marca", "P/U", "IVA", "Precio total"] as const).map(
										(label, subIndex) => (
											<View
												key={`${supplier.supplierId}-${label}`}
												style={{
													width: subColWidth,
													borderRightWidth: subIndex === 3 ? 0 : 1,
													borderRightColor: "#000",
													paddingVertical: 2,
													justifyContent: "center",
												}}
											>
												<Text style={styles.subHeaderCell}>{label}</Text>
											</View>
										),
									)}
								</View>
							))}
						</View>
					)}

					{items.map((item, itemIndex) => (
						<View
							key={`item-${itemIndex}`}
							style={[
								styles.row,
								itemIndex === items.length - 1 && suppliers.length === 0
									? styles.rowLast
									: {},
							]}
						>
							<View style={[styles.cell, { width: FIXED_WIDTH.qty }]}>
								<Text style={[styles.bodyText, styles.cellCenter]}>
									{item.quantity}
								</Text>
							</View>
							<View style={[styles.cell, { width: FIXED_WIDTH.um }]}>
								<Text style={[styles.bodyText, styles.cellCenter]}>
									{item.unitMeasure}
								</Text>
							</View>
							<View style={[styles.cell, { width: FIXED_WIDTH.desc }]}>
								<Text style={styles.bodyText}>{item.description}</Text>
							</View>
							{suppliers.map((supplier, index) => {
								const cell = item.cellsBySupplierId[supplier.supplierId];
								return (
									<View
										key={`${itemIndex}-${supplier.supplierId}`}
										style={[
											styles.cell,
											{ width: providerWidth, flexDirection: "row", padding: 0 },
											index === suppliers.length - 1 ? styles.cellLast : {},
										]}
									>
										{(
											[
												cell?.brand ?? "—",
												cell?.unitPrice ?? "—",
												cell?.iva ?? "—",
												cell?.total ?? "—",
											] as const
										).map((value, subIndex) => (
											<View
												key={`${itemIndex}-${supplier.supplierId}-${subIndex}`}
												style={{
													width: subColWidth,
													borderRightWidth: subIndex === 3 ? 0 : 1,
													borderRightColor: "#000",
													paddingVertical: 2,
													paddingHorizontal: 1,
													justifyContent: "center",
												}}
											>
												<Text style={[styles.bodyText, styles.cellCenter]}>
													{value}
												</Text>
											</View>
										))}
									</View>
								);
							})}
						</View>
					))}

					{(
						[
							{ key: "subtotal", label: "Sub total" },
							{ key: "iva", label: "IVA" },
							{ key: "total", label: "TOTAL" },
						] as const
					).map((row, rowIndex, arr) => (
						<View
							key={row.key}
							style={[styles.row, rowIndex === arr.length - 1 ? styles.rowLast : {}]}
						>
							<View
								style={[
									styles.cell,
									{
										width: `${7 + 9 + 18}%`,
										flexDirection: "row",
										justifyContent: "flex-end",
									},
								]}
							>
								<Text style={styles.totalsLabel}>{row.label}</Text>
							</View>
							{suppliers.map((supplier, index) => (
								<View
									key={`${row.key}-${supplier.supplierId}`}
									style={[
										styles.cell,
										{ width: providerWidth, flexDirection: "row", padding: 0 },
										index === suppliers.length - 1 ? styles.cellLast : {},
									]}
								>
									{([0, 1, 2, 3] as const).map((subIndex) => (
										<View
											key={`${row.key}-${supplier.supplierId}-${subIndex}`}
											style={{
												width: subColWidth,
												borderRightWidth: subIndex === 3 ? 0 : 1,
												borderRightColor: "#000",
												paddingVertical: 2,
												justifyContent: "center",
											}}
										>
											<Text
												style={[
													styles.bodyText,
													styles.cellCenter,
													row.key === "total" ? styles.cellBold : {},
												]}
											>
												{subIndex === 3
													? formatCurrency(totals[row.key][supplier.supplierId] ?? 0, "NIO")
													: ""}
											</Text>
										</View>
									))}
								</View>
							))}
							{suppliers.length === 0 && (
								<View style={[styles.cell, styles.cellLast, { width: "66%" }]}>
									<Text style={styles.bodyText}>—</Text>
								</View>
							)}
						</View>
					))}
				</View>

				<View style={[styles.table, styles.sectionGap]}>
					<View style={styles.row}>
						<View style={[styles.cell, { width: "28%" }]}>
							<Text style={styles.qualLabel}>Criterio</Text>
						</View>
						{suppliers.map((supplier, index) => (
							<View
								key={`qhdr-${supplier.supplierId}`}
								style={[
									styles.cell,
									{
										width: `${72 / Math.max(suppliers.length, 1)}%`,
										backgroundColor: getProviderHeaderColor(index),
									},
									index === suppliers.length - 1 ? styles.cellLast : {},
								]}
							>
								<Text style={styles.qualHeader}>
									Proveedor {index + 1}
								</Text>
							</View>
						))}
						{suppliers.length === 0 && (
							<View
								style={[
									styles.cell,
									styles.cellLast,
									{ width: "72%", backgroundColor: getProviderHeaderColor(0) },
								]}
							>
								<Text style={styles.qualHeader}>Proveedores</Text>
							</View>
						)}
					</View>

					{(
						[
							{ key: "delivery", label: "* Plazo de entrega" },
							{ key: "transport", label: "* Transporte" },
							{ key: "warranty", label: "* Período de garantía" },
						] as const
					).map((row, rowIndex, arr) => (
						<View
							key={row.key}
							style={[styles.row, rowIndex === arr.length - 1 ? styles.rowLast : {}]}
						>
							<View style={[styles.cell, { width: "28%" }]}>
								<Text style={styles.qualLabel}>{row.label}</Text>
							</View>
							{suppliers.map((supplier, index) => (
								<View
									key={`${row.key}-${supplier.supplierId}`}
									style={[
										styles.cell,
										{ width: `${72 / Math.max(suppliers.length, 1)}%` },
										index === suppliers.length - 1 ? styles.cellLast : {},
									]}
								>
									<Text style={[styles.bodyText, styles.cellCenter]}>
										{qualitative[row.key][supplier.supplierId] ?? "—"}
									</Text>
								</View>
							))}
						</View>
					))}
				</View>

				<View style={styles.closingBlock}>
					<View style={styles.closingRow}>
						<Text style={styles.closingLabel}>* Sugerencia del técnico:</Text>
						<Text style={styles.closingValue}>N/A</Text>
					</View>
					<View style={styles.closingRow}>
						<Text style={styles.closingLabel}>* Sugerencia del Administrador:</Text>
						<Text style={styles.closingValue}>N/A</Text>
					</View>
					<View style={styles.closingRow}>
						<Text style={styles.closingLabel}>* Proveedor seleccionado:</Text>
						<Text style={styles.closingValue}>
							{viewModel.selectedSupplierNames}
						</Text>
					</View>
					<View style={[styles.closingRow, styles.closingRowLast]}>
						<Text style={styles.closingLabel}>* Justificación:</Text>
						<Text style={styles.closingValue}>{viewModel.justification}</Text>
					</View>
				</View>

				<View style={styles.signatures}>
					<View style={styles.signatureBlock}>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureName}>{viewModel.elaboratedBy}</Text>
						<Text style={styles.signatureRole}>* Elaborado</Text>
					</View>
					<View style={styles.signatureBlock}>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureRole}>* Aprobado</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
}
