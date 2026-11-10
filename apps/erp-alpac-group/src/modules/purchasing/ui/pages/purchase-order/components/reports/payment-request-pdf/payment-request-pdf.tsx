import { Document, Page, View } from "@react-pdf/renderer";
import type { PaymentRequestPdfProps } from "./payment-request-pdf.types";
import { paymentRequestPdfStyles as styles } from "./payment-request-pdf.styles";
import { PaymentRequestPdfHeader } from "./payment-request-pdf.header";
import { PaymentRequestPdfInfo } from "./payment-request-pdf.info";
import { PaymentRequestPdfAmounts } from "./payment-request-pdf.amounts";
import { PaymentRequestPdfChecklistTable } from "./payment-request-pdf.checklist-table";
import { PaymentRequestPdfSignatures } from "./payment-request-pdf.signatures";

const DEFAULT_COMPANY_NAME = "ALMACENADORA DEL PACIFICO, S.A.";

export function PaymentRequestPDF({ data }: PaymentRequestPdfProps) {
	const title = data.title || "Solicitud de pago";
	const companyName = data.companyName || DEFAULT_COMPANY_NAME;

	return (
		<Document>
			<Page size="LETTER" style={styles.page}>
				<PaymentRequestPdfHeader
					title={title}
					companyName={companyName}
					documentType={data.documentType}
					requestNumber={data.requestNumber}
					logoUrl={data.logoUrl}
				/>

				<View style={styles.mainGrid}>
					<PaymentRequestPdfInfo
						date={data.date}
						department={data.department}
						payee={data.payee}
						concept={data.concept}
						clientAccount={data.clientAccount}
						referenceNumber={data.referenceNumber}
					/>
					<PaymentRequestPdfAmounts amounts={data.amounts} />
				</View>

				<PaymentRequestPdfChecklistTable checklist={data.checklist} />

				<PaymentRequestPdfSignatures
					requestedBy={data.requestedBy}
					approvedBy={data.approvedBy}
					sealSrc={data.sealSrc}
					bankName={data.bankName}
				/>
			</Page>
		</Document>
	);
}
