import React, { useState, useRef, useCallback, useEffect } from "react";

/**
 * Format large numbers: 1000 → 1K, 1500000 → 1.5M
 */
const formatNum = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + "K";
  return n.toString();
};

const RangeFilter = ({ icon, label, min = 0, max = 100000, step = 500, value, onChange }) => {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);
  const [dragging, setDragging] = useState(null); // "min" | "max" | null
  const [expanded, setExpanded] = useState(false);
  const trackRef = useRef(null);

  // Sync from parent
  useEffect(() => {
    if (!dragging) {
      setLocalMin(value[0]);
      setLocalMax(value[1]);
    }
  }, [value, dragging]);

  const pct = (v) => ((v - min) / (max - min)) * 100;

  const getValueFromPosition = useCallback(
    (clientX) => {
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      return Math.round(raw / step) * step;
    },
    [min, max, step],
  );

  const handlePointerDown = (thumb) => (e) => {
    e.preventDefault();
    setDragging(thumb);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const val = getValueFromPosition(clientX);
      if (dragging === "min") {
        const clamped = Math.min(val, localMax - step);
        setLocalMin(Math.max(min, clamped));
      } else {
        const clamped = Math.max(val, localMin + step);
        setLocalMax(Math.min(max, clamped));
      }
    };

    const handleUp = () => {
      setDragging(null);
      // Commit to parent
      const finalMin = dragging === "min" ? Math.max(min, Math.min(localMin, localMax - step)) : localMin;
      const finalMax = dragging === "max" ? Math.min(max, Math.max(localMax, localMin + step)) : localMax;
      onChange([finalMin, finalMax]);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [dragging, localMin, localMax, min, max, step, getValueFromPosition, onChange]);

  const isFiltered = localMin > min || localMax < max;
  const leftPct = pct(localMin);
  const rightPct = pct(localMax);

  return (
    <div className="px-3">
      {/* Header row — clickable to expand/collapse */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between py-2 group"
      >
        <div className="flex items-center gap-2">
          <span
            className={`transition-colors ${
              isFiltered
                ? "text-indigo-500"
                : "text-gray-400 dark:text-[#666] group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
            }`}
          >
            {icon}
          </span>
          <span className="text-[11px] font-semibold text-gray-600 dark:text-[#bbb] uppercase tracking-wider">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Value pills */}
          {isFiltered && (
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-[9px] font-bold text-indigo-500 dark:text-indigo-400">
              {formatNum(localMin)} – {formatNum(localMax)}
            </span>
          )}
          <svg
            className={`w-3 h-3 text-gray-400 dark:text-[#555] transition-transform ${expanded ? "rotate-90" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>

      {/* Slider area */}
      {expanded && (
        <div className="pb-3 pt-1 px-1">
          {/* Value display row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-medium text-gray-400 dark:text-[#555] uppercase tracking-wider mb-0.5">
                Min
              </span>
              <span className="text-xs font-bold text-gray-700 dark:text-white tabular-nums bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-[#222] rounded-md px-2 py-0.5">
                {formatNum(localMin)}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-4 h-px bg-gray-200 dark:bg-[#333]" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-medium text-gray-400 dark:text-[#555] uppercase tracking-wider mb-0.5">
                Max
              </span>
              <span className="text-xs font-bold text-gray-700 dark:text-white tabular-nums bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-[#222] rounded-md px-2 py-0.5">
                {formatNum(localMax)}
              </span>
            </div>
          </div>

          {/* Track */}
          <div
            ref={trackRef}
            className="relative h-10 flex items-center cursor-pointer"
          >
            {/* Background track */}
            <div className="absolute inset-x-0 h-1.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a]" />

            {/* Active range fill */}
            <div
              className="absolute h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-sm shadow-indigo-500/20"
              style={{
                left: `${leftPct}%`,
                width: `${rightPct - leftPct}%`,
              }}
            />

            {/* Min thumb */}
            <div
              onMouseDown={handlePointerDown("min")}
              onTouchStart={handlePointerDown("min")}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 transition-shadow ${
                dragging === "min" ? "z-20" : ""
              }`}
              style={{ left: `${leftPct}%` }}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  dragging === "min"
                    ? "bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/40 scale-110"
                    : "bg-white dark:bg-[#1a1a1a] border-indigo-500 hover:shadow-md hover:shadow-indigo-500/30 hover:scale-105"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>
              </div>

              {/* Floating tooltip */}
              {dragging === "min" && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-indigo-600 text-[10px] font-bold text-white whitespace-nowrap shadow-lg">
                  {formatNum(localMin)}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-indigo-600" />
                </div>
              )}
            </div>

            {/* Max thumb */}
            <div
              onMouseDown={handlePointerDown("max")}
              onTouchStart={handlePointerDown("max")}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 transition-shadow ${
                dragging === "max" ? "z-20" : ""
              }`}
              style={{ left: `${rightPct}%` }}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  dragging === "max"
                    ? "bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/40 scale-110"
                    : "bg-white dark:bg-[#1a1a1a] border-indigo-500 hover:shadow-md hover:shadow-indigo-500/30 hover:scale-105"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>
              </div>

              {/* Floating tooltip */}
              {dragging === "max" && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-indigo-600 text-[10px] font-bold text-white whitespace-nowrap shadow-lg">
                  {formatNum(localMax)}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-indigo-600" />
                </div>
              )}
            </div>
          </div>

          {/* Scale labels */}
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-[9px] text-gray-400 dark:text-[#444] tabular-nums">
              {formatNum(min)}
            </span>
            <span className="text-[9px] text-gray-400 dark:text-[#444] tabular-nums">
              {formatNum(max)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeFilter;
