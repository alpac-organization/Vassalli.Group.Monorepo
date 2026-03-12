
import { RouterProvider } from "react-router-dom"
import { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClientProvider, Hydrate } from "@tanstack/react-query"

import type { DehydratedState } from "@tanstack/react-query"

interface MainProps {
   router: any
   queryClient: QueryClient
   dehydratedState?: DehydratedState
}

export default function Main({ router, queryClient, dehydratedState }: MainProps) {
   return (
      <QueryClientProvider client={queryClient}>
         
         <Hydrate state={dehydratedState}>

            <RouterProvider router={router} />

            <ReactQueryDevtools initialIsOpen={false} />
            
         </Hydrate>

      </QueryClientProvider>
   )
}