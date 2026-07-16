import { Button } from "@alpac/design-system";
import { UserRoundPlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import type { CustomerTabProps } from "./customer-tab.types";
import { CustomerModal } from "./components/customer-modal/customer-modal";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCustomer } from "@app/modules/warehouse/ui/hooks/useCustomer";
import { CustomerTable } from "./components/customer-table/customer-table";

export const CustomerTab = ({ tabId }: CustomerTabProps) => {

	const { companyId } = useUserStore();

	const { GetCustomer } = useCustomer();

	const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

	const { data } = GetCustomer({ company_id: companyId });

	const handleCreateCustomer = useCallback(() => {
		setIsCustomerModalOpen(true);
	}, []);

	return (
		<div>
			<Button
				type="button"
				size="giant"
				label="Registrar Cliente Nuevo"
				icon={<UserRoundPlusIcon size={20} />}
				className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				onClick={handleCreateCustomer}
			/>

			<CustomerTable data={data} />

			<CustomerModal
				isOpen={isCustomerModalOpen}
				onSubmit={(data) => { console.log(data) }}
				onClose={() => { setIsCustomerModalOpen(false) }}
			/>
		</div>
	);
}