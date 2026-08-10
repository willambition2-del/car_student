import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-right">
        {label && <label className="text-xs font-bold text-[#13233A]">{label}</label>}
        <div className="relative flex items-center">
          {icon && <div className="absolute right-3.5 text-[#66758A] pointer-events-none">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              "w-full bg-white border border-[#E3EAF3] text-[#13233A] placeholder-[#66758A] text-sm rounded-xl px-4 py-2.5 outline-none transition-all duration-150 focus:border-[#1769E0] focus:ring-2 focus:ring-[#1769E0]/15",
              icon && "pr-10",
              error && "border-[#E5484D]",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-[#E5484D] font-medium">{error}</span>}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full flex flex-col gap-1.5 text-right">
        {label && <label className="text-xs font-bold text-[#13233A]">{label}</label>}
        <div className="relative flex items-center">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn(
              "w-full bg-white border border-[#E3EAF3] text-[#13233A] placeholder-[#66758A] text-sm rounded-xl px-4 py-2.5 pl-10 outline-none transition-all duration-150 focus:border-[#1769E0] focus:ring-2 focus:ring-[#1769E0]/15",
              error && "border-[#E5484D]",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 text-[#66758A] hover:text-[#13233A]"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <span className="text-xs text-[#E5484D] font-medium">{error}</span>}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export const SearchInput: React.FC<InputProps> = (props) => {
  return <TextInput icon={<Search className="w-4 h-4 text-[#66758A]" />} {...props} />;
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const SelectInput: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-right">
      {label && <label className="text-xs font-bold text-[#13233A]">{label}</label>}
      <select
        className={cn(
          "w-full bg-white border border-[#E3EAF3] text-[#13233A] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#1769E0]",
          error && "border-[#E5484D]",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-[#E5484D] font-medium">{error}</span>}
    </div>
  );
};
