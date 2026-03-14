import React from "react";

// Receives Icon as a component reference (e.g. Icon={Facebook}), not a JSX element
const PlatformTab = ({ Icon, label, active, onClick, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${
      active
        ? "bg-gray-100 dark:bg-white/[0.08] text-gray-900 dark:text-white shadow ring-1 ring-gray-200 dark:ring-white/10"
        : "text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-[#ccc] hover:bg-gray-50 dark:hover:bg-white/[0.04]"
    }`}
  >
    <span className={active ? color : "text-gray-400 dark:text-[#666]"}>
      <Icon size={13} />
    </span>
    {label}
  </button>
);

export default PlatformTab;
