import { CardProps } from "./Card";

export function CardHeader({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`relative flex justify-center items-center h-28 bg-[#3a3e47] border-b border-neutral-800 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
