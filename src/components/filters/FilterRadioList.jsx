import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FilterRadioList = ({ label, options, value, onChange }) => {
    const [expandedCount, setExpandedCount] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const displayOptions = expandedCount ? options : options.slice(0, 5);
    const hiddenCount = options.length - 5;

    return (
        <div className="px-3 py-2">
            {label && (
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-between group mb-2"
                >
                    <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">{label}</span>
                    <ChevronDown size={12} className={`text-[#aaa] group-hover:text-white transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            )}
            
            <div className={`transition-all duration-200 overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
                <div className="space-y-1">
                    {displayOptions.map(opt => {
                        const on = value === opt;
                        return (
                            <button
                                key={opt}
                                onClick={() => onChange(opt)}
                                className="w-full flex items-center gap-2.5 py-1 text-[11px] group"
                            >
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${on ? 'border-indigo-600' : 'border-[#aaa] group-hover:border-white'}`}>
                                    {on && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                </div>
                                <span className={`transition-colors text-left ${on ? 'text-indigo-300 font-medium' : 'text-[#888] group-hover:text-white'}`}>
                                    {opt}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {!expandedCount && hiddenCount > 0 && (
                    <button
                        onClick={() => setExpandedCount(true)}
                        className="mt-1.5 text-[10px] text-red-500 hover:text-red-400 transition-colors text-left"
                    >
                        + {hiddenCount} more
                    </button>
                )}
                {expandedCount && hiddenCount > 0 && (
                    <button
                        onClick={() => setExpandedCount(false)}
                        className="mt-1.5 text-[10px] text-[#555] hover:text-[#888] transition-colors text-left"
                    >
                        Show less
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterRadioList;
