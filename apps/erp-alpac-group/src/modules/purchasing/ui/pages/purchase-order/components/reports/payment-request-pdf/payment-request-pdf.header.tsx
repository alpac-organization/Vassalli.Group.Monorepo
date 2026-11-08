import { Image, Text, View } from "@react-pdf/renderer";
import { PaymentMethodEnum } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PaymentRequestPdfData } from "./payment-request-pdf.types";
import { paymentRequestPdfStyles as styles } from "./payment-request-pdf.styles";

const resolveDocumentBadge = (
	documentType: PaymentRequestPdfData["documentType"],
) => {
	if (documentType === PaymentMethodEnum.Check.textValue) {
		return "Medio de pago · Cheque";
	}
	return "Medio de pago · Transferencia bancaria";
};

type PaymentRequestPdfHeaderProps = {
	title: string;
	companyName: string;
	documentType: PaymentRequestPdfData["documentType"];
	requestNumber: string;
	logoUrl?: string | null;
};

export const PaymentRequestPdfHeader = ({
	title,
	companyName,
	documentType,
	requestNumber,
	logoUrl,
}: PaymentRequestPdfHeaderProps) => (
	<View style={styles.header}>
		<View style={styles.headerLeft}>
			{logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
		</View>

		<View style={styles.headerCenter}>
			<Text style={styles.companyName}>{companyName}</Text>
			<Text style={styles.documentTitle}>{title}</Text>
			<View style={styles.documentBadge}>
				<Text style={styles.documentBadgeText}>
					{resolveDocumentBadge(documentType)}
				</Text>
			</View>
		</View>

		<View style={styles.headerRight}>
			<Text style={styles.requestNumberLabel}>No. Solicitud</Text>
			<Text style={styles.requestNumberValue}>{requestNumber}</Text>
		</View>
	</View>
);
