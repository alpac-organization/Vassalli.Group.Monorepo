import { Badges } from "@alpac/design-system";
import { DOCUMENT_CODE_BADGE_CLASS } from "../../process-inventory-entry-modal.constants";

import type { DocumentCodeBadgeProps } from "./document-code-badge.types";

export const DocumentCodeBadge = function ({label, value, color}: DocumentCodeBadgeProps) {
   return (
      <span title={`${label}: ${value}`} className="inline-flex">
         <Badges
            label={`${label}: ${value}`}
            color={color}
            className={DOCUMENT_CODE_BADGE_CLASS}
         />
      </span>
   );
};
