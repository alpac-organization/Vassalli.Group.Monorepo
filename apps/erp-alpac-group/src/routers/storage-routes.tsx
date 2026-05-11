import type { RouteObject } from "react-router-dom";
import { StoragePage } from "@app/modules/storage/ui/pages/storage-index/storage.page";

export const StorageRoutes: RouteObject[] = [
   {
      index: true,
      element: <StoragePage />,
   }
];
