import React, { useEffect } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface TermsOfServiceProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack, onNavigate }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 px-8 py-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-400 opacity-10 blur-3xl"></div>

                    <div className="flex justify-center mb-6 relative z-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                            <Shield className="text-cyan-400 w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 relative z-10">Terms of Service</h1>
                    <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest relative z-10">Leadomation is operated by Lumarr Ltd</p>
                    <p className="text-indigo-200/60 text-xs mt-4 relative z-10">Last updated: March 2026</p>
                </div>

                <div className="p-8 md:p-12 prose prose-indigo max-w-none text-gray-600">
                    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                        <p className="m-0">By using Leadomation, you agree to these terms. Please also read our <button onClick={() => onNavigate('Privacy')} className="text-indigo-600 font-bold hover:underline">Privacy Policy</button> and <button onClick={() => onNavigate('Refund')} className="text-indigo-600 font-bold hover:underline">Refund Policy</button>.</p>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h3>
                    <p>By accessing or using the Leadomation platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. About Leadomation</h3>
                    <p>Leadomation is a B2B lead generation platform providing tools for email outreach, AI voice calls, lead scraping, CRM management, and deal pipeline tracking. The platform is operated by Lumarr Ltd.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Eligibility</h3>
                    <p>You must be at least 18 years old to use Leadomation. The platform is strictly for business-to-business (B2B) use only. Consumer targeting is prohibited.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Free Trial</h3>
                    <p>We offer a 7-day free trial requiring a valid credit card. Your card will be automatically billed at the end of the trial unless cancelled prior. A reminder email will be sent 2 days before the trial ends. CSV exporting is restricted during the trial period.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Subscriptions and Billing</h3>
                    <p>Subscriptions are billed automatically (e.g., Starter £49/mo for 50 searches, Pro £149/mo for unlimited). Subscriptions auto-renew until cancelled. We will provide 30 days notice for any price changes. Failed payments may result in immediate account suspension.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Cancellation</h3>
                    <p>You may cancel your subscription at any time. You will retain access to the platform until the end of your current billing period. We do not provide partial refunds for unused days. Your data will be retained for 30 days following cancellation before permanent deletion.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Acceptable Use</h3>
                    <p>You agree not to use Leadomation for sending spam, making illegal or non-compliant calls, or targeting consumers where restricted by law. Impersonation of other businesses or individuals, and reselling of our services without prior authorization, are strictly prohibited.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. AI Voice Calling Special Terms</h3>
                    <p>When using our AI Voice Calling feature, you are considered the "caller" and are entirely responsible for legal compliance. Compliance with TCPA, PECR, GDPR, and other local telemarketing laws is your sole responsibility. We strongly recommend disclosing the use of AI during calls. Call recording laws vary by jurisdiction; you must ensure compliance (e.g., obtaining consent where required). Use within the US is subject to A2P 10DLC restrictions and registration requirements.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Data Scraping and Lead Generation</h3>
                    <p>Our platform aggregates data using services such as Apify and Google Maps. Users must rely on GDPR legitimate interest for processing B2B data. User's generated or imported data is kept isolated and is not shared with or sold to other Leadomation users or third parties.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Third-Party Services</h3>
                    <p>Leadomation integrates with several third-party services to provide its functionality, including but not limited to: Supabase, Stripe, Apify, Hunter.io, Vapi.ai, Twilio, ElevenLabs, Resend, Anthropic Claude API, and DataForSEO. Your use of the platform is also subject to the acceptable use policies of these providers.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">11. Intellectual Property</h3>
                    <p>The Leadomation platform, code, design, and branding are the intellectual property of Lumarr Ltd. You retain full ownership of all data, leads, and content you import or generate within your account.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">12. Disclaimers and Limitation of Liability</h3>
                    <p>The platform is provided "as-is" without any warranties. We do not guarantee specific lead generation results or delivery rates. In no event shall Lumarr Ltd's liability exceed the total fees paid by you in the 3 months preceding the claim.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">13. Indemnification</h3>
                    <p>You agree to indemnify and hold harmless Lumarr Ltd from any claims, damages, or legal fees arising from your illegal use of the platform, including but not limited to unlawful calls or emails.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">14. Account Termination</h3>
                    <p>You may cancel your account at any time. Lumarr Ltd reserves the right to terminate or suspend your account immediately, without prior notice or refund, for any violation of these Terms of Service.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">15. Modifications to Terms</h3>
                    <p>We may modify these terms at any time. We will provide 14 days written notice via email for any material changes to these terms.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">16. Governing Law</h3>
                    <p>These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the United Arab Emirates (UAE).</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">17. Contact</h3>
                    <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:support@leadomation.co.uk" className="text-indigo-600 hover:underline">support@leadomation.co.uk</a>.</p>

                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center text-xs font-bold text-gray-400">
                &copy; {new Date().getFullYear()} Lumarr Ltd. All rights reserved.
            </div>
        </div>
    );
};

export default TermsOfService;
