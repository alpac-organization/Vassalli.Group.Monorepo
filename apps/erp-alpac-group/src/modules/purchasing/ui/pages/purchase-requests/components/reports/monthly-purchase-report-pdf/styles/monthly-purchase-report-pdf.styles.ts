import { StyleSheet } from "@react-pdf/renderer";

export const monthlyPurchaseReportPdfStyles = StyleSheet.create({
	page: {
		paddingTop: 18,
		paddingBottom: 24,
		paddingHorizontal: 16,
		fontSize: 7,
		fontFamily: "Helvetica",
		color: "#111",
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	headerLeft: {
		width: "18%",
		alignItems: "flex-start",
	},
	headerCenter: {
		width: "82%",
		alignItems: "center",
		justifyContent: "center",
		paddingRight: "18%",
	},
	logo: {
		width: 52,
		height: 52,
		objectFit: "contain",
	},
	documentTitle: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		textTransform: "uppercase",
		letterSpacing: 0.3,
	},
	table: {
		borderWidth: 1,
		borderColor: "#000",
		width: "100%",
	},
	tableHeaderRow: {
		flexDirection: "row",
		backgroundColor: "#1f2937",
		minHeight: 18,
		alignItems: "center",
	},
	tableRow: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderTopColor: "#000",
		minHeight: 16,
		alignItems: "center",
	},
	headerText: {
		color: "#fff",
		fontFamily: "Helvetica-Bold",
		fontSize: 6.5,
		textAlign: "center",
	},
	cell: {
		paddingVertical: 2,
		paddingHorizontal: 2,
		borderRightWidth: 1,
		borderRightColor: "#000",
		fontSize: 6.5,
	},
	cellLast: {
		borderRightWidth: 0,
	},
	center: {
		textAlign: "center",
	},
	right: {
		textAlign: "right",
	},
	left: {
		textAlign: "left",
	},
	colMes: { width: "6%" },
	colAnio: { width: "5%" },
	colLlave: { width: "6%" },
	colTp: { width: "8%" },
	colSede: { width: "12%" },
	colArea: { width: "12%" },
	colProveedor: { width: "12%" },
	colDesc: { width: "17%" },
	colCant: { width: "6%" },
	colPu: { width: "8%" },
	colPt: { width: "8%" },
	summaryWrap: {
		marginTop: 10,
		alignItems: "flex-end",
	},
	summaryBox: {
		width: 180,
		borderWidth: 1,
		borderColor: "#000",
	},
	summaryRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		minHeight: 16,
		alignItems: "center",
	},
	summaryRowLast: {
		borderBottomWidth: 0,
	},
	summaryLabel: {
		width: "45%",
		paddingHorizontal: 4,
		paddingVertical: 2,
		fontFamily: "Helvetica-Bold",
		fontSize: 7,
		borderRightWidth: 1,
		borderRightColor: "#000",
	},
	summaryValue: {
		width: "55%",
		paddingHorizontal: 4,
		paddingVertical: 2,
		fontSize: 7,
		textAlign: "right",
	},
	emptyState: {
		marginTop: 24,
		textAlign: "center",
		fontSize: 10,
	},
});
