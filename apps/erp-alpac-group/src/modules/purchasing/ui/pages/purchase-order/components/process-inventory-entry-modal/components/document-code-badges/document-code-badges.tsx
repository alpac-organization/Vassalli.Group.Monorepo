import { ClipboardList, NotebookTextIcon } from "lucide-react";

import { DocumentCodeBadge } from "../document-code-badge/document-code-badge";

import type { DocumentCodeBadgesProps } from "./document-code-badges.types";

const BADGE_ICONS = [NotebookTextIcon, ClipboardList] as const;

export const DocumentCodeBadges = function ({
  badges,
}: DocumentCodeBadgesProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Códigos de documento de la orden de compra"
    >
      {badges.map((badge, index) => (
        <DocumentCodeBadge
          key={badge.label}
          label={badge.label}
          value={badge.value}
          color={badge.color}
          icon={BADGE_ICONS[index]}
        />
      ))}
    </div>
  );
};
