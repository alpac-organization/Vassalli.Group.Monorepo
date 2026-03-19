import { Button, Dropdown, LogoTicker } from "@alpac/design-system"
import { CompanyEnum } from "@app/core/enums/company.enum";
import { VerticalLayout } from "@app/shared/layouts";
import { FormLayout } from "@app/shared/layouts/form-layout/form-layout"
import { Fragment } from "react"
import alpacLogo from "@app/assets/logos/alpac.png"

export const SelectCompany = function (): JSX.Element {

    const options = Object.entries(CompanyEnum).map(([_, value]) => ({
        value,
        label: value,
    }));

    const logos = import.meta.glob("@app/assets/logos/*.png", { eager: true })

    const imageUrls = Object.values(logos).map((item: any) => item.default)

    return (
        <Fragment>
            <VerticalLayout className="h-screen" align="center" justify="center">
                <FormLayout className="w-full" imageUrl={alpacLogo} title="Selecciona tu empresa">
                    <form className="flex flex-col gap-4">
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
                    </form>
                </FormLayout>
                <LogoTicker
                    title="Empresas del grupo"
                    className="w-full"
                    imageUrls={imageUrls}
                />
            </VerticalLayout>
        </Fragment>
    )
}