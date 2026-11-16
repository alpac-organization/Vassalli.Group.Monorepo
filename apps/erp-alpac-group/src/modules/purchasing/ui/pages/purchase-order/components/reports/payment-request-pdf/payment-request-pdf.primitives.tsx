import { Image, Text, View } from "@react-pdf/renderer";
import { paymentRequestPdfStyles as styles } from "./payment-request-pdf.styles";

export const PaymentRequestCheckbox = ({ checked }: { checked?: boolean }) => (
	<View style={[styles.checkbox, checked ? styles.checkboxChecked : {}]}>
		{checked ? <Text style={styles.checkboxMark}>X</Text> : null}
	</View>
);

export const PaymentRequestField = ({
	label,
	value,
}: {
	label: string;
	value?: string | null;
}) => (
	<View style={styles.fieldRow}>
		<Text style={styles.fieldLabel}>{label}</Text>
		<View style={styles.fieldValueWrap}>
			<Text style={styles.fieldValue}>{value ?? ""}</Text>
		</View>
	</View>
);

export const PaymentRequestSignatureCard = ({
	title,
	name,
	sealSrc,
	isLast,
}: {
	title: string;
	name?: string | null;
	sealSrc?: string | null;
	isLast?: boolean;
}) => (
	<View style={[styles.signatureCard, isLast ? styles.signatureCardLast : {}]}>
		<Text style={styles.signatureTitle}>{title}</Text>
		<View style={styles.signatureLine}>
			<Text style={styles.signatureHint}>{name || "Firma"}</Text>
		</View>
		{sealSrc ? (
			<View style={styles.sealWrap}>
				<Image src={sealSrc} style={styles.authorizationSeal} />
			</View>
		) : null}
	</View>
);
