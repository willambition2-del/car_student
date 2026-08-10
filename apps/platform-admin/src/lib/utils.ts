import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APP_COLORS = {
  primaryBlue: "#1769E0",
  darkBlue: "#103B75",
  teal: "#12AFA5",
  successGreen: "#16A461",
  warningAmber: "#F2A31B",
  errorRed: "#E5484D",
  background: "#F5F8FC",
  surface: "#FFFFFF",
  mainText: "#13233A",
  secondaryText: "#66758A",
  border: "#E3EAF3",
  disabled: "#B8C2D0",
};
