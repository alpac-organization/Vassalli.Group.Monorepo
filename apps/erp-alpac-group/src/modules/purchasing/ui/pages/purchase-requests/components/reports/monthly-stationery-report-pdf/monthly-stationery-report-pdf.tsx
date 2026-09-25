import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { monthlyStationeryReportPdfStyle as styles } from "./styles/monthly-stationery-report-pdf.styles";
import type { MonthlyStationeryReportPdfProps } from "./types/monthly-stationery-report-pdf.types";

const formatCurrency = (value: number): string =>
	`C$ ${value.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;

const TABLE_HEADERS = [
	{ key: "month", label: "Mes", style: styles.colMonth },
	{ key: "year", label: "Año", style: styles.colYear },
	{ key: "key", label: "Llave", style: styles.colKey },
	{ key: "requestType", label: "TP Solicitud", style: styles.colRequestType },
	{ key: "branch", label: "SEDE", style: styles.colBranch },
	{ key: "requestingArea", label: "Área Solicitante", style: styles.colArea },
	{ key: "supplier", label: "Proveedor", style: styles.colSupplier },
	{ key: "description", label: "Descripción", style: styles.colDescription },
	{ key: "quantity", label: "Cantidad", style: styles.colQty },
	{ key: "unitPrice", label: "PU", style: styles.colUnitPrice },
	{ key: "totalPrice", label: "PT C$", style: styles.colTotalPrice },
] as const;

export function MonthlyStationeryReportPDF({
	title,
	logoUrl,
	rows,
	summaryLines,
}: MonthlyStationeryReportPdfProps) {
	return (
		<Document>
			<Page size="LETTER" orientation="landscape" style={styles.page}>
				<View style={styles.headerRow}>
					<View style={styles.headerLeft}>
						{logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
					</View>
					<View style={styles.headerCenter}>
						<Text style={styles.documentTitle}>{title}</Text>
					</View>
					<View style={styles.headerRight} />
				</View>

				<View style={styles.table}>
					<View style={[styles.tableRow, styles.headerRowBg]}>
						{TABLE_HEADERS.map((header, index) => {
							const isLast = index === TABLE_HEADERS.length - 1;
							return (
								<Text
									key={header.key}
									style={[
										styles.cell,
										header.style,
										styles.headerText,
										isLast ? styles.cellLast : {},
									]}
								>
									{header.label}
								</Text>
							);
						})}
					</View>

					{rows.map((row, index) => {
						const isLast = index === rows.length - 1;

						return (
							<View
								style={[styles.tableRow, isLast ? styles.tableRowLast : {}]}
							>
								<Text style={[styles.cell, styles.colMonth, styles.textCenter]}>
									{row.month}
								</Text>
								<Text style={[styles.cell, styles.colYear, styles.textCenter]}>
									{row.year}
								</Text>
								<Text style={[styles.cell, styles.colKey, styles.textCenter]}>
									{row.key}
								</Text>
								<Text
									style={[styles.cell, styles.colRequestType, styles.textCenter]}
								>
									{row.requestType}
								</Text>
								<Text style={[styles.cell, styles.colBranch, styles.textCenter]}>
									{row.branch}
								</Text>
								<Text style={[styles.cell, styles.colArea, styles.textLeft]}>
									{row.requestingArea}
								</Text>
								<Text style={[styles.cell, styles.colSupplier, styles.textLeft]}>
									{row.supplier}
								</Text>
								<Text
									style={[styles.cell, styles.colDescription, styles.textLeft]}
								>
									{row.description}
								</Text>
								<Text style={[styles.cell, styles.colQty, styles.textRight]}>
									{row.quantity}
								</Text>
								<Text
									style={[styles.cell, styles.colUnitPrice, styles.textRight]}
								>
									{formatCurrency(row.unitPrice)}
								</Text>
								<Text
									style={[styles.cell, styles.colTotalPrice, styles.textRight]}
								>
									{formatCurrency(row.totalPrice)}
								</Text>
							</View>
						);
					})}
				</View>

				<View style={styles.summaryWrap}>
					<View style={styles.summaryTable}>
						{summaryLines.map((line, index) => {
							const isLast = index === summaryLines.length - 1;
							return (
								<View
									key={line.label}
									style={[
										styles.summaryRow,
										isLast ? styles.summaryRowLast : {},
									]}
								>
									<Text style={styles.summaryLabel}>{line.label}</Text>
									<Text style={styles.summaryCurrency}>C$</Text>
									<Text style={styles.summaryAmount}>
										{line.amount.toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</Text>
								</View>
							);
						})}
					</View>
				</View>
			</Page>
		</Document>
	);
}
