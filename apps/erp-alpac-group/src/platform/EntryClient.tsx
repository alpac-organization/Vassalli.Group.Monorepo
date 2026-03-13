import { hydrateRoot } from "react-dom/client"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { createBrowserRouter } from "react-router-dom"

import Main from "@alpac/main"
import { MainRoutes } from "@alpac/routers/main-routes"

const queryClient = new QueryClient()
const router = createBrowserRouter(MainRoutes)
const container = document.getElementById("root")!

hydrateRoot(container, <Main router={router} queryClient={queryClient} dehydratedState={dehydrate(queryClient)} />)