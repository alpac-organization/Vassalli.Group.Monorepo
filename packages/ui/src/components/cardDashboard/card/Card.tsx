import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`flex flex-col border border-neutral-800 rounded-lg overflow-hidden bg-black text-white hover:border-neutral-600 transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
