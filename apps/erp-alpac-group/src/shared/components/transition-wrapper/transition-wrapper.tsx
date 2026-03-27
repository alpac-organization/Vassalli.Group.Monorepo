import { AnimatePresence } from "framer-motion"
import { Outlet, useLocation } from "react-router-dom"

export const TransitionWrapper = function () {

    const location = useLocation()

    return (
        <AnimatePresence mode="wait" key={location.pathname}>
            <Outlet />
        </AnimatePresence>
    )
}