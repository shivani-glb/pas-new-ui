import React from "react";
import { X } from "lucide-react";

const FilterChip = ({ label, onRemove }) => (
  <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
    {label}
    <button
      onClick={onRemove}
      className="hover:text-red-400 transition-colors ml-0.5"
    >
      <X size={9} />
    </button>
  </span>
);

export default FilterChip;
