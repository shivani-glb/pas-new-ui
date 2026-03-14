import React from 'react';

// Receives Icon as a component reference (e.g. Icon={Facebook}), not a JSX element
const PlatformTab = ({ Icon, label, active, onClick, color }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${
            active ? 'bg-white/[0.08] text-white shadow ring-1 ring-white/10' : 'text-[#888] hover:text-[#ccc] hover:bg-white/[0.04]'
        }`}
    >
        <span className={active ? color : 'text-[#666]'}>
            <Icon size={13} />
        </span>
        {label}
    </button>
);

export default PlatformTab;
