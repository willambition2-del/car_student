import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-[#E3EAF3] p-5 shadow-sm text-right", className)}>
      {children}
    </div>
  );
};

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, color = "#1769E0" }) => {
  return (
    <Card className="flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs text-[#66758A] font-medium">{title}</span>
        <div className="text-xl font-bold text-[#13233A] font-mono" suppressHydrationWarning>
          {typeof value === "number" ? value.toLocaleString("en-US") : value}
        </div>
        {subtitle && (
          <span className="text-[11px] text-[#66758A] block" suppressHydrationWarning>
            {subtitle}
          </span>
        )}
      </div>
      {icon && (
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
      )}
    </Card>
  );
};
