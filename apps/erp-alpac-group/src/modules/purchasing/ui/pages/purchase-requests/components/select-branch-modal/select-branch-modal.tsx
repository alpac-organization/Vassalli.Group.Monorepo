import { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, Modal } from "@alpac/design-system";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { SelectBranchModalProps } from "./select-branch-modal.types";

export const SelectBranchModal = ({
	isOpen,
	onClose,
	onConfirm,
	currentBranchId = null,
}: SelectBranchModalProps) => {

	const { companyId } = useUserStore();
	const [selectedBranch, setSelectedBranch] = useState<string | null>(currentBranchId);

	const { GetBranchesQuery: branchesQuery } = useCompanies({
		company_id: companyId,
	});

	const branchOptions = useMemo(() => {
		return (branchesQuery.data ?? []).map((branch) => ({
			label: branch.branch_name,
			value: branch.branch_id,
		}));
	}, [branchesQuery.data]);

	useEffect(() => {
		if (isOpen) {
			setSelectedBranch(currentBranchId);
		}
	}, [isOpen, currentBranchId]);

	const selectedOption = branchOptions.find(
		(option) => option.value === selectedBranch,
	);
	const isConfirmDisabled =
		!selectedBranch || !selectedOption || branchesQuery.isLoading;

	const handleConfirm = () => {
		if (!selectedBranch || !selectedOption) return;
		onConfirm(selectedBranch, selectedOption.label);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="default"
			size="sm"
			title="Seleccionar sucursal"
			description="Seleccione la sucursal para consultar las solicitudes de compra."
		>
			<div className="mt-4 flex flex-col gap-4">
				<Dropdown
					label="Sucursal"
					isRequired
					placeholder={
						branchesQuery.isLoading
							? "Cargando sucursales..."
							: "Seleccione una sucursal"
					}
					options={branchOptions}
					value={selectedBranch || undefined}
					appearance="dark"
					labelClassName="text-white!"
					onChange={(value) => {
						setSelectedBranch(String(value));
					}}
				/>
			</div>
			<div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
				<Button
					type="button"
					size="giant"
					label="Consultar"
					onClick={handleConfirm}
					disabled={isConfirmDisabled}
					className="w-full! min-h-12! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
				/>
				<Button
					type="button"
					size="giant"
					label="Cancelar"
					onClick={onClose}
					className="w-full! min-h-12! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
				/>
			</div>
		</Modal>
	);
};
