import { Text, View } from "@react-pdf/renderer";
import type { PaymentRequestPdfData } from "./payment-request-pdf.types";
import { paymentRequestPdfStyles as styles } from "./payment-request-pdf.styles";
import { PaymentRequestField } from "./payment-request-pdf.primitives";

const CONCEPT_MAX_LENGTH = 220;

type PaymentRequestPdfInfoProps = Pick<
	PaymentRequestPdfData,
	| "date"
	| "department"
	| "payee"
	| "concept"
	| "clientAccount"
	| "referenceNumber"
>;

export const PaymentRequestPdfInfo = ({
	date,
	department,
	payee,
	concept,
	clientAccount,
	referenceNumber,
}: PaymentRequestPdfInfoProps) => {
	const conceptText = concept || "";
	const visibleConcept =
		conceptText.length > CONCEPT_MAX_LENGTH
			? `${conceptText.slice(0, CONCEPT_MAX_LENGTH)}…`
			: conceptText;

	return (
		<View style={styles.infoCard}>
			<View style={styles.cardHeader}>
				<Text style={styles.cardHeaderText}>Información de la solicitud</Text>
			</View>
			<View style={styles.cardBody}>
				<PaymentRequestField label="Fecha" value={date} />
				<PaymentRequestField label="No. Asignación" value="" />
				<PaymentRequestField label="Del Departamento" value={department} />
				<PaymentRequestField label="A favor de" value={payee} />

				<View style={styles.conceptBlock}>
					<Text style={styles.fieldLabel}>En Concepto de</Text>
					<View style={styles.conceptBox}>
						<Text style={styles.fieldValue}>{visibleConcept}</Text>
					</View>
				</View>

				<View style={styles.metaRow}>
					<View style={styles.metaItem}>
						<PaymentRequestField label="Por Cuenta de" value={clientAccount} />
					</View>
					<View style={styles.metaItem}>
						<PaymentRequestField label="RUC" value="" />
					</View>
				</View>

				<View style={styles.metaRow}>
					<View style={styles.metaItem}>
						<PaymentRequestField label="Aduana" value="N/A" />
					</View>
					<View style={styles.metaItem}>
						<PaymentRequestField label="No. Multa Adm." value="" />
					</View>
				</View>

				<View style={styles.metaRow}>
					<View style={styles.metaItem}>
						<PaymentRequestField
							label="No. Referencia"
							value={referenceNumber}
						/>
					</View>
					<View style={styles.metaItem}>
						<PaymentRequestField label="No. Declaración" value="" />
					</View>
				</View>
			</View>
		</View>
	);
};
