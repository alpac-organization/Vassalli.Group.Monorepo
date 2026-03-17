import { Button } from "@app/shared/components/Button/Button"
// import { Button } from "@alpac/design-system"
import { type CSSProperties } from "react"
import { InputField } from "../InputField/InputField"
import { FormLayout } from "@app/shared/layouts/FormLayout/FormLayout"

export const LoginForm = function () {

    const handleClickEvent = () => {
        console.log("Testing")
    }

    const buttonSubmitStyles: CSSProperties = {
        width: "100%",
    }

    return (
        <FormLayout>
            <form>
                <h2>Acceso</h2>
                <InputField label="Correo" name="email" placeholder="Ingresa tu correo electrónico" type="email" />
                <InputField label="Contraseña" name="password" placeholder="Ingresa tu contraseña" type="password" />
                <Button type="submit" label="Acceder" styles={buttonSubmitStyles} variant="primary" onClick={handleClickEvent} />
            </form>
        </FormLayout>
    )
}