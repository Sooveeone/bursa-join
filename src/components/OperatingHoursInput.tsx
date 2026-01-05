"use client";

import { Clock } from "lucide-react";

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

const DAYS = [
  { key: "monday", label: "Senin" },
  { key: "tuesday", label: "Selasa" },
  { key: "wednesday", label: "Rabu" },
  { key: "thursday", label: "Kamis" },
  { key: "friday", label: "Jumat" },
  { key: "saturday", label: "Sabtu" },
  { key: "sunday", label: "Minggu" },
] as const;

const DEFAULT_HOURS: DayHours = {
  open: "09:00",
  close: "17:00",
  closed: false,
};

export function getDefaultOperatingHours(): OperatingHours {
  return {
    monday: { ...DEFAULT_HOURS },
    tuesday: { ...DEFAULT_HOURS },
    wednesday: { ...DEFAULT_HOURS },
    thursday: { ...DEFAULT_HOURS },
    friday: { ...DEFAULT_HOURS },
    saturday: { ...DEFAULT_HOURS },
    sunday: { open: "09:00", close: "17:00", closed: true },
  };
}

interface OperatingHoursInputProps {
  value: OperatingHours;
  onChange: (value: OperatingHours) => void;
}

export default function OperatingHoursInput({ value, onChange }: OperatingHoursInputProps) {
  const handleDayChange = (
    day: keyof OperatingHours,
    field: keyof DayHours,
    newValue: string | boolean
  ) => {
    onChange({
      ...value,
      [day]: {
        ...value[day],
        [field]: newValue,
      },
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-xs sm:text-sm font-medium text-gray-300">Jam Operasional</span>
      </div>
      
      <div className="space-y-2">
        {DAYS.map(({ key, label }) => {
          const dayHours = value[key] || DEFAULT_HOURS;
          
          return (
            <div 
              key={key} 
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-white/5 rounded-lg border border-white/10"
            >
              {/* Day name */}
              <div className="w-14 sm:w-16 flex-shrink-0">
                <span className="text-xs sm:text-sm text-gray-300">{label}</span>
              </div>

              {/* Closed toggle */}
              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={dayHours.closed}
                  onChange={(e) => handleDayChange(key, "closed", e.target.checked)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500 focus:ring-offset-0"
                />
                <span className="text-[10px] sm:text-xs text-gray-500">Tutup</span>
              </label>

              {/* Time inputs */}
              {!dayHours.closed && (
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <input
                    type="time"
                    value={dayHours.open}
                    onChange={(e) => handleDayChange(key, "open", e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-white/5 border border-white/10 rounded-md text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                  />
                  <span className="text-gray-500 text-xs">-</span>
                  <input
                    type="time"
                    value={dayHours.close}
                    onChange={(e) => handleDayChange(key, "close", e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-white/5 border border-white/10 rounded-md text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                  />
                </div>
              )}
              
              {dayHours.closed && (
                <div className="flex-1 text-xs sm:text-sm text-gray-500 italic">
                  Tutup
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

