import { Text, View } from "@react-pdf/renderer";
import type { PaymentRequestPdfData } from "./payment-request-pdf.types";
import { paymentRequestPdfStyles as styles } from "./payment-request-pdf.styles";
import { formatPurchaseOrderReportMoney } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";

type AmountLine = {
	label: string;
	amount: number;
	emphasize?: boolean;
};

const buildAmountLines = (
	amounts: PaymentRequestPdfData["amounts"],
): AmountLine[] => [
	{ label: "Monto Servicio", amount: amounts.serviceAmount },
	{ label: "Monto Serv Exento", amount: 0 },
	{ label: "Desembolso/Otros", amount: 0 },
	{ label: "IVA", amount: amounts.iva },
	{ label: "IR", amount: amounts.ir },
	{ label: "IMI", amount: amounts.imi },
	{ label: "OTROS", amount: 0 },
	{ label: "Neto a Pagar", amount: amounts.netPayable, emphasize: true },
];

type PaymentRequestPdfAmountsProps = {
	amounts: PaymentRequestPdfData["amounts"];
};

export const PaymentRequestPdfAmounts = ({
	amounts,
}: PaymentRequestPdfAmountsProps) => {
	const currency = amounts.currency;
	const amountLines = buildAmountLines(amounts);

	return (
		<View style={styles.amountsCard}>
			<View style={styles.cardHeader}>
				<Text style={styles.cardHeaderText}>Resumen financiero</Text>
			</View>
			<View style={styles.cardBody}>
				{amountLines.map((line) => (
					<View
						key={line.label}
						style={[styles.amountRow, line.emphasize ? styles.amountRowLast : {}]}
					>
						<Text style={styles.amountLabel}>{line.label}</Text>
						<Text
							style={line.emphasize ? styles.amountValueNet : styles.amountValue}
						>
							{formatPurchaseOrderReportMoney(line.amount, currency)}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};
