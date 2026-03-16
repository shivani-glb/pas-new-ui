import { useState, useRef, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

const TABS = [
  { key: "adSeen", label: "Ad Seen" },
  { key: "postSeen", label: "Post Seen" },
  { key: "domainReg", label: "Domain Reg" },
];

const formatDate = (d) => (d ? format(d, "MMM d, yyyy") : null);

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
  const [selecting, setSelecting] = useState("start");
  const [tempDates, setTempDates] = useState(EMPTY_TEMP);
  const [calMonth, setCalMonth] = useState(new Date());
  const ref = useRef(null);

  useEffect(() => {
    if (open) {
      setTempDates({
        adSeen: { ...dateAdSeen },
        postSeen: { ...datePostSeen },
        domainReg: { ...dateDomainReg },
      });
    }
  }, [open]);

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
    if (!date) return;
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
    setOpen(false);
  };

  const tabHasDate = (key) => tempDates[key].start || tempDates[key].end;

  // Build modifiers for react-day-picker
  const modifiers = {};
  const modifiersClassNames = {};

  if (currentTemp.start) {
    modifiers.rangeStart = currentTemp.start;
    modifiersClassNames.rangeStart = "rdp-range_start";
  }
  if (currentTemp.end) {
    modifiers.rangeEnd = currentTemp.end;
    modifiersClassNames.rangeEnd = "rdp-range_end";
  }
  if (currentTemp.start && currentTemp.end) {
    modifiers.inRange = {
      after: currentTemp.start,
      before: currentTemp.end,
    };
    modifiersClassNames.inRange = "rdp-range_middle";
  }

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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] sm:hidden transition-opacity duration-300"
          onClick={handleCancel}
          aria-hidden="true"
        />
      )}

      {/* Dropdown panel */}
      {open && (
        <div className="fixed inset-x-3 top-1/2 -translate-y-1/2 sm:inset-auto sm:translate-y-0 sm:absolute sm:right-0 sm:top-full sm:mt-2 z-[90] w-auto sm:w-[380px] rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1e1e30] shadow-2xl shadow-black/10 dark:shadow-black/50">
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

          {/* Calendar — react-day-picker */}
          <div className="px-3 sm:px-4 py-3 rdp-custom">
            <DayPicker
              mode="single"
              navLayout="around"
              selected={selecting === "start" ? currentTemp.start : currentTemp.end}
              onSelect={handleDateSelect}
              month={calMonth}
              onMonthChange={setCalMonth}
              showOutsideDays
              fixedWeeks
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              classNames={{
                root: "w-full",
                months: "w-full",
                month: "w-full flex flex-wrap items-center mb-3",
                month_caption: "flex-1 flex items-center justify-center",
                caption_label: "text-sm font-semibold text-gray-700 dark:text-gray-200",
                button_previous:
                  "w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors order-first",
                button_next:
                  "w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors order-2",
                month_grid: "w-full order-last mt-2",
                hidden: "invisible",
                disabled: "opacity-30 cursor-default",
              }}
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
