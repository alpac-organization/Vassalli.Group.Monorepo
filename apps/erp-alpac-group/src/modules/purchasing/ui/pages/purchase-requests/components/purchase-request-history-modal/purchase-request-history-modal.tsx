import { Avatar, Modal } from "@alpac/design-system";
import { History } from "lucide-react";
import { UserStatusRecord, type UserStatusKey } from "@app/shared/enum/user-status";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { HistoryModalProps, PurchaseRequestHistoryModalProps } from "./purchase-request-history-modal.types";

const numericUserStatus = ["Active", "Inactive", "Locked"] as const satisfies readonly UserStatusKey[];

const formatUserStatus = (status?: UserStatusKey | number | null) => {
	if (status == null) return "—";

	if (typeof status === "number") {
		const key = numericUserStatus[status];
		return key ? UserStatusRecord[key] : "—";
	}

	if (status in UserStatusRecord) return UserStatusRecord[status];
	return "—";
};

const HistoryUser = ({ user }: { user?: UserInformation | null }) => {
	const fullname = user?.fullname?.trim() || "—";
	const email = user?.email?.trim() || "—";
	const pictureUrl = user?.picture_url?.trim();
	const workArea = user?.work_area_information?.work_area_name?.trim() || "Sin área";
	const status = formatUserStatus(user?.user_status);

	return (
		<div className="flex min-w-0 items-start">
			<div className="mr-6 shrink-0">
				<Avatar label={fullname} pictureUrl={pictureUrl} hasLabel={false} />
			</div>
			<div className="min-w-0">
				<div className="font-medium text-slate-900 dark:text-white">{fullname}</div>
				<div className="text-xs text-slate-500 dark:text-slate-400">{email}</div>
				<div className="text-xs text-slate-500 dark:text-slate-400">Área: {workArea}</div>
				<div className="text-xs text-slate-500 dark:text-slate-400">Estado: {status}</div>
			</div>
		</div>
	);
};

const formatHistoryDate = (value: string) => {
	const datePart = value.split("T")[0] ?? value;
	return formatDateToSpanishWords(datePart) || value;
};

const HistoryEmptyState = () => (
	<div
		role="status"
		className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center dark:border-red-400 dark:bg-red-500/20 sm:px-6 sm:py-10"
	>
		<div className="flex max-w-sm flex-col gap-1">
		<div className="flex items-center gap-1 justify-center">

		<span className="flex h-12 w-12 items-center justify-center rounded-full bg-alpac-primary-500/10 text-alpac-primary-600 dark:text-alpac-primary-300">
			<History size={24} aria-hidden/>
		</span>
			<h3 className="m-0 text-[15px] font-semibold text-slate-900 dark:text-white">
				Sin historial
			</h3>
		</div>
			<p className="m-0 text-sm text-slate-500 dark:text-slate-300">
				Aún no hay cambios registrados para esta solicitud.
			</p>
		</div>
	</div>
);

const HistoryModal = ({
	isOpen,
	onClose,
	children,
	isEmpty	
}: HistoryModalProps) => {

	return (

		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEmpty ? "" : "Historial"}
			variant="default"
			size="5xl"
			panelClassName={[
				"flex max-h-[min(94dvh,40rem)] flex-col overflow-hidden",
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col">

			{children}
		</Modal>
	);
}

export const PurchaseRequestHistoryModal = ({
	isOpen,
	onClose,
	history,
}: PurchaseRequestHistoryModalProps) => {	
	const entries = [...(history ?? [])].reverse();	
	const isEmpty:boolean = entries.length === 0;
	if (isEmpty ) {
		return (
			<HistoryModal isOpen={isOpen} onClose={onClose} isEmpty={isEmpty} >
				<HistoryEmptyState />
			</HistoryModal>
		)
	}

	return (
		<HistoryModal isOpen={isOpen} onClose={onClose} isEmpty={isEmpty} >

			<div className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-slate-200 dark:border-neutral-700">
				<table className="w-full min-w-176 text-left text-sm text-slate-700 dark:text-slate-300">
					<thead
						className="bg-slate-100 text-xs font-semibold uppercase text-slate-600 dark:bg-neutral-800 dark:text-slate-400">
						<tr>
							<th className="whitespace-nowrap px-4 py-3">Descripción</th>
							<th className="whitespace-nowrap px-4 py-3">Valor anterior</th>
							<th className="whitespace-nowrap px-4 py-3">Valor nuevo</th>
							<th className="whitespace-nowrap px-4 py-3">Fecha</th>
							<th className="whitespace-nowrap px-4 py-3">Usuario</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-200 dark:divide-neutral-700">
						{entries.map((entry, index) => {
							return (
								<tr
									key={`${entry.updated_at}-${entry.user_information?.user_id ?? index}`}
									className="hover:bg-slate-50 dark:hover:bg-neutral-800/50"
								>
									<td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
										{entry.description?.trim() || "—"}
									</td>
									<td className="max-w-56 px-4 py-3 wrap-break-word">
										{entry.old_fields?.trim() || "—"}
									</td>
									<td className="max-w-56 px-4 py-3 wrap-break-word">
										{entry.new_field?.trim() || "—"}
									</td>
									<td className="whitespace-nowrap px-4 py-3">
										{formatHistoryDate(entry?.updated_at ?? "")}
									</td>
									<td className="px-4 py-3">
										<HistoryUser user={entry.user_information} />
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

		</HistoryModal>
	);
};
