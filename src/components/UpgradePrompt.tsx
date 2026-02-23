interface UpgradePromptProps {
    message: string;
    onClose: () => void;
    onUpgrade: () => void;
}

const UpgradePrompt = ({ message, onClose, onUpgrade }: UpgradePromptProps) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-[#111827]">Upgrade to Pro</h3>
            </div>
            <p className="text-sm text-[#4B5563] mb-6 leading-relaxed">{message}</p>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-all"
                >
                    Maybe Later
                </button>
                <button
                    onClick={onUpgrade}
                    className="flex-1 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-indigo-100"
                >
                    Upgrade to Pro →
                </button>
            </div>
        </div>
    </div>
);

export default UpgradePrompt;
