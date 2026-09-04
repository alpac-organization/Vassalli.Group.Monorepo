import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { formatDate } from "@app/shared/utils/string.utils";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { purchaseRequestConsolidatedPdfStyle as styles } from "./purchase-request-consolidated-pdf.styles";
import type { PurchaseRequestConsolidatedPdfProps } from "./types/purchase-request-consolidated-pdf.types";

const documentTitleByType: Record<string, string> = {
	[PurchaseRequestEnum.Requisition.label]: "CONSOLIDADO MENSUAL DE REQUISICIONES",
	[PurchaseRequestEnum.Monthly.label]: "CONSOLIDADO MENSUAL DE SOLICITUDES MENSUALES",
	[PurchaseRequestEnum.Eventual.label]: "CONSOLIDADO MENSUAL DE SOLICITUDES EVENTUALES",
};

export function PurchaseRequestConsolidatedPDF({
	companyAlias,
	logoUrl,
	requestTypeLabel,
	periodLabel,
	data,
	totalQuantity,
	requestCount,
}: PurchaseRequestConsolidatedPdfProps) {
	const documentTitle =
		documentTitleByType[requestTypeLabel] ??
		`CONSOLIDADO MENSUAL DE ${requestTypeLabel.toUpperCase()}`;

	return (
		<Document>
			<Page size="LETTER" style={styles.page}>
				<View style={styles.headerRow}>
					<View style={styles.headerLeft}>
						{logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
					</View>
					<View style={styles.headerCenter}>
						<Text style={styles.companyName}>{companyAlias}</Text>
						<Text style={styles.documentTitle}>{documentTitle}</Text>
						<Text style={styles.requestType}>
							Tipo de solicitud: {requestTypeLabel}
						</Text>
						<Text style={styles.periodLabel}>{periodLabel}</Text>
					</View>
				</View>

				<View style={styles.table}>
					<View style={styles.tableRow}>
						<Text style={[styles.cell, styles.colQty, styles.headerText]}>
							CANTIDAD
						</Text>
						<Text style={[styles.cell, styles.colDesc, styles.headerText]}>
							DESCRIPCION DEL ARTICULO
						</Text>
						<Text style={[styles.cell, styles.colUnit, styles.headerText]}>
							UNIDAD
						</Text>
						<Text
							style={[
								styles.cell,
								styles.colCount,
								styles.headerText,
								styles.cellLast,
							]}
						>
							N° SOLICITUDES
						</Text>
					</View>

					{data.map((item, index) => {
						const isLast = index === data?.length - 1;

						return (
							<View
								key={`${item?.code}-${index}`}
								style={[styles.tableRow, isLast ? styles.tableRowLast : {}]}
							>
								{/* <Text style={[styles.cell, styles.colQty, styles.center]}>
									{item.quantity}
								</Text>
								<Text style={[styles.cell, styles.colDesc]}>
									{item.productName}
								</Text>
								<Text style={[styles.cell, styles.colUnit, styles.center]}>
									{item.unitSymbol}
								</Text>
								<Text
									style={[
										styles.cell,
										styles.colCount,
										styles.center,
										styles.cellLast,
									]}
								>
									{item.requestCount}
								</Text> */}
							</View>
						);
					})}

					<View style={styles.totalRow}>
						<Text style={[styles.cell, styles.colQty, styles.totalLabel, styles.center]}>
							{totalQuantity}
						</Text>
						<Text style={[styles.cell, styles.colDesc, styles.totalLabel]}>
							TOTAL ({data?.length} productos / {requestCount} solicitudes)
						</Text>
						<Text style={[styles.cell, styles.colUnit]} />
						<Text style={[styles.cell, styles.colCount, styles.cellLast]} />
					</View>
				</View>

				<Text style={styles.footer}>
					Generado: {formatDate(new Date().toISOString())}
				</Text>
			</Page>
		</Document>
	);
}
