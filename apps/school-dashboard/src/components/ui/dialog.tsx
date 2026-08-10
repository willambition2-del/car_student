import React from "react";
import { Button } from "./button";
import { X, AlertTriangle } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#13233A]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-[#E3EAF3] rounded-2xl shadow-xl p-6 text-right space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDanger && (
              <div className="w-8 h-8 rounded-full bg-[#E5484D]/10 text-[#E5484D] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            )}
            <h3 className="text-base font-bold text-[#13233A]">{title}</h3>
          </div>
          <button onClick={onClose} className="text-[#66758A] hover:text-[#13233A]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-[#66758A] leading-relaxed">{description}</p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={isDanger ? "danger" : "primary"} size="sm" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
