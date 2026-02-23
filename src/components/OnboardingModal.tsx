import React, { useState } from 'react';
import { Rocket, Search, Mail, Zap, CheckCircle2, ChevronRight, ChevronLeft, X, Phone } from 'lucide-react';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    if (!isOpen) return null;

    const completeOnboarding = async () => {
        onClose();
    };

    const nextStep = async () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            await completeOnboarding();
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 bg-blue-50 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <Rocket size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-[#111827] mb-3 tracking-tight">Welcome to Leadomation! 🚀</h2>
                        <p className="text-lg font-bold text-primary mb-6">Let's get you set up in under 2 minutes</p>
                        <p className="text-base text-[#6B7280] font-medium leading-relaxed max-w-md mx-auto">
                            Leadomation is your all-in-one platform for B2B lead generation. We help you find targets, verify data, and launch AI-powered outreach that actually gets replies.
                        </p>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-black text-[#111827] tracking-tight">How it works</h2>
                            <p className="text-sm font-bold text-[#6B7280] mt-2">Four simple steps to scaling your outreach</p>
                        </div>
                        <div className="space-y-6">
                            {[
                                { icon: Search, title: "1. Search for businesses", desc: "Specify industry and location to find your ideal customer profile in our global database." },
                                { icon: Mail, title: "2. We find contact details", desc: "Our engine retrieves verified business emails, LinkedIn profiles, and verified phone numbers." },
                                { icon: Zap, title: "3. AI-Powered Outreach", desc: "Launch personalised email and LinkedIn sequences that adapt to your target's style automatically." },
                                { icon: Phone, title: "4. AI Voice Call Agent", desc: "Our AI even calls leads by phone to introduce your business and book meetings for you." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/30">
                                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-primary shrink-0 shadow-sm">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-[#111827] uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-sm font-medium text-[#6B7280] mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-[#111827] mb-3 tracking-tight">You're all set!</h2>
                        <p className="text-base text-[#6B7280] font-medium leading-relaxed max-w-md mx-auto mb-8">
                            Head over to <span className="text-[#111827] font-black">New Campaign</span> to start scraping your first batch of leads. Your journey to automated growth starts here.
                        </p>
                        <button
                            onClick={completeOnboarding}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-[0.98]"
                        >
                            GO TO DASHBOARD
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-[#111827] transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-10 md:p-12">
                    {renderPageContent()}

                    {step < 3 && (
                        <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
                            <div className="flex gap-2">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-primary' : 'w-2 bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-3">
                                {step > 1 && (
                                    <button
                                        onClick={prevStep}
                                        className="px-4 py-2 text-sm font-bold text-[#6B7280] hover:text-[#111827] transition-all flex items-center gap-2"
                                    >
                                        <ChevronLeft size={18} />
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                    Next
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    function renderPageContent() {
        return renderStep();
    }
};

export default OnboardingModal;
