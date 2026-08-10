import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary: "bg-[#1769E0] hover:bg-[#103B75] text-white focus:ring-[#1769E0] shadow-sm",
    secondary: "bg-[#F5F8FC] hover:bg-[#E3EAF3] text-[#13233A] border border-[#E3EAF3] focus:ring-[#1769E0]",
    danger: "bg-[#E5484D] hover:bg-[#B9252A] text-white focus:ring-[#E5484D] shadow-sm",
    outline: "border border-[#1769E0] text-[#1769E0] hover:bg-[#F5F8FC] focus:ring-[#1769E0]",
    ghost: "text-[#66758A] hover:bg-[#F5F8FC] hover:text-[#13233A]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
      {children}
    </button>
  );
};
