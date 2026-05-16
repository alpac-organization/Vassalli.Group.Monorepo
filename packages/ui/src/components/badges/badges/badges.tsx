import { BadgesProps } from "./badges.types"

export function Badges({ label, color, className }: BadgesProps): React.ReactElement {
   return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[14px] font-medium ${color} ${className}`}>
         {label}
      </span>
   )
}