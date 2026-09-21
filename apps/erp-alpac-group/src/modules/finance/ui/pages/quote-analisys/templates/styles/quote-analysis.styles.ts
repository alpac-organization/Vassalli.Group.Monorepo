import { StyleSheet } from "@react-pdf/renderer";

export const quoteAnalysisPdfStyles = StyleSheet.create({
	page: {
		paddingTop: 16,
		paddingBottom: 20,
		paddingHorizontal: 16,
		fontSize: 7,
		fontFamily: "Helvetica",
		color: "#000",
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	headerLeft: {
		width: "18%",
		alignItems: "flex-start",
	},
	headerCenter: {
		width: "64%",
		alignItems: "center",
		justifyContent: "center",
	},
	headerRight: {
		width: "18%",
	},
	logo: {
		width: 52,
		height: 52,
		objectFit: "contain",
	},
	documentTitle: {
		fontSize: 12,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
		textTransform: "uppercase",
	},
	dateLine: {
		fontSize: 8,
		marginTop: 4,
		textAlign: "center",
	},
	table: {
		borderWidth: 1,
		borderColor: "#000",
		width: "100%",
	},
	row: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		minHeight: 16,
	},
	rowLast: {
		borderBottomWidth: 0,
	},
	cell: {
		borderRightWidth: 1,
		borderRightColor: "#000",
		paddingVertical: 3,
		paddingHorizontal: 2,
		justifyContent: "center",
	},
	cellLast: {
		borderRightWidth: 0,
	},
	cellCenter: {
		textAlign: "center",
	},
	cellBold: {
		fontFamily: "Helvetica-Bold",
	},
	headerCell: {
		fontFamily: "Helvetica-Bold",
		fontSize: 7,
		textAlign: "center",
	},
	subHeaderCell: {
		fontFamily: "Helvetica-Bold",
		fontSize: 6,
		textAlign: "center",
	},
	bodyText: {
		fontSize: 6.5,
	},
	totalsLabel: {
		fontFamily: "Helvetica-Bold",
		fontSize: 7,
		textAlign: "right",
		paddingRight: 4,
	},
	sectionGap: {
		marginTop: 10,
	},
	qualLabel: {
		fontFamily: "Helvetica-Bold",
		fontSize: 7,
		paddingHorizontal: 4,
	},
	qualHeader: {
		fontFamily: "Helvetica-Bold",
		fontSize: 7,
		textAlign: "center",
	},
	closingBlock: {
		marginTop: 10,
		borderWidth: 1,
		borderColor: "#000",
	},
	closingRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		minHeight: 18,
	},
	closingRowLast: {
		borderBottomWidth: 0,
		minHeight: 48,
	},
	closingLabel: {
		width: "28%",
		borderRightWidth: 1,
		borderRightColor: "#000",
		paddingVertical: 4,
		paddingHorizontal: 4,
		fontFamily: "Helvetica-Bold",
		fontSize: 7,
		justifyContent: "center",
	},
	closingValue: {
		width: "72%",
		paddingVertical: 4,
		paddingHorizontal: 4,
		fontSize: 7,
		justifyContent: "flex-start",
	},
	signatures: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 28,
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
	signatureName: {
		fontSize: 8,
		fontFamily: "Helvetica-Bold",
		textAlign: "center",
	},
	signatureRole: {
		fontSize: 7,
		textAlign: "center",
		marginTop: 2,
	},
});
