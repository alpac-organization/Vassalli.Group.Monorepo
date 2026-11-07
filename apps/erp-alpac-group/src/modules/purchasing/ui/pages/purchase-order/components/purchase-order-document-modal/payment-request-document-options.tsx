import { Checkbox, InputText } from "@alpac/design-system";
import { DEFAULT_PAYMENT_REQUEST_CHECKLIST } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/payment-request-pdf/payment-request-pdf.checklist";

type PaymentRequestDocumentOptionsProps = {
	referenceNumber: string;
	onReferenceChange: (value: string) => void;
	checkedIds: ReadonlySet<string>;
	onToggleItem: (itemId: string) => void;
};

const labelClassName = "text-black! dark:text-white!";
const inputClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

export const PaymentRequestDocumentOptions = ({
	referenceNumber,
	onReferenceChange,
	checkedIds,
	onToggleItem,
}: PaymentRequestDocumentOptionsProps) => (
	<div className="flex flex-col gap-4">
		<InputText
			label="No. de referencia"
			placeholder="Ej. REF-2026-001"
			value={referenceNumber}
			onChange={(event) => onReferenceChange(event.target.value)}
			className={inputClassName}
			labelClassName={labelClassName}
		/>

		<div className="flex flex-col gap-2">
			<p className="m-0 text-sm font-medium text-slate-800 dark:text-white">
				Documentos a marcar en la solicitud
			</p>
			<p className="m-0 text-[12px] text-slate-500 dark:text-slate-400">
				Seleccione los ítems que deben aparecer marcados en el documento.
			</p>

			<div className="max-h-64 overflow-y-auto rounded-md border border-slate-200 bg-slate-50/80 p-3 dark:border-neutral-700 dark:bg-neutral-900/40">
				<div className="flex flex-col gap-4">
					{DEFAULT_PAYMENT_REQUEST_CHECKLIST.map((section) => (
						<div key={section.title} className="flex flex-col gap-2">
							<p className="m-0 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								{section.title}
							</p>
							<div className="flex flex-col gap-2">
								{section.items.map((item) => (
									<Checkbox
										key={item.id}
										label={item.description}
										checked={checkedIds.has(item.id)}
										onChange={() => onToggleItem(item.id)}
										labelClassName="text-[13px]! leading-snug! text-slate-700! dark:text-slate-200!"
										className="items-start!"
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	</div>
);
