import { CardProps } from "./Card";
export function CardContent({ className = "", children, ...props }: CardProps) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
