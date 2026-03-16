import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

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

const YEARS = Array.from(
  { length: 11 },
  (_, i) => new Date().getFullYear() - 5 + i,
);

/* ── Helpers ────────────────────────────────────────────────────────── */
const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDate = (d) =>
  d
    ? d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

/* ── Inline Dropdown Select ─────────────────────────────────────────── */
const InlineSelect = ({ value, options, onChange, renderOption }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
      >
        {renderOption(value)}
        <ChevronDown
          size={12}
          className="text-gray-400 dark:text-gray-500 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-50 py-1 rounded-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] shadow-xl max-h-48 overflow-y-auto scrollbar-hide min-w-[120px]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-xs text-left transition-colors ${
                opt === value
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {renderOption(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Single Calendar (shared for start+end) ─────────────────────────── */
const Calendar = ({ startDate, endDate, selecting, onSelect }) => {
  const today = new Date();
  const refDate =
    (selecting === "start" ? startDate : endDate) ||
    startDate ||
    endDate ||
    today;
  const [viewYear, setViewYear] = useState(refDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(refDate.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  // Previous month trailing days
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells = useMemo(() => {
    const arr = [];
    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--)
      arr.push({ day: prevMonthDays - i, current: false });
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) arr.push({ day: d, current: true });
    // Fill remaining to complete grid (6 rows)
    const remaining = 42 - arr.length;
    for (let d = 1; d <= remaining; d++) arr.push({ day: d, current: false });
    return arr;
  }, [viewYear, viewMonth, daysInMonth, firstDayOfWeek, prevMonthDays]);

  const isInRange = (day, isCurrent) => {
    if (!isCurrent || !startDate || !endDate) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d > startDate && d < endDate;
  };

  const isRangeStart = (day, isCurrent) =>
    isCurrent &&
    startDate &&
    isSameDay(new Date(viewYear, viewMonth, day), startDate);

  const isRangeEnd = (day, isCurrent) =>
    isCurrent &&
    endDate &&
    isSameDay(new Date(viewYear, viewMonth, day), endDate);

  const isToday = (day, isCurrent) =>
    isCurrent &&
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  // Split cells into rows of 7
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <div>
      {/* Month / Year nav */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-3">
          <InlineSelect
            value={viewMonth}
            options={Array.from({ length: 12 }, (_, i) => i)}
            onChange={setViewMonth}
            renderOption={(m) => MONTHS[m]}
          />
          <InlineSelect
            value={viewYear}
            options={YEARS}
            onChange={setViewYear}
            renderOption={(y) => y}
          />
        </div>

        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid — row by row for range row-highlighting */}
      <div className="space-y-1">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7">
            {row.map((cell, ci) => {
              const { day, current: isCurrent } = cell;
              const rangeStart = isRangeStart(day, isCurrent);
              const rangeEnd = isRangeEnd(day, isCurrent);
              const inRange = isInRange(day, isCurrent);
              const todayMark = isToday(day, isCurrent);
              const isSelected = rangeStart || rangeEnd;

              // Range background shape: full width for mid-range, half for endpoints
              let rangeBg = "";
              if (inRange) rangeBg = "bg-indigo-500/[0.08]";
              else if (rangeStart && endDate)
                rangeBg =
                  "bg-gradient-to-r from-transparent to-indigo-500/[0.08]";
              else if (rangeEnd && startDate)
                rangeBg =
                  "bg-gradient-to-l from-transparent to-indigo-500/[0.08]";

              return (
                <div
                  key={ci}
                  className={`relative flex items-center justify-center h-10 ${rangeBg}`}
                >
                  <button
                    onClick={() =>
                      isCurrent && onSelect(new Date(viewYear, viewMonth, day))
                    }
                    disabled={!isCurrent}
                    className={`relative w-9 h-9 rounded-full text-[13px] font-medium transition-all ${
                      !isCurrent
                        ? "text-gray-300 dark:text-gray-600/40 cursor-default"
                        : isSelected
                          ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30"
                          : todayMark
                            ? "text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-indigo-500/30 dark:ring-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/15"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Date Filter Dropdown ───────────────────────────────────────────── */
const EMPTY_TEMP = {
  adSeen: { start: null, end: null },
  postSeen: { start: null, end: null },
  domainReg: { start: null, end: null },
};

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
  const [selecting, setSelecting] = useState("start"); // "start" | "end"
  const [tempDates, setTempDates] = useState(EMPTY_TEMP);
  const ref = useRef(null);

  // Sync temp state from props when opening
  useEffect(() => {
    if (open) {
      setTempDates({
        adSeen: { ...dateAdSeen },
        postSeen: { ...datePostSeen },
        domainReg: { ...dateDomainReg },
      });
    }
  }, [open]); // only on open toggle

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const currentTemp = tempDates[activeTab];

  const handleDateSelect = (date) => {
    setTempDates((prev) => {
      const tab = { ...prev[activeTab] };
      if (selecting === "start") {
        if (tab.end && date > tab.end) {
          tab.start = date;
          tab.end = null;
        } else {
          tab.start = date;
        }
      } else {
        if (tab.start && date < tab.start) {
          tab.end = tab.start;
          tab.start = date;
        } else {
          tab.end = date;
        }
      }
      return { ...prev, [activeTab]: tab };
    });
    setSelecting((s) => (s === "start" ? "end" : "start"));
  };

  const handleApply = () => {
    setDateAdSeen(tempDates.adSeen);
    setDatePostSeen(tempDates.postSeen);
    setDateDomainReg(tempDates.domainReg);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false); // discard temp, revert on next open
  };

  // Check if a tab has dates set (in temp state while open)
  const tabHasDate = (key) => tempDates[key].start || tempDates[key].end;

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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-80 sm:hidden transition-opacity duration-300"
          onClick={handleCancel}
          aria-hidden="true"
        />
      )}

      {/* Dropdown panel */}
      {open && (
        <div className="fixed inset-x-3 top-1/2 -translate-y-1/2 sm:inset-auto sm:translate-y-0 sm:absolute sm:right-0 sm:top-full sm:mt-2 z-50 w-auto sm:w-[380px] rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1e1e30] shadow-2xl shadow-black/10 dark:shadow-black/50">
          {/* Filter type tabs */}
          <div className="flex items-center gap-1 p-2.5 pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelecting("start");
                }}
                className={`relative flex-1 px-2 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === tab.key
                    ? "text-white bg-indigo-600 shadow-md shadow-indigo-500/20"
                    : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
                {tabHasDate(tab.key) && activeTab !== tab.key && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Date input pills */}
          <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
            <button
              onClick={() => setSelecting("start")}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-center transition-all ${
                selecting === "start"
                  ? "bg-white dark:bg-[#1a1a30] border-2 border-indigo-500/60 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10"
                  : "bg-gray-50 dark:bg-[#12121f] border-2 border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-[#2a2a3e]"
              }`}
            >
              {formatDate(currentTemp.start) || "Start Date"}
            </button>
            <button
              onClick={() => setSelecting("end")}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-center transition-all ${
                selecting === "end"
                  ? "bg-white dark:bg-[#1a1a30] border-2 border-indigo-500/60 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10"
                  : "bg-gray-50 dark:bg-[#12121f] border-2 border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-[#2a2a3e]"
              }`}
            >
              {formatDate(currentTemp.end) || "End Date"}
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-[#1e1e30] mx-4" />

          {/* Calendar */}
          <div className="px-4 py-4">
            <Calendar
              startDate={currentTemp.start}
              endDate={currentTemp.end}
              selecting={selecting}
              onSelect={handleDateSelect}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-4 py-3 border-t border-gray-100 dark:border-[#1e1e30]">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white bg-gray-100 dark:bg-[#12121f] hover:bg-gray-200 dark:hover:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilterDropdown;
