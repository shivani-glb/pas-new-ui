import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Check } from "lucide-react";

const SortDropdown = ({ options, activeTab, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Convert activeTab to array if it's not already, for backwards compatibility and easy toggling
  const selected = Array.isArray(activeTab)
    ? activeTab
    : [activeTab].filter(Boolean);
  const hasSelection = selected.length > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    let nextSelected;
    if (selected.includes(option)) {
      nextSelected = selected.filter((o) => o !== option);
    } else {
      nextSelected = [...selected, option];
    }
    onSelect(nextSelected);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
          open
            ? "bg-indigo-600 dark:bg-indigo-600/50 border-indigo-500 text-white"
            : "bg-white dark:bg-[#111] border-gray-200 dark:border-[#1c1c1c] text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#333]"
        }`}
        aria-label="Sort options"
      >
        <SlidersHorizontal size={14} />

        {/* Notification badge */}
        {hasSelection && (
          <span
            className={`absolute  flex items-center justify-center bg-indigo-500 dark:bg-indigo-600 rounded-full border-2 border-white dark:border-[#1c1c1c] p-1 text-[8px] ${selected.length > 1 ? " w-5 h-5 -top-2 -right-2" : " w-3.5 h-3.5 -top-1.5 -right-1.5"} font-bold text-white`}
          >
            {selected.length > 1 ? selected.length : ""}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 z-50 w-48 py-1 rounded-xl border border-gray-200 dark:border-[#1c1c1c] bg-white dark:bg-[#111] shadow-xl shadow-black/10 dark:shadow-black/40">
          <div className="px-3 py-1.5 mb-0.5">
            <span className="text-[10px] font-bold text-gray-400 dark:text-[#555] uppercase tracking-widest">
              Sort by
            </span>
          </div>
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-[#999] hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="uppercase tracking-wider text-[11px]">
                  {option}
                </span>
                {isSelected && <Check size={13} className="text-indigo-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
