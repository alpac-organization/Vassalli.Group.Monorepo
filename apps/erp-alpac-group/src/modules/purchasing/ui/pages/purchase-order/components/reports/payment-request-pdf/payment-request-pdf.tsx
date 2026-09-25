import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { PaymentMethodEnum } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import { DEFAULT_PAYMENT_REQUEST_CHECKLIST } from "./payment-request-pdf.checklist";
import { paymentRequestPdfStyles as styles } from "./payment-request-pdf.styles";
import type { PaymentRequestChecklistSection, PaymentRequestPdfProps } from "./payment-request-pdf.types";

const formatMoney = (value: number, currency = "NIO") => {
	const prefix = currency === "USD" ? "US$" : "C$";
	const formatted = new Intl.NumberFormat("es-NI", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value ?? 0);
	return `${prefix} ${formatted}`;
};

const Checkbox = ({ checked }: { checked?: boolean }) => (
	<View style={[styles.checkbox, checked ? styles.checkboxChecked : {}]}>
		{checked ? <Text style={styles.checkboxMark}>X</Text> : null}
	</View>
);

const Field = ({
	label,
	value,
}: {
	label: string;
	value?: string | null;
}) => (
	<View style={styles.fieldRow}>
		<Text style={styles.fieldLabel}>{label}</Text>
		<View style={styles.fieldValueWrap}>
			<Text style={styles.fieldValue}>{value?.trim() || "—"}</Text>
		</View>
	</View>
);

const resolveDocumentTitle = (documentType: PaymentRequestPdfProps["data"]["documentType"]) => {
	if (documentType === PaymentMethodEnum.Check.textValue) {
		return "SOLICITUD DE CHEQUE";
	}
	return "SOLICITUD DE TRANSFERENCIA";
};

const resolveDocumentBadge = (documentType: PaymentRequestPdfProps["data"]["documentType"]) => {
	if (documentType === PaymentMethodEnum.Check.textValue) {
		return "Medio de pago · Cheque";
	}
	return "Medio de pago · Transferencia bancaria";
};

const formatGeneratedAt = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat("es-NI", {
		dateStyle: "long",
		timeStyle: "short",
	}).format(date);
};

const SignatureCard = ({ title, isLast }: { title: string; isLast?: boolean }) => (
	<View style={[styles.signatureCard, isLast ? styles.signatureCardLast : {}]}>
		<Text style={styles.signatureTitle}>{title}</Text>
		<View style={styles.signatureLine}>
			<Text style={styles.signatureHint}>Firma</Text>
		</View>
	</View>
);

export function PaymentRequestPDF({ data }: PaymentRequestPdfProps) {

	const title = resolveDocumentTitle(data.documentType);
	const badge = resolveDocumentBadge(data.documentType);
	const currency = data.amounts.currency ?? "NIO";
	const companyName = data.companyName?.trim() || "ALMACENADORA DEL PACIFICO, S.A.";

	const checklist: PaymentRequestChecklistSection[] =
		data.checklist ??
		DEFAULT_PAYMENT_REQUEST_CHECKLIST.map((section) => ({
			title: section.title,
			items: section.items.map((item) => ({ ...item })),
		}));

	const amountLines = [
		{ label: "Monto Servicio", amount: data.amounts.serviceAmount },
		{ label: "Monto Serv Exento", amount: data.amounts.exemptServiceAmount ?? 0 },
		{ label: "Desembolso/Otros", amount: data.amounts.disbursementOther ?? 0 },
		{ label: "IVA", amount: data.amounts.iva ?? 0 },
		{ label: "IR", amount: data.amounts.ir ?? 0 },
		{ label: "IMI", amount: data.amounts.imi ?? 0 },
		{ label: "OTROS", amount: data.amounts.other ?? 0 },
		{ label: "Neto a Pagar", amount: data.amounts.netPayable, emphasize: true },
	];

	return (
		<Document>
			<Page size="LETTER" style={styles.page}>
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						{data.logoUrl ? <Image src={data.logoUrl} style={styles.logo} /> : null}
					</View>

					<View style={styles.headerCenter}>
						<Text style={styles.companyName}>{companyName}</Text>
						<Text style={styles.documentTitle}>{title}</Text>
						<View style={styles.documentBadge}>
							<Text style={styles.documentBadgeText}>{badge}</Text>
						</View>
					</View>

					<View style={styles.headerRight}>
						<Text style={styles.requestNumberLabel}>No. Solicitud</Text>
						<Text style={styles.requestNumberValue}>{data.requestNumber}</Text>
					</View>
				</View>

				<View style={styles.mainGrid}>
					<View style={styles.infoCard}>
						<View style={styles.cardHeader}>
							<Text style={styles.cardHeaderText}>Información de la solicitud</Text>
						</View>
						<View style={styles.cardBody}>
							<Field label="Fecha" value={data.date} />
							<Field label="No. Asignación" value={data.assignmentNumber} />
							<Field label="Del Departamento" value={data.department} />
							<Field label="A favor de" value={data.payee} />

							<View style={styles.conceptBlock}>
								<Text style={styles.fieldLabel}>En Concepto de</Text>
								<View style={styles.conceptBox}>
									<Text style={styles.fieldValue}>
										{(data.concept?.trim() || "—").slice(0, 220)}
										{(data.concept?.trim().length ?? 0) > 220 ? "…" : ""}
									</Text>
								</View>
							</View>

							<View style={styles.metaRow}>
								<View style={styles.metaItem}>
									<Field label="Por Cuenta de" value={data.clientAccount} />
								</View>
								<View style={styles.metaItem}>
									<Field label={data.rucLabel || "RUC"} value={data.ruc} />
								</View>
							</View>

							<View style={styles.metaRow}>
								<View style={styles.metaItem}>
									<Field label="Aduana" value={data.customs ?? "N/A"} />
								</View>
								<View style={styles.metaItem}>
									<Field
										label="No. Multa Adm."
										value={data.administrativeFineNumber}
									/>
								</View>
							</View>

							<View style={styles.metaRow}>
								<View style={styles.metaItem}>
									<Field label="No. Referencia" value={data.referenceNumber} />
								</View>
								<View style={styles.metaItem}>
									<Field label="No. Declaración" value={data.declarationNumber} />
								</View>
							</View>

							<View style={styles.priorityRow}>
								<Text style={styles.priorityLabel}>Trámite</Text>
								<View style={styles.checkOption}>
									<Checkbox checked={data.priority === "normal"} />
									<Text style={styles.checkOptionLabel}>Normal</Text>
								</View>
								<View style={styles.checkOption}>
									<Checkbox checked={data.priority === "critical"} />
									<Text style={styles.checkOptionLabel}>Crítica</Text>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.amountsCard}>
						<View style={styles.cardHeader}>
							<Text style={styles.cardHeaderText}>Resumen financiero</Text>
						</View>
						<View style={styles.cardBody}>
							{amountLines.map((line) => (
								<View
									key={line.label}
									style={[
										styles.amountRow,
										line.emphasize ? styles.amountRowLast : {},
									]}
								>
									<Text style={styles.amountLabel}>{line.label}</Text>
									<Text
										style={
											line.emphasize ? styles.amountValueNet : styles.amountValue
										}
									>
										{formatMoney(line.amount, currency)}
									</Text>
								</View>
							))}
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.tableHeader}>
						<Text style={[styles.th, styles.colCheck]}>Check</Text>
						<Text style={[styles.th, styles.colDesc]}>Descripción del documento</Text>
						<Text style={[styles.th, styles.colComments]}>Comentarios</Text>
					</View>

					{checklist.map((section) => (
						<View key={section.title}>
							<View style={styles.sectionTitleRow}>
								<Text style={styles.sectionTitleText}>{section.title}</Text>
							</View>
							{section.items.map((item, index) => (
								<View
									key={item.id}
									style={[
										styles.tableRow,
										index % 2 === 1 ? styles.tableRowAlt : {},
									]}
								>
									<View style={[styles.td, styles.colCheck, styles.tdCenter]}>
										<Checkbox checked={item.checked} />
									</View>
									<Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
									<Text style={[styles.td, styles.colComments]}>
										{item.accountingComments?.trim() || ""}
									</Text>
								</View>
							))}
						</View>
					))}
				</View>

				<View style={styles.signatures} wrap={false}>
					<SignatureCard title="Solicitado" />
					<SignatureCard title="Aprobado" />
					<SignatureCard title="Autorizado" isLast />
				</View>

				<Text style={styles.bankLine}>
					Banco: {data.bankName?.trim() || "—"}
				</Text>

				<Text style={styles.footerMeta}>
					{`Usuario: ${data.generatedBy?.trim() || "—"}, generado el ${formatGeneratedAt(data.generatedAt)}`}
				</Text>				
			</Page>
		</Document>
	);
}
