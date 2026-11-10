import { Text, View } from "@react-pdf/renderer";
import { DEFAULT_PAYMENT_REQUEST_CHECKLIST } from "./payment-request-pdf.checklist";
import type { PaymentRequestChecklistSection } from "./payment-request-pdf.types";
import { paymentRequestPdfStyles as styles } from "./payment-request-pdf.styles";
import { PaymentRequestCheckbox } from "./payment-request-pdf.primitives";

const resolveChecklist = (
	checklist?: PaymentRequestChecklistSection[],
): PaymentRequestChecklistSection[] =>
	checklist ??
	DEFAULT_PAYMENT_REQUEST_CHECKLIST.map((section) => ({
		title: section.title,
		items: section.items.map((item) => ({ ...item })),
	}));

type PaymentRequestPdfChecklistTableProps = {
	checklist?: PaymentRequestChecklistSection[];
};

export const PaymentRequestPdfChecklistTable = ({
	checklist,
}: PaymentRequestPdfChecklistTableProps) => {
	const sections = resolveChecklist(checklist);

	return (
		<View style={styles.section}>
			<View style={styles.tableHeader}>
				<Text style={[styles.th, styles.colCheck]}>Check</Text>
				<Text style={[styles.th, styles.colDesc]}>
					Descripción del documento
				</Text>
				<Text style={[styles.th, styles.colComments]}>Comentarios</Text>
			</View>

			{sections.map((section) => (
				<View key={section.title}>
					<View style={styles.sectionTitleRow}>
						<Text style={styles.sectionTitleText}>{section.title}</Text>
					</View>
					{section.items.map((item, index) => (
						<View
							key={item.id}
							style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
						>
							<View style={[styles.td, styles.colCheck, styles.tdCenter]}>
								<PaymentRequestCheckbox checked={item.checked} />
							</View>
							<Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
							<Text style={[styles.td, styles.colComments]}>
								{item.accountingComments || ""}
							</Text>
						</View>
					))}
				</View>
			))}
		</View>
	);
};
