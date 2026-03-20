import { Button, Dropdown, LogoTicker, InputSpinner } from "@alpac/design-system"
import { VerticalLayout } from "@app/shared/layouts";
import { FormLayout } from "@app/shared/layouts/form-layout/form-layout"
import { Fragment } from "react"
import { CopyRight } from "@app/shared/components/copy-right/copy-right"
import { useGetCompanies } from "./hooks/useGetCompanies"
import { useLoginRedirect } from "./hooks/useLoginRedirect";
import alpacLogo from "@app/assets/logos/color/alpac.png"
import { useForm } from "react-hook-form";

interface SelectCompanyForm {
    companyId: string
}

export const SelectCompany = function (): JSX.Element {

    // Init react-hook-form
    const { register, handleSubmit, formState: { isValid } } = useForm<SelectCompanyForm>({
        mode: "onChange",
        defaultValues: { companyId: "" }
    });

    // Get mutation from customized hook
    const { mutateAsync: redirect, isPending } = useLoginRedirect();

    const { data: companies = [], isLoading } = useGetCompanies()

    const options = companies.map((company) => ({
        value: company.company_id,
        label: company.alias,
    }));

    const logos = import.meta.glob("@app/assets/logos/blanco/*.png", { eager: true })

    const imageUrls = Object.values(logos).map((item: any) => item.default)

    const onSubmit = (data: SelectCompanyForm) => {
        redirect(data.companyId)
    }

    return (
        <Fragment>
            <VerticalLayout className="h-screen">
                <VerticalLayout className="h-screen" align="center" justify="center">
                    <FormLayout className="w-[350px]" imageUrl={alpacLogo} title="Selecciona tu empresa">
                        <form
                            className="relative flex flex-col gap-4"
                            onSubmit={handleSubmit(onSubmit)}>

                            {isLoading && (
                                <div className="absolute inset-y-0 top-[10px] left-[-30px] flex items-center">
                                    <InputSpinner size="medium" />
                                </div>
                            )}

                            <Dropdown
                                {...register("companyId", { required: true })}
                                options={options}
                                placeholder="Selecciona una empresa"
                                isDynamic
                                disabled={isLoading}
                                company="ALPAC"
                            />

                            <Button
                                type="submit"
                                label="Acceder"
                                size="small"
                                company="ALPAC"
                                isDynamic={true}
                                disabled={!isValid || isPending}
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