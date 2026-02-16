import React from 'react';
import logo from '../assets/logo-full.png';

interface TermsOfServiceProps {
    onGoToLogin: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onGoToLogin }) => {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12 px-6 animate-in fade-in duration-700">
            <button
                onClick={onGoToLogin}
                className="mb-10 transform hover:scale-105 transition-transform duration-500"
            >
                <img src={logo} alt="Leadomation" className="w-48 h-auto" />
            </button>

            <div className="w-full max-w-3xl bg-white rounded-3xl p-8 md:p-12 border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h1 className="text-3xl font-black text-[#111827] mb-2">Terms of Service</h1>
                <p className="text-sm font-bold text-[#9CA3AF] uppercase tracking-widest mb-10">Last updated: February 2026</p>

                <div className="space-y-8 text-[#4B5563] leading-relaxed">
                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">1. Acceptance of Terms</h2>
                        <p className="text-sm font-medium">
                            By accessing or using Leadomation (the "Service"), operated by Lumarr Ltd ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">2. Description of Service</h2>
                        <p className="text-sm font-medium">
                            Leadomation is a B2B lead generation and automation platform that provides tools for finding, managing, and contacting business leads. We reserve the right to modify or discontinue the Service at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">3. User Accounts</h2>
                        <p className="text-sm font-medium">
                            To use certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">4. Subscription & Billing</h2>
                        <p className="text-sm font-medium">
                            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Subscription fees are non-refundable except as required by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">5. Acceptable Use</h2>
                        <p className="text-sm font-medium">
                            You agree not to use the Service for any unlawful purpose or in any way that violates the rights of others. This includes, but is not limited to, sending spam, harvesting data without consent, or attempting to interfere with the Service's security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">6. Data & Privacy</h2>
                        <p className="text-sm font-medium">
                            Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of your information as outlined in that policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">7. Intellectual Property</h2>
                        <p className="text-sm font-medium">
                            The Service and its original content, features, and functionality are and will remain the exclusive property of Lumarr Ltd and its licensors.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">8. Limitation of Liability</h2>
                        <p className="text-sm font-medium">
                            In no event shall Lumarr Ltd be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or use.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">9. Termination</h2>
                        <p className="text-sm font-medium">
                            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">10. Contact Information</h2>
                        <p className="text-sm font-medium">
                            If you have any questions about these Terms, please contact us at <span className="text-primary font-bold">support@leadomation.co.uk</span>.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                    <button
                        onClick={onGoToLogin}
                        className="text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4"
                    >
                        Return to sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
