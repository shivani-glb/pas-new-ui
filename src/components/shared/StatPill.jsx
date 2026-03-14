import React from "react";

const StatPill = ({ icon, value }) => (
  <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 dark:bg-white/[0.03] rounded-lg text-[11px] font-bold text-gray-600 dark:text-[#aaa] justify-center border border-gray-100 dark:border-white/[0.03]">
    {icon}
    <span>{value}</span>
  </div>
);

export default StatPill;
