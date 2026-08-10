import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "neutral" | "primary";
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ children, variant = "info", className }) => {
  const variantStyles = {
    success: "bg-[#16A461]/12 text-[#16A461] border-[#16A461]/20",
    warning: "bg-[#F2A31B]/12 text-[#F2A31B] border-[#F2A31B]/20",
    error: "bg-[#E5484D]/12 text-[#E5484D] border-[#E5484D]/20",
    info: "bg-[#1769E0]/12 text-[#1769E0] border-[#1769E0]/20",
    neutral: "bg-[#66758A]/12 text-[#66758A] border-[#66758A]/20",
    primary: "bg-[#103B75]/12 text-[#103B75] border-[#103B75]/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
