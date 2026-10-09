import { memo } from "react";
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import type { MonthlyPurchaseReportPdfProps } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/monthly-purchase-report-pdf/types/monthly-purchase-report-pdf.types";
import { monthlyPurchaseReportPdfStyles as styles } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/monthly-purchase-report-pdf/styles/monthly-purchase-report-pdf.styles";
import {
	buildReportTitle,
	formatCordoba,
	formatQuantity,
	getMonthNameEs,
	resolveReportPeriod,
	resolveRequestTypeLabel,
	sumTotalPrice,
} from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/monthly-purchase-report-pdf/utils/monthly-purchase-report-pdf.utils";

const TABLE_HEADERS = [
	{ key: "mes", label: "Mes", style: styles.colMes },
	{ key: "anio", label: "Año", style: styles.colAnio },
	{ key: "llave", label: "Llave", style: styles.colLlave },
	{ key: "tp", label: "TP Solicitud", style: styles.colTp },
	{ key: "sede", label: "SEDE", style: styles.colSede },
	{ key: "area", label: "Área Solicitante", style: styles.colArea },
	{ key: "proveedor", label: "Proveedor", style: styles.colProveedor },
	{ key: "desc", label: "Descripción", style: styles.colDesc },
	{ key: "cant", label: "Cantidad", style: styles.colCant },
	{ key: "pu", label: "PU", style: styles.colPu },
	{ key: "pt", label: "PT C$", style: styles.colPt },
] as const;

function MonthlyPurchaseReportPdfComponent({
	items,
	logoUrl,
	year,
	month,
}: MonthlyPurchaseReportPdfProps) {
	const period = resolveReportPeriod(items, year, month);
	const title = buildReportTitle(period.year, period.month);
	const total = sumTotalPrice(items);

	return (
		<Document>
			<Page size="LETTER" orientation="landscape" style={styles.page} wrap>
				<View style={styles.headerRow} wrap={false}>
					<View style={styles.headerLeft}>
						{logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
					</View>
					<View style={styles.headerCenter}>
						<Text style={styles.documentTitle}>{title}</Text>
					</View>
				</View>

				{items.length === 0 ? (
					<Text style={styles.emptyState}>
						No hay ítems para el período seleccionado.
					</Text>
				) : (
					<>
						<View style={styles.table}>
							<View style={styles.tableHeaderRow} fixed wrap={false}>
								{TABLE_HEADERS.map((header, index) => (
									<Text
										key={header.key}
										style={[
											styles.cell,
											header.style,
											styles.headerText,
											index === TABLE_HEADERS.length - 1
												? styles.cellLast
												: {},
										]}
									>
										{header.label}
									</Text>
								))}
							</View>

							{items.map((item, index) => {
								const monthLabel =
									getMonthNameEs(item.month) || String(item.month);
								const rowKey = `${item.key}-${item.description}-${index}`;

								return (
									<View key={rowKey} style={styles.tableRow} wrap={false}>
										<Text style={[styles.cell, styles.colMes, styles.center]}>
											{monthLabel}
										</Text>
										<Text style={[styles.cell, styles.colAnio, styles.center]}>
											{item.year}
										</Text>
										<Text style={[styles.cell, styles.colLlave, styles.center]}>
											{item.key}
										</Text>
										<Text style={[styles.cell, styles.colTp, styles.center]}>
											{resolveRequestTypeLabel(item.request_type)}
										</Text>
										<Text style={[styles.cell, styles.colSede, styles.left]}>
											{item.branch_name ?? ""}
										</Text>
										<Text style={[styles.cell, styles.colArea, styles.left]}>
											{item.area_name ?? ""}
										</Text>
										<Text
											style={[styles.cell, styles.colProveedor, styles.left]}
										>
											{item.supplier_name ?? ""}
										</Text>
										<Text style={[styles.cell, styles.colDesc, styles.left]}>
											{item.description ?? ""}
										</Text>
										<Text style={[styles.cell, styles.colCant, styles.right]}>
											{formatQuantity(item.quantity)}
										</Text>
										<Text style={[styles.cell, styles.colPu, styles.right]}>
											{formatCordoba(item.unit_price)}
										</Text>
										<Text
											style={[
												styles.cell,
												styles.colPt,
												styles.right,
												styles.cellLast,
											]}
										>
											{formatCordoba(item.total_price)}
										</Text>
									</View>
								);
							})}
						</View>

						<View style={styles.summaryWrap} wrap={false}>
							<View style={styles.summaryBox}>
								<View style={[styles.summaryRow, styles.summaryRowLast]}>
									<Text style={styles.summaryLabel}>TOTAL</Text>
									<Text style={styles.summaryValue}>
										{formatCordoba(total)}
									</Text>
								</View>
							</View>
						</View>
					</>
				)}
			</Page>
		</Document>
	);
}

/** Memoized to avoid re-rendering heavy PDF trees when parent state changes. */
export const MonthlyPurchaseReportPdf = memo(MonthlyPurchaseReportPdfComponent);
