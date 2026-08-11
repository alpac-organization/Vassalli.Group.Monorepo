import { Eye } from "lucide-react";
import { ReadOnlyField } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/read-only-field/read-only-field";
import { Button } from "@alpac/design-system";
import { eyeButtonClasses } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/ducat-detail-modal/utils/style.eye";
export function FieldWithEye({
  label,
  value,
  missingMessage,
  ariaLabel,
  onView,
}: {
  label: string;
  value: string;
  missingMessage: string;
  ariaLabel: string;
  onView: () => void;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <ReadOnlyField
            label={label}
            value={value}
            missingMessage={missingMessage}
          />
        </div>
        <div className="flex shrink-0 mt-[24px] sm:mt-[26px]">
          <Button
            type="button"
            ariaLabel={ariaLabel}
            onClick={onView}
            icon={<Eye size={16} />}
            className={eyeButtonClasses}
          />
        </div>
      </div>
    </div>
  );
}
