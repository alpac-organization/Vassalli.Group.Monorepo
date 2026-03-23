import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden bg-[#272b34] text-white hover:border-neutral-600 transition-colors duration-300 border border-slate-600 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
