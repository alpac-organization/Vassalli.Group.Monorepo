import { Button, InputGroup } from "@alpac/design-system"
import { FormLayout } from "@app/shared/layouts/form-layout/form-layout"
import { useAuthenticate } from "@app/modules/auth/login/ui/hooks/useAuthenticate"
import { useForm } from "react-hook-form"
import type { LoginFormData } from "./login-form.type"

export const LoginForm = function () {
    const { mutate, isPending } = useAuthenticate()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        defaultValues: {
            username: "",
            password: ""
        }
    })
    const onSubmit = (data: LoginFormData) => {
        mutate(data)
    }

    return (
        <FormLayout className="h-dvh">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="dark:text-[#2e2e2e]!">Acceso</h2>
                <InputGroup
                    label="Correo"
                    placeholder="Ingresa tu correo electrónico o nombre de usuario"
                    type="text"
                    isDynamic={true}
                    error={errors.username?.message}
                    {...register("username", {
                        required: "El correo o nombre de usuario requerido",
                    })}
                />
                <InputGroup
                    label="Contraseña"
                    placeholder="Ingresa tu contraseña"
                    type="password"
                    isDynamic={true}
                    className="mb-2.5"
                    error={errors.password?.message}
                    {...register("password", {
                        required: "La contraseña es requerida",
                    })}
                />
                <Button
                    type="submit"
                    label={isPending ? "Cargando..." : "Acceder"}
                    disabled={isPending}
                    size="small"
                    company="ALPAC"
                    isDynamic={true}
                />
            </form>
        </FormLayout>
    )
}