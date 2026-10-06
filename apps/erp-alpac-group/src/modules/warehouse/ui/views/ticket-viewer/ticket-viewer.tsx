import { useParams, useSearchParams } from "react-router-dom";
import type { TicketParams } from "./ticket-viewer.types";

export const TicketViewer = () => {

   const { warehouseId = "", ticketId = "" } = useParams<TicketParams>();
   const [searchParams] = useSearchParams();

   const status = searchParams.get("status") ?? "";
   const code = searchParams.get("code") ?? "";

   return (
      <h1>Testing ticket page {warehouseId} / {ticketId} / {status} / {code}</h1>
   );
}