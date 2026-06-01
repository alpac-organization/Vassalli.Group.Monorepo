import { BadgesProps } from "./badges.types";
export function Badges({
  label,
  color,
  className,
  childIcon: Icon,
}: BadgesProps): React.ReactElement {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[14px] font-medium ${color} ${className}`}
    >
      {label}
      {Icon && <Icon size={12} strokeWidth={2.5} />}
    </span>
  );
}
