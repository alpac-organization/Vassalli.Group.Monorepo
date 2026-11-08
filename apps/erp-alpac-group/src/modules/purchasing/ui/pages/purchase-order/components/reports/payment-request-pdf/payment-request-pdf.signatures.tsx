import { Text, View } from "@react-pdf/renderer";
import type { PaymentRequestPdfData } from "./payment-request-pdf.types";
import { paymentRequestPdfStyles as styles } from "./payment-request-pdf.styles";
import { PaymentRequestSignatureCard } from "./payment-request-pdf.primitives";

type PaymentRequestPdfSignaturesProps = Pick<
	PaymentRequestPdfData,
	"requestedBy" | "approvedBy" | "sealSrc" | "bankName"
>;

export const PaymentRequestPdfSignatures = ({
	requestedBy,
	approvedBy,
	sealSrc,
	bankName,
}: PaymentRequestPdfSignaturesProps) => (
	<>
		<View style={styles.signatures} wrap={false}>
			<PaymentRequestSignatureCard
				title="Solicitado"
				name={requestedBy}
				sealSrc={sealSrc}
			/>
			<PaymentRequestSignatureCard title="Aprobado" name={approvedBy} />
			<PaymentRequestSignatureCard title="Autorizado" isLast />
		</View>

		<Text style={styles.bankLine}>Banco: {bankName || ""}</Text>

		<Text style={styles.footerMeta}>Usuario: , generado el </Text>
	</>
);
