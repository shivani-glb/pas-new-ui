import React from 'react';
import { Play, ThumbsUp, Eye, Share2, Zap, ExternalLink } from 'lucide-react';
import StatPill from '../shared/StatPill';

const AdCard = ({ ad, onAnalyze }) => {
    return (
        <div className="group cursor-pointer flex flex-col bg-[#111] rounded-xl border border-[#1c1c1c] hover:border-[#2a2a2a] overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-black/40 relative">

            <div className="absolute top-2 left-2 z-10 flex gap-1">
                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${ad.adType === 'Video' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {ad.adType}
                </span>
            </div>
            <div className="absolute top-2 right-2 z-10">
                <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-black/60 text-[#888] backdrop-blur-sm">
                    {ad.country}
                </span>
            </div>

            <div className="relative aspect-video bg-[#161616] overflow-hidden">
                <img src={ad.thumbnail} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                        <Play fill="white" size={16} />
                    </div>
                </div>
            </div>

            <div className="p-3.5 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[9px] font-black border border-indigo-500/20">
                            {ad.advertiser[0]}
                        </div>
                        <span className="text-[10px] font-semibold text-[#555] truncate max-w-[90px]">{ad.advertiser}</span>
                    </div>
                    <span className="text-[9px] text-[#333] font-medium">{ad.date}</span>
                </div>

                <h3 className="font-bold text-[12px] line-clamp-2 leading-snug mb-1.5 text-[#e0e0e0] group-hover:text-white transition-colors">
                    {ad.title}
                </h3>
                <p className="text-[10px] text-[#888] line-clamp-1 mb-3">{ad.subtitle}</p>

                <div className="mt-auto space-y-2.5">
                    <div className="grid grid-cols-3 gap-1.5">
                        <StatPill icon={<ThumbsUp size={10} className="text-indigo-400" />} value={ad.likes} />
                        <StatPill icon={<Eye size={10} className="text-[#555]" />} value={ad.views} />
                        <StatPill icon={<Share2 size={10} className="text-green-500" />} value={ad.shares} />
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAnalyze(ad); }}
                        className="w-full py-2 bg-indigo-600/8 hover:bg-indigo-600/15 text-indigo-400 border border-indigo-500/15 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 hover:border-indigo-500/30"
                    >
                        <Zap size={11} /> AI AUDIT
                    </button>
                    <div className="flex gap-1.5">
                        <button className="flex-1 py-1.5 bg-[#161616] hover:bg-[#1c1c1c] text-[#aaa] hover:text-white rounded-lg text-[10px] font-bold border border-[#1c1c1c] transition-colors">
                            Analytics
                        </button>
                        <button className="px-2.5 py-1.5 bg-[#161616] hover:bg-[#1c1c1c] text-[#aaa] hover:text-white rounded-lg border border-[#1c1c1c] transition-colors">
                            <ExternalLink size={11} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdCard;
