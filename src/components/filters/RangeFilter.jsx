import React from "react";

const RangeFilter = ({ icon, label }) => (
  <div className="px-3 py-1.5 flex items-center justify-between group">
    <div className="flex items-center gap-2">
      <span className="text-gray-400 dark:text-[#888] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {icon}
      </span>
      <span className="text-[10px] font-semibold text-gray-500 dark:text-[#ccc] uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="flex items-center gap-1 w-24">
      <input
        type="number"
        placeholder="Min"
        className="w-full bg-transparent border-b border-gray-200 dark:border-[#444] pb-0.5 text-[10px] text-gray-800 dark:text-gray-200 outline-none focus:border-indigo-500/50 transition-colors placeholder:text-gray-400 dark:placeholder:text-[#666] text-center"
      />
      <span className="text-gray-400 dark:text-[#666] text-[9px]">–</span>
      <input
        type="number"
        placeholder="Max"
        className="w-full bg-transparent border-b border-gray-200 dark:border-[#444] pb-0.5 text-[10px] text-gray-800 dark:text-gray-200 outline-none focus:border-indigo-500/50 transition-colors placeholder:text-gray-400 dark:placeholder:text-[#666] text-center"
      />
    </div>
  </div>
);

export default RangeFilter;
