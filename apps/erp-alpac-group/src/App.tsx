import { createRoot } from "react-dom/client"
import { QueryClient } from "@tanstack/react-query"
import { createBrowserRouter } from "react-router-dom"

import Main from "@app/main"
import { MainRoutes } from "@app/routers/main-routes"
import { ThemeProvider } from "@alpac/design-system"
import { InactivityProvider } from "@app/shared/providers/inactivity-provider"
import { MotionConfig } from "framer-motion"

const queryClient = new QueryClient()
const router = createBrowserRouter(MainRoutes)
const container = document.getElementById("root")!


const root = createRoot(container)

root.render(
   <ThemeProvider>
      <InactivityProvider />

      <MotionConfig reducedMotion="user">
         <Main
            router={router}
            queryClient={queryClient}
         />
      </MotionConfig>

   </ThemeProvider>
)