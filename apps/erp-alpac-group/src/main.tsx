import "./styles/global.css"
// import "@alpac/design-system"
import { RouterProvider } from "react-router-dom"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { useEffect } from "react"

interface MainProps {
   router: any
   queryClient: QueryClient
}

export default function Main({ router, queryClient }: MainProps) {

   useEffect(() => {
      document.body.setAttribute('data-theme', 'dark')
   }, [])

   return (

      <QueryClientProvider client={queryClient}>

         <RouterProvider router={router} />

         <ReactQueryDevtools initialIsOpen={false} />

      </QueryClientProvider>

   )
}