import React from 'react';

const NavItem = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${
        active ? 'bg-white/[0.06] text-white' : 'text-[#888] hover:bg-white/[0.04] hover:text-[#ccc]'
    }`}>
        <span className={active ? 'text-indigo-400' : 'text-inherit'}>{icon}</span>
        {label}
    </button>
);

export default NavItem;
