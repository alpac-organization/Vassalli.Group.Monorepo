import { useState } from "react";
import { Badges, Button } from "@alpac/design-system";
import { CreditCardIcon, EditIcon, PlusIcon, StarIcon, Trash2Icon } from "lucide-react";
import type { BankAccountListProps } from "./bank-account-list.types";
import { BankAccountModal } from "../bank-account-modal/bank-account-modal";
import type {
	CreateSupplierBankAccountPayload,
	SupplierBankAccount,
} from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";

export const BankAccountList = ({
	accounts = [],
	onAddAccount,
	onEditAccount,
	onDeleteAccount,
	onSetPrimary,
	isLoading = false,
	readOnly = false,
}: BankAccountListProps) => {

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<{ account: SupplierBankAccount | CreateSupplierBankAccountPayload; index: number; } | null>(null);

	const handleOpenAdd = () => {
		setEditingItem(null);
		setIsModalOpen(true);
	};

	const handleOpenEdit = (
		account: SupplierBankAccount | CreateSupplierBankAccountPayload,
		index: number,
	) => {
		setEditingItem({ account, index });
		setIsModalOpen(true);
	};

	const handleSubmitAccount = (accountPayload: CreateSupplierBankAccountPayload) => {
		if (editingItem && onEditAccount) {
			const existingId = (editingItem.account as SupplierBankAccount).id;
			const mergedAccount = existingId
				? ({ ...accountPayload, id: existingId } as SupplierBankAccount)
				: accountPayload;
			onEditAccount(mergedAccount, editingItem.index);
		} else {
			onAddAccount(accountPayload);
		}
		setIsModalOpen(false);
		setEditingItem(null);
	};

	const formatAccountType = (type?: string | number) => {
		if (type === "Savings" || type === 1) return "Ahorro";
		if (type === "Checking" || type === 2) return "Corriente";
		return String(type ?? "—");
	};

	const formatCurrency = (currency?: string | number) => {
		if (currency === "USD" || currency === 2) return "USD ($)";
		if (currency === "NIO" || currency === 1) return "Córdobas (C$)";
		return String(currency ?? "—");
	};

	return (
		<div className="flex w-full min-w-0 max-w-full flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2">
					<CreditCardIcon size={20} className="text-slate-500 dark:text-slate-300" />
					<h4 className="m-0 text-base font-semibold text-slate-800 dark:text-white">
						Cuentas Bancarias
					</h4>
					<span className="text-xs text-slate-500 dark:text-slate-400">
						({accounts.length})
					</span>
				</div>

				{!readOnly && (
					<Button
						type="button"
						size="medium"
						label="Agregar cuenta"
						icon={<PlusIcon size={16} />}
						onClick={handleOpenAdd}
						disabled={isLoading}
						className="w-full rounded-md! bg-alpac-primary-500 text-xs! text-white! dark:bg-alpac-primary-700! sm:w-auto"
					/>
				)}
			</div>

			{accounts.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-6 text-center dark:border-neutral-700">
					<CreditCardIcon size={32} className="text-slate-400 dark:text-slate-500 mb-2" />
					<p className="m-0 text-sm text-slate-600 dark:text-slate-400">
						No hay cuentas bancarias registradas para este proveedor.
					</p>
					{!readOnly && (
						<p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
							Haga clic en &quot;Agregar cuenta&quot; para asociar una cuenta bancaria.
						</p>
					)}
				</div>
			) : (
				<div className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-slate-200 dark:border-neutral-700">
					<table className="w-full min-w-176 text-left text-sm text-slate-700 dark:text-slate-300">
						<thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-600 dark:bg-neutral-800 dark:text-slate-400">
							<tr>
								<th className="whitespace-nowrap px-4 py-3">Banco</th>
								<th className="whitespace-nowrap px-4 py-3">N° Cuenta</th>
								<th className="whitespace-nowrap px-4 py-3">Tipo</th>
								<th className="whitespace-nowrap px-4 py-3">Moneda</th>
								<th className="whitespace-nowrap px-4 py-3">Titular</th>
								<th className="whitespace-nowrap px-4 py-3 text-center">Principal</th>
								{!readOnly && <th className="whitespace-nowrap px-4 py-3 text-right">Acciones</th>}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 dark:divide-neutral-700">
							{accounts.map((acc, index) => {
								const isPrimary = Boolean(acc.is_primary);
								return (
									<tr
										key={(acc as SupplierBankAccount).id || `${acc.account_number}-${index}`}
										className="hover:bg-slate-50 dark:hover:bg-neutral-800/50"
									>
										<td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
											{acc.bank_name}
										</td>
										<td className="px-4 py-3 font-mono text-xs">
											{acc.account_number}
										</td>
										<td className="px-4 py-3">
											{formatAccountType(acc.account_type)}
										</td>
										<td className="px-4 py-3 font-medium">
											{formatCurrency(acc.currency)}
										</td>
										<td className="px-4 py-3">
											<div>{acc.account_holder_name}</div>
											{acc.account_holder_identification && (
												<div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
													{acc.account_holder_identification}
												</div>
											)}
										</td>
										<td className="px-4 py-3 text-center">
											{isPrimary ? (
												<span className="inline-flex items-center gap-1">
													<Badges
														label="Principal"
														color="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
													/>
												</span>
											) : (
												!readOnly && onSetPrimary && (
													<button
														type="button"
														onClick={() => onSetPrimary(acc, index)}
														title="Establecer como principal"
														className="text-xs text-slate-400 hover:text-amber-500 flex items-center gap-1 mx-auto cursor-pointer"
													>
														<StarIcon size={14} />
														<span>Hacer principal</span>
													</button>
												)
											)}
										</td>
										{!readOnly && (
											<td className="px-4 py-3 text-right">
												<div className="flex items-center justify-end gap-2">
													{onEditAccount && (
														<button
															type="button"
															onClick={() => handleOpenEdit(acc, index)}
															title="Editar cuenta"
															className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer"
														>
															<EditIcon size={16} />
														</button>
													)}
													<button
														type="button"
														onClick={() => onDeleteAccount(acc, index)}
														title="Eliminar cuenta"
														className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer"
													>
														<Trash2Icon size={16} />
													</button>
												</div>
											</td>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}

			<BankAccountModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setEditingItem(null);
				}}
				onSubmit={handleSubmitAccount}
				editingAccount={editingItem?.account as SupplierBankAccount | null}
				isLoading={isLoading}
			/>
		</div>
	);
};
