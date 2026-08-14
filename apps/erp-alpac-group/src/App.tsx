import { createRoot } from "react-dom/client"
import { QueryClient } from "@tanstack/react-query"
import { createBrowserRouter } from "react-router-dom"
import { registerSW } from "virtual:pwa-register"

import Main from "@app/main"
import { MainRouter } from "@app/routers/main-router"
import { DatePickerProvider, ThemeProvider } from "@alpac/design-system"
import { InactivityProvider } from "@app/shared/providers/inactivity-provider"
import { MotionConfig } from "framer-motion"
import { withErrorElement } from "./shared/components/error-boundary/error-boundary.helper"

registerSW({ immediate: true })

const queryClient = new QueryClient()
const router = createBrowserRouter(withErrorElement(MainRouter));
const container = document.getElementById("root")!

const root = createRoot(container)

root.render(
   <ThemeProvider>
      <DatePickerProvider>
         <InactivityProvider />

         <MotionConfig reducedMotion="user">
            <Main
               router={router}
               queryClient={queryClient}
            />
         </MotionConfig>
      </DatePickerProvider>
   </ThemeProvider>
)