import { DatePicker, Dropdown, InputText } from "@alpac/design-system";

const datePickerLightTextFieldSlotProps = {
    textField: {
        className:
            "[&_.MuiOutlinedInput-input]:!text-black [&_.MuiPickersSectionList-root]:!text-black [&_.MuiPickersSectionList-section]:!text-black [&_.MuiPickersSectionList-sectionContent]:!text-black [&_.MuiSvgIcon-root]:!text-black [&_.MuiIconButton-root]:!text-black dark:[&_.MuiOutlinedInput-root]:!bg-white",
        sx: {
            color: "#000000",
            "& .MuiPickersSectionList-root": { color: "#000000" },
            "& .MuiPickersSectionList-section": { color: "#000000" },
            "& .MuiPickersSectionList-sectionContent": { color: "#000000" },
            "& .MuiPickersInputBase-root": { color: "#000000" },
            "& .MuiPickersSectionList-section.Mui-selected, & .MuiPickersSectionList-section[aria-selected='true']":
            {
                color: "#000000 !important",
            },
        },
    },
} as const;

export const GeneralInformation = () => {
    return (
        <>
            <h5 className="text-black mb-5!">Información General</h5>
            <div className="flex flex-row gap-4">

                <Dropdown
                    label="Tipo de operación"
                    isRequired
                    placeholder="Seleccione..."
                    options={[]}
                    appearance="dark"
                    labelClassName="text-black!"
                    valueClassName="text-black!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600!"
                />

                <Dropdown
                    label="Zafra"
                    isRequired
                    placeholder="Seleccione..."
                    options={[]}
                    appearance="dark"
                    labelClassName="text-black!"
                    valueClassName="text-black!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600!"
                />

                <InputText
                    label="Usuario Registra Inicial"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <DatePicker
                    fieldWidth="large"
                    label="Fecha de inicio"
                    className="w-full! rounded-md! text-[15px]! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                    slotProps={datePickerLightTextFieldSlotProps}
                    labelAbove
                    isRequired
                />

                <InputText
                    label="Usuario Registra Final"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

                <InputText
                    label="Voucher"
                    placeholder=""
                    isRequired
                    className="w-full! rounded-md! text-[15px]! text-black! dark:bg-white! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                    labelClassName="text-black!"
                />

            </div>
        </>
    );
}