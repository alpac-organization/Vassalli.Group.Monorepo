import { renderToString } from "react-dom/server"
import { createMemoryRouter } from "react-router-dom"
import { QueryClient, dehydrate } from "@tanstack/react-query"

import Main from "@alpac/Main"
import { MainRoutes } from "@alpac/routers/main-routes"

export async function render(url: string) {
   const queryClient = new QueryClient()

   const router = createMemoryRouter(MainRoutes, { initialEntries: [url] })

   const appHtml = renderToString(
      <Main router={router} queryClient={queryClient} dehydratedState={dehydrate(queryClient)} />
   )

  return { appHtml, dehydratedState: dehydrate(queryClient) }
}