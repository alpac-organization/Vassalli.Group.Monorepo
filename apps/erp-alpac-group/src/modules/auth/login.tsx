import { LoginForm } from "@alpac/shared/components/LoginForm/LoginForm"
import { Fragment, type CSSProperties } from "react"

export const Login = function () {
    const styles: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100dvh",
    }

    return (
        <Fragment>
            <div style={styles}>
                <LoginForm  />
            </div>
        </Fragment>
    )
}