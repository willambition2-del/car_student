import React from "react";
import { Loader2, Inbox, AlertCircle } from "lucide-react";
import { Button } from "./button";

export const LoadingState: React.FC<{ message?: string }> = ({ message = "جاري تحميل البيانات..." }) => {
  return (
    <div className="w-full min-h-[220px] flex flex-col items-center justify-center p-8 bg-white border border-[#E3EAF3] rounded-2xl gap-3 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#1769E0]" />
      <span className="text-sm font-semibold text-[#13233A]">{message}</span>
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title = "لا توجد سجلات حالياً",
  description = "لم نتمكن من العثور على أي عناصر مسجلة في هذا القسم.",
  actionText,
  onAction,
}) => {
  return (
    <div className="w-full min-h-[260px] flex flex-col items-center justify-center p-8 bg-white border border-[#E3EAF3] rounded-2xl gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-[#1769E0]/10 flex items-center justify-center text-[#1769E0]">
        <Inbox className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-[#13233A]">{title}</h4>
      <p className="text-xs text-[#66758A] max-w-md">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ title = "حدث خطأ غير متوقع", message = "يرجى التحقق من اتصال الشبكة وإعادة المحاولة.", onRetry }) => {
  return (
    <div className="w-full min-h-[220px] flex flex-col items-center justify-center p-8 bg-white border border-[#E5484D]/30 rounded-2xl gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-[#E5484D]/10 flex items-center justify-center text-[#E5484D]">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-[#13233A]">{title}</h4>
      <p className="text-xs text-[#66758A] max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={`animate-pulse bg-[#E3EAF3] rounded-xl ${className}`} />;
};
