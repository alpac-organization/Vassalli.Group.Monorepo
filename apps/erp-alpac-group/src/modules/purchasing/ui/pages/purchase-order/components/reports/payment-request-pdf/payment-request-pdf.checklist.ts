export const DEFAULT_PAYMENT_REQUEST_CHECKLIST = [
	{
		title: "DOCUMENTOS GENERALES",
		items: [
			{
				id: "signed-request",
				description: "Solicitud firmada por el departamento solicitante.",
				checked: true,
			},
			{
				id: "purchase-order",
				description: "Copia ( ) u original ( ) de orden de compra.",
				checked: true,
			},
			{
				id: "invoice",
				description: "Copia ( ) u original ( ) de factura, ND, NC o retención.",
				checked: true,
			},
			{
				id: "comparative",
				description: "Cuadro comparativo de cotizaciones y justificación.",
				checked: true,
			},
			{
				id: "quotes",
				description: "Cotizaciones efectuadas, cantidad (  ).",
				checked: true,
			},
			{
				id: "requisition",
				description: "Solicitud mensual/eventual o requisición autorizada.",
				checked: true,
			},
			{
				id: "exemption",
				description: "Carta de exoneración DGI ( ), ALMA ( ).",
				checked: true,
			},
			{
				id: "communications",
				description: "Comunicaciones relacionadas con el pago.",
				checked: true,
			},
			{
				id: "others",
				description: "Otros.",
				checked: true,
			},
		],
	},
	{
		title: "SERVICIOS",
		items: [
			{
				id: "contract",
				description: "Contrato original debidamente firmado.",
				checked: true,
			},
			{
				id: "budget",
				description: "Presupuesto del servicio (si aplica).",
				checked: true,
			},
			{
				id: "settlement",
				description: "Finiquito de servicio.",
				checked: true,
			},
		],
	},
] as const;
