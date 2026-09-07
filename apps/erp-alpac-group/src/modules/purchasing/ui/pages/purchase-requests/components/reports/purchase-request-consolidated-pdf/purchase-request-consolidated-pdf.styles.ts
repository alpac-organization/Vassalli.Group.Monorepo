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
		marginBottom: 8,
	},
	headerLeft: {
		width: "26%",
		alignItems: "flex-start",
	},
	headerCenter: {
		width: "74%",
		alignItems: "center",
		justifyContent: "flex-start",
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
	documentTitle: {
		fontSize: 12,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		marginTop: 4,
	},
	requestType: {
		fontSize: 10,
		textAlign: "center",
		marginTop: 6,
	},
	periodLabel: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		marginTop: 4,
		marginBottom: 8,
	},
	table: {
		borderWidth: 1,
		borderColor: "#000",
		marginTop: 10,
		width: "100%",
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		minHeight: 20,
	},
	tableRowLast: {
		borderBottomWidth: 0,
	},
	cell: {
		borderRightWidth: 1,
		borderRightColor: "#000",
		paddingVertical: 5,
		paddingHorizontal: 5,
		fontSize: 9,
		justifyContent: "center",
	},
	cellLast: {
		borderRightWidth: 0,
	},
	headerText: {
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		fontSize: 9,
	},
	center: {
		textAlign: "center",
	},
	colQty: { width: "16%" },
	colDesc: { width: "48%" },
	colUnit: { width: "18%" },
	colCount: { width: "18%" },
	totalRow: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderTopColor: "#000",
		minHeight: 22,
		backgroundColor: "#f3f4f6",
	},
	totalLabel: {
		fontFamily: "Helvetica-Bold",
		fontSize: 9,
		paddingVertical: 5,
		paddingHorizontal: 5,
	},
	footer: {
		marginTop: 16,
		fontSize: 9,
	},
});
