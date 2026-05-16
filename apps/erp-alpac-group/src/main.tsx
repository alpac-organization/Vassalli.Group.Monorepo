import "@alpac/design-system/styles/global.css";
import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalServerErrorProvider } from "@app/shared/providers/global-server-error-provider";

interface MainProps {
  router: any;
  queryClient: QueryClient;
}

export default function Main({ router, queryClient }: MainProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalServerErrorProvider>
        <RouterProvider router={router} />
      </GlobalServerErrorProvider>

      <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
    </QueryClientProvider>
  );
}
