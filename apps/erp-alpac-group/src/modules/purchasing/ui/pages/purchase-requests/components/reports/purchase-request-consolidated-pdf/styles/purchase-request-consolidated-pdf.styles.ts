import { StyleSheet } from "@react-pdf/renderer";

export const purchaseRequestConsolidatedPdfStyle = StyleSheet.create({
	page: {
		paddingTop: 24,
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
		width: "26%",
		alignItems: "flex-start",
	},
	headerCenter: {
		width: "74%",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingTop: 6,
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
	infoLeft: {
		width: "55%",
	},
	infoRight: {
		width: "45%",
		alignItems: "flex-end",
	},
	infoLine: {
		fontSize: 10,
		marginBottom: 4,
	},
	table: {
		borderWidth: 1,
		borderColor: "#000",
		width: "100%",
	},
	tableHeaderRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		minHeight: 22,
		backgroundColor: "#ffffff",
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		minHeight: 22,
	},
	closingBlock: {
		marginTop: 16,
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
	footerBox: {
		borderWidth: 1,
		borderColor: "#000",
		marginBottom: 12,
	},
	metaSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 12,
		paddingHorizontal: 10,
	},
	metaLeft: {
		width: "52%",
	},
	metaRight: {
		width: "42%",
		paddingTop: 0,
	},
	metaLine: {
		fontSize: 10,
	},
	authLabel: {
		fontSize: 10,
	},
	authLine: {
		marginTop: 10,
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		width: "100%",
	},
	receiptDivider: {
		borderTopWidth: 1,
		borderTopColor: "#000",
	},
	receiptBox: {
		flexDirection: "row",
		paddingVertical: 14,
		paddingHorizontal: 10,
		minHeight: 70,
		alignItems: "center",
	},
	receiptLeft: {
		width: "65%",
		flexDirection: "row",
		alignItems: "flex-end",
		paddingRight: 12,
	},
	receiptLabel: {
		fontSize: 10,
		marginRight: 6,
	},
	receiptSignatureLine: {
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		marginBottom: 1,
	},
	receiptRight: {
		width: "35%",
		paddingLeft: 6,
	},
	receiptDateLine: {
		flexDirection: "row",
		alignItems: "flex-end",
		marginBottom: 10,
	},
	receiptDateValue: {
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		marginLeft: 4,
		fontSize: 10,
		paddingBottom: 1,
		textAlign: "center",
	},
	statusBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 6,
	},
	statusItem: {
		fontSize: 9,
		flex: 1,
	},
});
