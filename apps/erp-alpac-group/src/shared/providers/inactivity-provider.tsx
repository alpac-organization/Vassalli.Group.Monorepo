
import { useCallback, useEffect, useRef } from "react"
import { useInactivityStore } from "@app/shared/stores/useInactivityStore"

export const InactivityProvider = ({ timeout = 600_000 }) => {

    const { setIsInactive } = useInactivityStore()

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const resetTimer = useCallback(() => {

        setIsInactive(false, 0)

        if (timerRef.current) clearTimeout(timerRef.current)

        timerRef.current = setTimeout(() => {

            setIsInactive(true, timeout)

        }, timeout)

    }, [setIsInactive, timeout])

    useEffect(() => {

        const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "wheel"]

        const handleActivity = () => resetTimer()

        events.forEach(event => window.addEventListener(event, handleActivity))

        resetTimer()

        return () => {

            events.forEach(event => window.removeEventListener(event, handleActivity))

            if (timerRef.current) clearTimeout(timerRef.current)
        }

    }, [resetTimer])

    return null
}