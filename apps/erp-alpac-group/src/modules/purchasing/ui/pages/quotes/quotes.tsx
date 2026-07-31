import { useCallback, useState } from "react";
import { m } from "framer-motion";
import { Breadcrumb } from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { QuotesPageHeader } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-page-header/quotes-page-header";
import { QuotesTable } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-table/quotes-table";
import { CreateQuoteModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-modal";
import type { QuotesModalType } from "@app/modules/purchasing/ui/pages/quotes/types/quotes-modal.types";

export function Quotes() {

  const navigate = useNavigate();

  const { baseUrl } = useBaseUrl();

  const [activeModal, setActiveModal] = useState<QuotesModalType>(null);

  const [quotes, setQuotes] = useState<any[]>([]);

  const handleViewDetail = useCallback(() => {
    setActiveModal("quote-details");
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleQuoteCreated = useCallback((quote: any) => {
    setQuotes((current) => [quote, ...current]);
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-start">
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                url: `${baseUrl}/`,
                onClick: (url) => navigate(url),
              },
              {
                label: "Cotizaciones",
                url: `${baseUrl}/purchasing/quotes`,
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>

        <QuotesPageHeader />        

        <QuotesTable data={quotes} onViewDetail={handleViewDetail} />

        <CreateQuoteModal
          isOpen={activeModal === "create-quote"}
          onClose={handleCloseModal}
          onQuoteCreated={handleQuoteCreated}
        />
        
      </div>
    </m.div>
  );
}
