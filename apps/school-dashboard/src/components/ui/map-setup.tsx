"use client";

import React, { useState } from "react";
import { MapPin, Navigation, ShieldCheck, Bus as BusIcon, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import { StatusBadge } from "./badge";

export interface MapSetupPanelProps {
  title?: string;
  subtitle?: string;
  selectedStudentName?: string;
  selectedBusNumber?: string;
  latitude?: number;
  longitude?: number;
}

export const MapSetupPanel: React.FC<MapSetupPanelProps> = ({
  title = "خريطة المسارات ونقاط التجمع",
  subtitle = "خريطة تفاعلية لعرض حافلات المدرسة ونقاط التجمع ومواقع الطلاب",
  selectedStudentName,
  selectedBusNumber,
  latitude = 24.7741,
  longitude = 46.7386,
}) => {
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const isKeyPresent = Boolean(apiKey && apiKey.length > 5);
  const [useStandardEmbed, setUseStandardEmbed] = useState<boolean>(false);

  return (
    <div className="relative w-full h-[540px] bg-[#F5F8FC] border border-[#E3EAF3] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between p-4">
      {/* Top Banner Status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border border-[#E3EAF3] p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#13233A]">{title}</h4>
            <p className="text-xs text-[#66758A]">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge variant="success">المسارات مفعلة</StatusBadge>

          {/* Toggle Map Engine */}
          <button
            onClick={() => setUseStandardEmbed(!useStandardEmbed)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E3EAF3] bg-white text-[#103B75] hover:bg-[#F5F8FC] transition-colors cursor-pointer"
            title="تبديل محرك الخريطة"
          >
            <Layers className="w-3.5 h-3.5 text-[#1769E0]" />
            {useStandardEmbed ? "وضع معاينة الخريطة العامة" : "وضع Google Maps API"}
          </button>
        </div>
      </div>

      {/* Main Map View Container */}
      <div className="relative z-0 my-3 w-full h-full rounded-xl overflow-hidden border border-[#E3EAF3] bg-[#E8EEF5]">
        {useStandardEmbed ? (
          <iframe
            title="Standard Google Map Preview"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
          />
        ) : isKeyPresent ? (
          <iframe
            title="Google Maps Fleet Routing"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=14`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-white/90 backdrop-blur-md">
            <h5 className="text-sm font-bold text-[#13233A] mb-2">وضع التطوير: Google Maps API Key غير مضاف</h5>
            <p className="text-xs text-[#66758A] max-w-md">
              قم بإضافة <code className="bg-[#E3EAF3] text-[#103B75] px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> في ملف البيئة لتمكين الخريطة التفاعلية.
            </p>
          </div>
        )}
      </div>

      {/* Floating Info Overlay if student/bus selected */}
      {(selectedStudentName || selectedBusNumber) && (
        <div className="relative z-10 bg-white/95 backdrop-blur-md border border-[#E3EAF3] rounded-xl p-3 text-xs mb-2 space-y-1 shadow-xs">
          {selectedStudentName && (
            <div className="flex items-center gap-2 text-[#103B75] font-bold">
              <MapPin className="w-4 h-4 text-[#1769E0]" /> الطالب المحدد: {selectedStudentName}
            </div>
          )}
          {selectedBusNumber && (
            <div className="flex items-center gap-2 text-[#103B75] font-bold">
              <BusIcon className="w-4 h-4 text-[#12AFA5]" /> الحافلة المحددة: حافلة رقم {selectedBusNumber}
            </div>
          )}
        </div>
      )}

      {/* Bottom Floating Map Information Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-md border border-[#E3EAF3] p-3 rounded-xl shadow-xs text-xs text-[#66758A]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#16A461]" />
          <span>خصوصية مواقع الطلاب مفعّلة حصرياً لولي الأمر والمدرسة</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#F2A31B] font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>يتطلب تفعيل Maps Embed & JS API من Google Console</span>
        </div>
      </div>
    </div>
  );
};
