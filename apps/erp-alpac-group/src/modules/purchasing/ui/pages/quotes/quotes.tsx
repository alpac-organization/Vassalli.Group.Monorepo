import { useCallback, useState } from "react";
import { m } from "framer-motion";
import { Breadcrumb, Button } from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { QuotesPageHeader } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-page-header/quotes-page-header";
import { QuotesTable } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-table/quotes-table";
import { CreateQuoteModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-modal";
import type { QuotesModalType } from "@app/modules/purchasing/ui/pages/quotes/types/quotes-modal.types";
import { FilePlus2 } from "lucide-react";

export function Quotes() {

  const navigate = useNavigate();

  const { baseUrl } = useBaseUrl();  

  const [activeModal, setActiveModal] = useState<QuotesModalType>(null);

  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  const [quotes, setQuotes] = useState<any[]>([]);

  const handleCreateQuote = useCallback(() => {
    setSelectedQuote(null);
    setActiveModal("create-quote");
  }, []);

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

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
            <div className="flex flex-col justify-center">
              <h3 className="p-0! m-0!">Acciones</h3>
              <small className="text-gray-500 dark:text-gray-300">
                Cree una nueva cotización o gestione las existentes
              </small>
            </div>
          </div>

          <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
            <div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
              <Button
                type="button"
                size="giant"
                label="Nueva cotización"
                icon={<FilePlus2 size={20} />}
                className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                onClick={handleCreateQuote}
              />
            </div>
          </div>
        </div>

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
