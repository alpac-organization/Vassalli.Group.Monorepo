const checklistItem = (id: string, description: string, checked: boolean) => ({ id, description, checked });

export const DEFAULT_PAYMENT_REQUEST_CHECKLIST = [
	{
		title: "DOCUMENTOS GENERALES",
		items: [
			checklistItem("signed-request", "Solicitud firmada por el departamento solicitante.", true),
			checklistItem("purchase-order", "Copia ( ) u original ( ) de orden de compra.", true),
			checklistItem("invoice", "Copia ( ) u original ( ) de factura, ND, NC o retención.", true),
			checklistItem("comparative", "Cuadro comparativo de cotizaciones y justificación.", true),
			checklistItem("quotes", "Cotizaciones efectuadas, cantidad (  ).", true),
			checklistItem("requisition", "Solicitud mensual/eventual o requisición autorizada.", true),
			checklistItem("exemption", "Carta de exoneración DGI ( ), ALMA ( ).", true),
			checklistItem("communications", "Comunicaciones relacionadas con el pago.", true),
			checklistItem("others", "Otros.", true),
		],
	},
	{
		title: "SERVICIOS",
		items: [
			checklistItem("contract", "Contrato original debidamente firmado.", true),
			checklistItem("budget", "Presupuesto del servicio (si aplica).", true),
			checklistItem("settlement", "Finiquito de servicio.", true),
		],
	},
] as const;
