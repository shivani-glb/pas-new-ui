import React from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';

const AIAnalysisModal = ({ ad, analysis, isAnalyzing, onClose }) => {
    if (!ad) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-[#222] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="px-5 py-4 border-b border-[#1c1c1c] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-indigo-400" size={16} />
                        <h3 className="font-bold text-sm text-[#ccc]">AI Strategy Audit</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors text-[#888] hover:text-white">
                        <X size={16} />
                    </button>
                </div>
                <div className="p-5 overflow-y-auto">
                    {isAnalyzing ? (
                        <div className="py-12 flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-indigo-500" size={28} />
                            <p className="text-xs text-[#aaa]">Decoding ad psychology...</p>
                        </div>
                    ) : (
                        <div className="text-[#ccc] text-sm whitespace-pre-line leading-relaxed">{analysis}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIAnalysisModal;
