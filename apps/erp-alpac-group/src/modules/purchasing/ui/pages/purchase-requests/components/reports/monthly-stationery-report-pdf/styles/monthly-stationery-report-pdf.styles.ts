import { StyleSheet } from "@react-pdf/renderer";

export const monthlyStationeryReportPdfStyle = StyleSheet.create({
	page: {
		paddingTop: 16,
		paddingBottom: 16,
		paddingHorizontal: 14,
		fontSize: 6.5,
		fontFamily: "Helvetica",
		color: "#000",
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	headerLeft: {
		width: "14%",
		alignItems: "flex-start",
	},
	headerCenter: {
		width: "72%",
		alignItems: "center",
		justifyContent: "center",
	},
	headerRight: {
		width: "14%",
	},
	logo: {
		width: 42,
		height: 42,
		objectFit: "contain",
	},
	documentTitle: {
		fontSize: 10,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		letterSpacing: 0.3,
	},
	table: {
		borderWidth: 0.5,
		borderColor: "#000",
		width: "100%",
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 0.5,
		borderBottomColor: "#000",
		minHeight: 12,
	},
	tableRowLast: {
		borderBottomWidth: 0,
	},
	headerRowBg: {
		backgroundColor: "#4a4a4a",
	},
	cell: {
		borderRightWidth: 0.5,
		borderRightColor: "#000",
		paddingVertical: 2,
		paddingHorizontal: 2,
		fontSize: 6,
		justifyContent: "center",
	},
	cellLast: {
		borderRightWidth: 0,
	},
	headerText: {
		fontFamily: "Helvetica-Bold",
		fontSize: 6,
		color: "#ffffff",
		textAlign: "center",
	},
	textLeft: {
		textAlign: "left",
	},
	textRight: {
		textAlign: "right",
	},
	textCenter: {
		textAlign: "center",
	},
	colMonth: { width: "6%" },
	colYear: { width: "4.5%" },
	colKey: { width: "5.5%" },
	colRequestType: { width: "7%" },
	colBranch: { width: "7%" },
	colArea: { width: "11%" },
	colSupplier: { width: "10%" },
	colDescription: { width: "16%" },
	colQty: { width: "5.5%" },
	colUnitPrice: { width: "7.5%" },
	colTotalPrice: { width: "8%" },
	colInvoice: { width: "12%" },
	summaryWrap: {
		marginTop: 6,
		alignItems: "flex-end",
	},
	summaryTable: {
		width: "28%",
		borderWidth: 0.5,
		borderColor: "#000",
	},
	summaryRow: {
		flexDirection: "row",
		borderBottomWidth: 0.5,
		borderBottomColor: "#000",
		minHeight: 12,
	},
	summaryRowLast: {
		borderBottomWidth: 0,
	},
	summaryLabel: {
		width: "42%",
		borderRightWidth: 0.5,
		borderRightColor: "#000",
		paddingVertical: 2,
		paddingHorizontal: 3,
		fontFamily: "Helvetica-Bold",
		fontSize: 6.5,
		justifyContent: "center",
	},
	summaryCurrency: {
		width: "16%",
		borderRightWidth: 0.5,
		borderRightColor: "#000",
		paddingVertical: 2,
		paddingHorizontal: 2,
		fontSize: 6.5,
		textAlign: "center",
		justifyContent: "center",
	},
	summaryAmount: {
		width: "42%",
		paddingVertical: 2,
		paddingHorizontal: 3,
		fontSize: 6.5,
		textAlign: "right",
		justifyContent: "center",
	},
});
