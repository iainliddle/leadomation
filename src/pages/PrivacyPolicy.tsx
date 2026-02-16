import React from 'react';
import logo from '../assets/logo-full.png';

interface PrivacyPolicyProps {
    onGoToLogin: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onGoToLogin }) => {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12 px-6 animate-in fade-in duration-700">
            <button
                onClick={onGoToLogin}
                className="mb-10 transform hover:scale-105 transition-transform duration-500"
            >
                <img src={logo} alt="Leadomation" className="w-48 h-auto" />
            </button>

            <div className="w-full max-w-3xl bg-white rounded-3xl p-8 md:p-12 border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h1 className="text-3xl font-black text-[#111827] mb-2">Privacy Policy</h1>
                <p className="text-sm font-bold text-[#9CA3AF] uppercase tracking-widest mb-10">Last updated: February 2026</p>

                <div className="space-y-8 text-[#4B5563] leading-relaxed">
                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">1. Information We Collect</h2>
                        <p className="text-sm font-medium mb-4">
                            We collect information that you provide directly to us when you create an account, such as your name, email address, and billing information.
                        </p>
                        <p className="text-sm font-medium">
                            We also collect data through your use of the Service, including IP addresses, browser type, and usage patterns.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">2. How We Use Your Information</h2>
                        <p className="text-sm font-medium">
                            We use the information we collect to operate and improve our Service, process transactions, communicate with you, and personalize your experience.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">3. Data Storage & Security</h2>
                        <p className="text-sm font-medium">
                            We take reasonable measures to protect your personal information from loss, theft, and unauthorized access. However, no data transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">4. Third-Party Services</h2>
                        <p className="text-sm font-medium mb-4">
                            We use various third-party services to provide the Service, including:
                        </p>
                        <ul className="list-disc list-inside text-sm font-bold space-y-2 text-[#111827]">
                            <li>Supabase (Database & Authentication)</li>
                            <li>Stripe (Payments)</li>
                            <li>Google Maps API (Location data)</li>
                            <li>Hunter.io (Email verification)</li>
                            <li>Microsoft Graph API (Email integration)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">5. Your Rights (GDPR)</h2>
                        <p className="text-sm font-medium">
                            Leadomation is operated by Lumarr Ltd, a company based in the United Kingdom. If you are located in the EEA or UK, you have certain rights under the GDPR, including the right to access, correct, or delete your personal data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">6. Data Retention</h2>
                        <p className="text-sm font-medium">
                            We store your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">7. Cookies</h2>
                        <p className="text-sm font-medium">
                            We use cookies to enhance your experience. You can manage your cookie preferences through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-black text-[#111827] mb-3 uppercase tracking-tight">8. Contact Information</h2>
                        <p className="text-sm font-medium">
                            If you have any questions about this Privacy Policy, please contact us at <span className="text-primary font-bold">privacy@leadomation.co.uk</span>.
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

export default PrivacyPolicy;
