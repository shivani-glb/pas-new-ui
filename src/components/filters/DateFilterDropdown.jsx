import React, { useState, useRef, useEffect, useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TABS = [
  { key: "adSeen", label: "Ad Seen" },
  { key: "postSeen", label: "Post Seen" },
  { key: "domainReg", label: "Domain Reg" },
];

/* ── Mini Calendar ──────────────────────────────────────────────────── */
const MiniCalendar = ({ label, selected, onSelect, otherDate, isStart }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    selected ? selected.getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selected ? selected.getMonth() : today.getMonth(),
  );

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDayOfWeek; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [viewYear, viewMonth, daysInMonth, firstDayOfWeek]);

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isInRange = (day) => {
    if (!day || !selected || !otherDate) return false;
    const current = new Date(viewYear, viewMonth, day);
    const start = isStart ? selected : otherDate;
    const end = isStart ? otherDate : selected;
    if (!start || !end) return false;
    return current > start && current < end;
  };

  const isToday = (day) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div className="flex-1 min-w-[240px]">
      {/* Label */}
      <div className="text-[11px] font-bold text-gray-400 dark:text-[#666] uppercase tracking-widest mb-3">
        {label}
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-500 dark:text-[#666] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-gray-700 dark:text-[#ccc]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-500 dark:text-[#666] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold text-gray-400 dark:text-[#555] py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const isSelected =
            day &&
            selected &&
            isSameDay(selected, new Date(viewYear, viewMonth, day));
          const inRange = isInRange(day);
          const todayMark = isToday(day);

          return (
            <button
              key={i}
              disabled={!day}
              onClick={() =>
                day && onSelect(new Date(viewYear, viewMonth, day))
              }
              className={`h-9 w-full text-xs rounded-lg transition-all relative font-medium ${
                !day
                  ? ""
                  : isSelected
                    ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20"
                    : inRange
                      ? "bg-indigo-500/10 text-indigo-400 dark:text-indigo-300"
                      : todayMark
                        ? "text-indigo-500 dark:text-indigo-400 font-bold ring-1 ring-indigo-500/30"
                        : "text-gray-700 dark:text-[#aaa] hover:bg-gray-100 dark:hover:bg-white/[0.08]"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selected date display */}
      <div className="mt-3 py-2 px-3 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-[#1a1a1a] flex items-center justify-center">
        {selected ? (
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {selected.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-xs text-gray-400 dark:text-[#444]">
            Select a date
          </span>
        )}
      </div>
    </div>
  );
};

/* ── Date Filter Dropdown ───────────────────────────────────────────── */
const DateFilterDropdown = ({
  dateAdSeen,
  setDateAdSeen,
  datePostSeen,
  setDatePostSeen,
  dateDomainReg,
  setDateDomainReg,
  activeDateFilters,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("adSeen");
  const [tempDates, setTempDates] = useState({
    adSeen: { start: null, end: null },
    postSeen: { start: null, end: null },
    domainReg: { start: null, end: null },
  });
  const ref = useRef(null);

  // Sync temp state when opening
  useEffect(() => {
    if (open) {
      setTempDates({
        adSeen: { ...dateAdSeen },
        postSeen: { ...datePostSeen },
        domainReg: { ...dateDomainReg },
      });
    }
  }, [open, dateAdSeen, datePostSeen, dateDomainReg]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking the trigger (handled by toggle)
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleApply = () => {
    setDateAdSeen(tempDates.adSeen);
    setDatePostSeen(tempDates.postSeen);
    setDateDomainReg(tempDates.domainReg);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const currentTemp = tempDates[activeTab];

  const handleClear = () => {
    setTempDates((prev) => ({
      ...prev,
      [activeTab]: { start: null, end: null },
    }));
  };

  const handleClearAll = () => {
    setTempDates({
      adSeen: { start: null, end: null },
      postSeen: { start: null, end: null },
      domainReg: { start: null, end: null },
    });
  };

  const hasCurrentTempDates = currentTemp.start || currentTemp.end;
  const hasAnyTempDates = Object.values(tempDates).some(
    (d) => d.start || d.end,
  );

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
          open
            ? "bg-indigo-600 border-indigo-500 text-white"
            : "bg-white dark:bg-[#111] border-gray-200 dark:border-[#1c1c1c] text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#333]"
        }`}
        aria-label="Date filters"
      >
        <CalendarDays size={14} />
        {activeDateFilters > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center px-1 bg-indigo-500 rounded-full border-2 border-white dark:border-[#111] text-[9px] font-bold text-white">
            {activeDateFilters}
          </span>
        )}
      </button>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300"
          onClick={handleCancel}
          aria-hidden="true"
        />
      )}

      {/* Dropdown panel */}
      {open && (
        <div className="fixed inset-x-3 top-1/2 -translate-y-1/2 sm:inset-auto sm:translate-y-0 sm:absolute sm:right-0 sm:top-full sm:mt-2 z-50 rounded-2xl border border-gray-200 dark:border-[#1c1c1c] bg-white dark:bg-[#111] shadow-2xl shadow-black/15 dark:shadow-black/50 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
          {/* Header with tabs */}
          <div className="sticky top-0 z-10 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-[#1a1a1a] rounded-t-2xl">
            <div className="flex items-center gap-1 p-2">
              {TABS.map((tab) => {
                const hasDate =
                  tempDates[tab.key].start || tempDates[tab.key].end;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative flex-1 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                      activeTab === tab.key
                        ? "text-white bg-indigo-600 shadow-md shadow-indigo-500/20"
                        : "text-gray-400 dark:text-[#555] hover:text-gray-600 dark:hover:text-[#888] hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    {tab.label}
                    {hasDate && activeTab !== tab.key && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar area */}
          <div className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
              <MiniCalendar
                label="Start Date"
                selected={currentTemp.start}
                otherDate={currentTemp.end}
                isStart={true}
                onSelect={(date) =>
                  setTempDates((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], start: date },
                  }))
                }
              />

              {/* Divider */}
              <div className="hidden sm:flex flex-col items-center justify-center gap-2">
                <div className="w-px flex-1 bg-gray-100 dark:bg-[#1a1a1a]" />
                <span className="text-[10px] font-bold text-gray-300 dark:text-[#333] uppercase">
                  to
                </span>
                <div className="w-px flex-1 bg-gray-100 dark:bg-[#1a1a1a]" />
              </div>
              <div className="flex sm:hidden items-center gap-3">
                <div className="flex-1 h-px bg-gray-100 dark:bg-[#1a1a1a]" />
                <span className="text-[10px] font-bold text-gray-300 dark:text-[#333] uppercase">
                  to
                </span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-[#1a1a1a]" />
              </div>

              <MiniCalendar
                label="End Date"
                selected={currentTemp.end}
                otherDate={currentTemp.start}
                isStart={false}
                onSelect={(date) =>
                  setTempDates((prev) => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], end: date },
                  }))
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-[#1a1a1a] px-4 sm:px-5 py-3 rounded-b-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasCurrentTempDates && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-[#555] hover:text-red-400 transition-colors"
                >
                  <X size={12} />
                  Clear
                </button>
              )}
              {hasAnyTempDates && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-medium text-gray-400 dark:text-[#555] hover:text-red-400 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl text-gray-400 dark:text-[#666] hover:text-gray-600 dark:hover:text-[#aaa] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-indigo-500/20"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilterDropdown;
