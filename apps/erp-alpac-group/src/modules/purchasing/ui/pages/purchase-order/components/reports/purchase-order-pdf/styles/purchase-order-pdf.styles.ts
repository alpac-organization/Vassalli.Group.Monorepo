import { StyleSheet } from "@react-pdf/renderer";

export const purchaseOrderPdfStyles = StyleSheet.create({
	page: {
		paddingTop: 28,
		paddingBottom: 36,
		paddingHorizontal: 36,
		fontSize: 9,
		fontFamily: "Helvetica",
		color: "#000",
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 4,
	},
	headerLeft: {
		width: "22%",
		alignItems: "flex-start",
	},
	headerCenter: {
		width: "56%",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingTop: 2,
	},
	headerRight: {
		width: "22%",
		alignItems: "flex-end",
		paddingTop: 2,
	},
	logo: {
		width: 70,
		height: 58,
		objectFit: "contain",
	},
	companyName: {
		fontSize: 13,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		letterSpacing: 0.3,
	},
	companyMeta: {
		fontSize: 8,
		textAlign: "center",
		marginTop: 2,
	},
	formCode: {
		fontSize: 9,
		fontFamily: "Helvetica",
	},
	documentTitle: {
		fontSize: 12,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		marginTop: 10,
		marginBottom: 10,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 4,
	},
	infoCol: {
		width: "48%",
	},
	infoLine: {
		flexDirection: "row",
		marginBottom: 3,
		fontSize: 9,
	},
	infoLabel: {
		fontFamily: "Helvetica-Bold",
		marginRight: 4,
	},
	infoValue: {
		fontFamily: "Helvetica",
		flex: 1,
	},
	deptRow: {
		flexDirection: "row",
		borderWidth: 1,
		borderColor: "#000",
		marginTop: 8,
		minHeight: 22,
	},
	deptCell: {
		borderRightWidth: 1,
		borderRightColor: "#000",
		paddingVertical: 4,
		paddingHorizontal: 6,
		justifyContent: "center",
		fontSize: 8,
	},
	deptCellLast: {
		borderRightWidth: 0,
	},
	deptMaterials: {
		width: "34%",
	},
	deptRequesting: {
		width: "40%",
	},
	deptProforma: {
		width: "26%",
		alignItems: "center",
		justifyContent: "center",
	},
	proformaText: {
		fontFamily: "Helvetica-Bold",
		fontSize: 11,
		textAlign: "center",
	},
	supplyLabel: {
		fontSize: 8,
		marginTop: 6,
		marginBottom: 6,
	},
	table: {
		borderWidth: 1,
		borderColor: "#000",
		width: "100%",
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		minHeight: 18,
	},
	tableRowLast: {
		borderBottomWidth: 0,
	},
	cell: {
		borderRightWidth: 1,
		borderRightColor: "#000",
		paddingVertical: 3,
		paddingHorizontal: 4,
		fontSize: 8,
		justifyContent: "center",
	},
	cellLast: {
		borderRightWidth: 0,
	},
	headerText: {
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		fontSize: 8,
	},
	center: {
		textAlign: "center",
	},
	right: {
		textAlign: "right",
	},
	colQty: { width: "10%" },
	colUm: { width: "10%" },
	colCode: { width: "10%" },
	colDesc: { width: "38%" },
	colUnitPrice: { width: "16%" },
	colTotal: { width: "16%" },
	notesTotalsRow: {
		flexDirection: "row",
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderBottomWidth: 1,
		borderColor: "#000",
		minHeight: 70,
	},
	notesCol: {
		width: "62%",
		paddingVertical: 6,
		paddingHorizontal: 8,
		borderRightWidth: 1,
		borderRightColor: "#000",
	},
	notesText: {
		fontSize: 8,
		lineHeight: 1.4,
	},
	totalsCol: {
		width: "38%",
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
	totalLine: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 2,
		fontSize: 9,
	},
	totalLabel: {
		fontFamily: "Helvetica",
	},
	totalValue: {
		fontFamily: "Helvetica",
		textAlign: "right",
	},
	totalBold: {
		fontFamily: "Helvetica-Bold",
	},
	paymentNote: {
		fontSize: 8,
		fontFamily: "Helvetica-Bold",
		marginTop: 10,
		marginBottom: 8,
	},
	metaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 18,
		fontSize: 9,
	},
	metaItem: {
		flex: 1,
	},
	signaturesRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
		paddingHorizontal: 24,
	},
	signatureBlock: {
		width: "40%",
		alignItems: "center",
	},
	signatureLine: {
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		width: "100%",
		marginBottom: 4,
	},
	signatureLabel: {
		fontSize: 9,
		textAlign: "center",
	},
});
