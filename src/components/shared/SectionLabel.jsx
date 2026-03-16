import { ChevronDown } from "lucide-react";

const SectionLabel = ({ label, collapsible, isOpen, onToggle }) => (
  <div
    onClick={collapsible ? onToggle : undefined}
    className={`px-3 pt-4 pb-2 group flex items-center justify-between text-[11px] font-bold uppercase tracking-wider transition-colors ${
      collapsible
        ? "cursor-pointer text-gray-500 dark:text-[#999] hover:text-gray-700 dark:hover:text-white"
        : "text-gray-400 dark:text-[#ccc] hover:text-gray-700 dark:hover:text-white"
    }`}
  >
    {label}
    {collapsible && (
      <ChevronDown
        size={11}
        className={`transition-transform duration-300 hover:text-gray-900 group:dark:hover:text-white ${isOpen ? "" : "-rotate-90"}`}
      />
    )}
  </div>
);

export default SectionLabel;
