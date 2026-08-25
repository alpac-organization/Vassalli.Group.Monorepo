import { Badges } from "@alpac/design-system";
export function OwnerBadge({ isOwner }: { isOwner: boolean }) {
  return isOwner ? (
    <Badges
      label="Propia"
      color="transparent"
      className="bg-violet-500/15!
        border!
        border-violet-400/40!
        text-violet-300!"
    />
  ) : (
    <Badges
      label="No propia"
      color="transparent"
      className="bg-slate-300/20!
        border!
        border-slate-200/50!
        text-slate-300!"
    />
  );
}
