import React from 'react';
import { BrainCircuit, X, Loader2 } from 'lucide-react';

const CampaignModal = ({ isOpen, strategy, isGenerating, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-[#222] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="px-5 py-4 border-b border-[#1c1c1c] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="text-indigo-400" size={16} />
                        <h3 className="font-bold text-sm text-[#ccc]">Campaign Strategy Genie</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors text-[#888] hover:text-white">
                        <X size={16} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isGenerating ? (
                        <div className="py-16 flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-indigo-500" size={36} />
                            <p className="font-bold text-xs text-[#aaa]">Building 30-Day Masterplan...</p>
                        </div>
                    ) : (
                        <div className="text-[#ccc] text-sm whitespace-pre-line leading-loose">{strategy}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignModal;
