import { Button } from "@alpac/shared/components/Button/Button"
import { Fragment, type CSSProperties } from "react"
import { InputField } from "../InputField/InputField"

export const LoginForm = function () {

    const handleClickEvent = () => {
        console.log("Testing")
    }

    const styles: CSSProperties = {
        border: "1px solid black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        borderRadius: "20px",
        width: "300px",
        gap: "10px",
    }

    const buttonSubmitStyles: CSSProperties = {
        width: "100%"
    } 

    return (
        <Fragment>
            <form style={styles}>
                <h1>Acceso</h1>
                <InputField label="Correo" name="email" placeholder="Ingresa tu correo electrónico" type="email" />
                <InputField label="Contraseña" name="password" placeholder="Ingresa tu contraseña" type="password" />
                <Button type="submit" label="Acceder" styles={buttonSubmitStyles} variant="primary" onClick={handleClickEvent} />
            </form>
        </Fragment>
    )
}