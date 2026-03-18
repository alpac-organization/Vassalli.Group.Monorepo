import { Button, Dropdown } from "@alpac/design-system"
import { FormLayout } from "@app/shared/layouts/form-layout/form-layout"
import { Fragment } from "react"
import { CompanyEnum } from "@app/core/enums/company.enum"

export const SelectCompany = function (): JSX.Element {

    const options = Object.entries(CompanyEnum).map(([_, value]) => ({
        value,
        label: value,
    }));

    return (
        <Fragment>
            <FormLayout title="Selecciona tu empresa">
                <div className="flex flex-col gap-4">
                    <Dropdown
                        options={options}
                        placeholder="Selecciona una empresa"
                        isDynamic
                        company="ALPAC"
                    />
                    <Button
                        type="submit"
                        label="Acceder"
                        size="small"
                        company="ALPAC"
                        isDynamic={true}
                    />
                </div>
            </FormLayout>
        </Fragment>
    )
}