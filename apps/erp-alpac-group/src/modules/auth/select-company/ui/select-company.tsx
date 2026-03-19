import { Button, Dropdown, LogoTicker } from "@alpac/design-system"
import { VerticalLayout } from "@app/shared/layouts";
import { FormLayout } from "@app/shared/layouts/form-layout/form-layout"
import { Fragment } from "react"
import alpacLogo from "@app/assets/logos/color/alpac.png"
import { CopyRight } from "@app/shared/components/copy-right/copy-right"
import { useGetCompanies } from "./hooks/useGetCompanies"

export const SelectCompany = function (): JSX.Element {

    const { data: companies = [] } = useGetCompanies()

    const options = companies.map((company) => ({
        value: company.company_id,
        label: company.alias,
    }));

    const logos = import.meta.glob("@app/assets/logos/blanco/*.png", { eager: true })

    const imageUrls = Object.values(logos).map((item: any) => item.default)

    return (
        <Fragment>
            <VerticalLayout className="h-screen">
                <VerticalLayout className="h-screen" align="center" justify="center">
                    <FormLayout className="w-[350px]" imageUrl={alpacLogo} title="Selecciona tu empresa">
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
                        className="w-full pt-20"
                        imageUrls={imageUrls}
                    />
                </VerticalLayout>
                <CopyRight />
            </VerticalLayout>
        </Fragment>
    )
}