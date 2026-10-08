import { Button } from "@alpac/design-system";
import { UserRoundPlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import type { CustomerTabProps } from "@app/modules/warehouse/ui/warehouse-corinto/views/administrative-section-views/customer-tab/customer-tab.types";
import { CustomerModal } from "@app/modules/warehouse/ui/warehouse-corinto/views/administrative-section-views/customer-tab/components/customer-modal/customer-modal";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCustomer } from "@app/modules/customer/ui/hooks/useCustomer";
import { CustomerTable } from "@app/modules/warehouse/ui/warehouse-corinto/views/administrative-section-views/customer-tab/components/customer-table/customer-table";

export const CustomerTab = ({ }: CustomerTabProps) => {

	const { companyId, moduleCode } = useUserStore();

	const { GetCustomer } = useCustomer();

	const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

	const { data } = GetCustomer({ company_id: companyId, module_code: moduleCode });

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