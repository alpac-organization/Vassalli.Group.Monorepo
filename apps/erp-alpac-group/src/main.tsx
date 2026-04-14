import "@alpac/design-system/styles/global.css";
import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalServerErrorGate } from "@app/shared/components/global-server-error-gate/global-server-error-gate";

interface MainProps {
  router: any;
  queryClient: QueryClient;
}

export default function Main({ router, queryClient }: MainProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalServerErrorGate>
        <RouterProvider router={router} />
      </GlobalServerErrorGate>

      <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
    </QueryClientProvider>
  );
}
