import "@alpac/design-system/styles/global.css";
import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface MainProps {
  router: any;
  queryClient: QueryClient;
}

export default function Main({ router, queryClient }: MainProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
