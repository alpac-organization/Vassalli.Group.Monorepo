import { TEXT_WRAP_CLASS } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/comparison.constants";

type RecommendationBadgesProps = {
  isBestPrice: boolean;
  isBestWarranty: boolean;
  isBestDelivery: boolean;
  isBestOption: boolean;
};

export function RecommendationBadges({
  isBestPrice,
  isBestWarranty,
  isBestDelivery,
  isBestOption,
}: RecommendationBadgesProps) {
  const badges: { key: string; label: string; className: string }[] = [];

  if (isBestPrice) {
    badges.push({
      key: "price",
      label: "Mejor precio",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
    });
  }
  if (isBestWarranty) {
    badges.push({
      key: "warranty",
      label: "Mejor garantía",
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
    });
  }
  if (isBestDelivery) {
    badges.push({
      key: "delivery",
      label: "Mejor entrega",
      className: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
    });
  }
  if (isBestOption) {
    badges.push({
      key: "option",
      label: "Mejor opción",
      className:
        "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex max-w-full flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge.key}
          className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

type SupplierQuoteHeadingProps = {
  name: string;
  isBestPrice: boolean;
  isBestWarranty: boolean;
  isBestDelivery: boolean;
  isBestOption: boolean;
};

export function SupplierQuoteHeading({
  name,
  isBestPrice,
  isBestWarranty,
  isBestDelivery,
  isBestOption,
}: SupplierQuoteHeadingProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2 py-0.5">
      <p
        className={`m-0 text-sm font-semibold leading-snug text-slate-900 dark:text-white ${TEXT_WRAP_CLASS}`}
      >
        {name}
      </p>
      <RecommendationBadges
        isBestPrice={isBestPrice}
        isBestWarranty={isBestWarranty}
        isBestDelivery={isBestDelivery}
        isBestOption={isBestOption}
      />
    </div>
  );
}
