import { CardProps } from "./Card";

export function CardHeader({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`relative flex justify-center items-center h-28 bg-[#0a0a0a] border-b border-neutral-800 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
