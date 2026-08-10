import React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant = "neutral", children, className }) => {
  const styles = {
    success: "bg-[#16A461]/10 text-[#16A461] border-[#16A461]/20",
    warning: "bg-[#F2A31B]/10 text-[#D98200] border-[#F2A31B]/20",
    error: "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/20",
    info: "bg-[#1769E0]/10 text-[#1769E0] border-[#1769E0]/20",
    neutral: "bg-[#66758A]/10 text-[#66758A] border-[#66758A]/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
