import { Button } from "@alpac/design-system";
import { BoxesIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { OperationTable } from "./components/operation-table/operation-table";
import type { OperationTabProps } from "./operation-tab.types";
import { StartOperationModal } from "./components/start-operation-modal/start-operation-modal";

export const OperationTab = ({ tabId }: OperationTabProps) => {

	const [isStartOperationOpen, setIsStartOperationOpen] = useState(false);

	const handleBeginOperation = useCallback(() => {
		setIsStartOperationOpen(true);
	}, []);

	return (
		<div>
			<Button
				type="button"
				size="giant"
				label="Iniciar Nueva Operación"
				icon={<BoxesIcon size={20} />}
				className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				onClick={handleBeginOperation}
			/>

			<OperationTable data={[]} />

			<StartOperationModal
				isOpen={isStartOperationOpen}
				onSubmit={(data) => { console.log(data) }}
				onClose={() => { setIsStartOperationOpen(false) }}
			/>
		</div>
	);
}