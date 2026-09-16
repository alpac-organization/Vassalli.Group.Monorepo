
export const approveButtonClass = "rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200";
export const rejectButtonClass = "rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200";
export const cancelButtonClass = "rounded-md! h-11 px-6! border border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/60 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-40";
export const pdfButtonClass = "rounded-md! h-11 px-6! border border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-500/20 hover:border-sky-400 dark:hover:border-sky-500/60 hover:text-sky-700 dark:hover:text-sky-300 disabled:opacity-40 shadow-sm transition-all duration-200";
export const sectionTitleClassName = "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";
export const viewImagesButtonClass = "rounded-md! h-9 px-3! text-[13px]! border border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-500/20";
import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";
import { Loader } from "@app/shared/components/loaders/loader";
export const getConfirmButtonClass = (type: ConfirmActionType) => {
	if (type === "APPROVE") return approveButtonClass;
	if (type === "REJECT") return rejectButtonClass;
	return cancelButtonClass;
};

export const getSuccessMessage = (type: ConfirmActionType) => {
	if (type === "APPROVE") return "Solicitud aprobada con éxito.";
	if (type === "REJECT") return "Solicitud rechazada con éxito.";
	return "Solicitud cancelada con éxito.";
};

export const getActionText = (type: ConfirmActionType) => {
	if (type === 'APPROVE') return "Aprobar";
	else if (type === 'REJECT') return "Rechazar";
	else if (type === 'CANCEL') return "Cancelar"
	else return null;
}

export const getConfirmQuestion = (type: ConfirmActionType) => {
	const action = getActionText(type);
	if (type === "APPROVE") return `La solicitud será aprovada y pasará al proceso de cotización ¿Está seguro de proceder a ${action} la Solicitud?`;
	else return `¿Está seguro de proceder a ${action} la Solicitud?`;
}

export const LoadingMessage = ({ isOpen, isLoading }: { isOpen: boolean, isLoading: boolean }) => {
	if (!isOpen) return null;
	if (!isLoading) return null;
	return <Loader title="Cargando detalle de la solicitud..." />;
}