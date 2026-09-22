import { StyleSheet } from "@react-pdf/renderer";

export const purchaseRequestConsolidatedPdfStyle = StyleSheet.create({
	page: {
		paddingTop: 24,
		paddingBottom: 24,
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
		width: "26%",
		alignItems: "flex-start",
	},
	headerCenter: {
		width: "48%",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingTop: 6,
	},
	headerRight: {
		width: "26%",
		alignItems: "flex-end",
		paddingTop: 4,
	},
	logo: {
		width: 64,
		height: 64,
		objectFit: "contain",
	},
	companyName: {
		fontSize: 18,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		letterSpacing: 0.5,
	},
	formCode: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
		textDecoration: "underline",
	},
	documentTitle: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		marginTop: 6,
		marginBottom: 10,
	},
	metaBox: {
		borderWidth: 1,
		borderColor: "#000",
		flexDirection: "row",
		paddingVertical: 8,
		paddingHorizontal: 10,
		marginBottom: 10,
	},
	metaLeft: {
		width: "55%",
	},
	metaRight: {
		width: "45%",
		alignItems: "flex-end",
	},
	metaLine: {
		fontSize: 10,
		marginBottom: 4,
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
		minHeight: 22,
	},
	tableRowLast: {
		borderBottomWidth: 0,
	},
	cell: {
		borderRightWidth: 1,
		borderRightColor: "#000",
		paddingVertical: 4,
		paddingHorizontal: 3,
		fontSize: 8,
		justifyContent: "center",
	},
	cellLast: {
		borderRightWidth: 0,
	},
	headerText: {
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		fontSize: 7,
	},
	center: {
		textAlign: "center",
	},
	colCode: { width: "8%" },
	colName: { width: "22%" },
	colUnit: { width: "10%" },
	colQty: { width: "12%" },
	colDelivered: { width: "12%" },
	colStock: { width: "12%" },
	colObs: { width: "24%" },
	signaturesSection: {
		flexDirection: "row",
		marginTop: 20,
		marginBottom: 20,
	},
	signaturesLeft: {
		width: "55%",
		paddingRight: 12,
	},
	signaturesRight: {
		width: "45%",
		paddingLeft: 8,
	},
	signatureBlock: {
		marginBottom: 14,
	},
	signatureLabel: {
		fontSize: 10,
		marginBottom: 2,
	},
	signatureLine: {
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		marginTop: 12,
		width: "90%",
	},
	statusBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 8,
		marginTop: "auto",
	},
	statusItem: {
		fontSize: 9,
		flex: 1,
	},
});
