import React, { useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface RefundPolicyProps {
    onBack: () => void;
}

const RefundPolicy: React.FC<RefundPolicyProps> = ({ onBack }) => {
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
                            <RefreshCw className="text-cyan-400 w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 relative z-10">Refund Policy</h1>
                    <p className="text-indigo-200/60 text-xs mt-4 relative z-10">Last updated: March 2026</p>
                </div>

                <div className="p-8 md:p-12 prose prose-indigo max-w-none text-gray-600">
                    <h3 className="text-xl font-bold text-gray-900 mt-0 mb-4">1. Overview</h3>
                    <p>We provide a free trial so you can evaluate Leadomation before committing. Once a charge has been made, we generally do not offer refunds. However, we are real people and will listen to genuine issues.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Free Trial</h3>
                    <p>While a card is required to start your 7-day free trial, you will not be charged during this period. We send a reminder email 2 days before the trial ends so you have ample time to evaluate the platform. If you cancel before the trial ends, you will not be charged.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Monthly Subscriptions: No Refunds</h3>
                    <p>Monthly subscriptions are strictly non-refundable once charged. We do not provide pro-rata refunds for unused days within a billing cycle. Upon cancellation, you will retain full access to your account until the end of your current billing period.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Annual Subscriptions</h3>
                    <p>For annual subscriptions, we offer a 14-day refund window from the date of initial purchase, provided that you have run fewer than 2 campaigns and made fewer than 10 AI voice calls. After 14 days, or if these usage limits are exceeded, the subscription becomes entirely non-refundable.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Exceptions: When We Will Issue a Refund</h3>
                    <p>We will issue a refund or account credit in the following three scenarios:</p>
                    <ul>
                        <li><strong>Duplicate or Accidental Charge:</strong> If our system accidentally double-bills you.</li>
                        <li><strong>Platform Downtime:</strong> If there is verified platform downtime exceeding 48 cumulative hours in a single month (issued as account credit, not a cash refund).</li>
                        <li><strong>Billing Error:</strong> If you are billed for a new cycle after you have received confirmation of your cancellation.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Chargebacks</h3>
                    <p>Please contact us at <a href="mailto:support@leadomation.co.uk" className="text-indigo-600 font-bold hover:underline">support@leadomation.co.uk</a> to resolve any billing issues before filing a dispute with your bank. Filing a chargeback without contacting us first covers our business in administrative fees and will result in the immediate and permanent suspension of your account and all associated campaigns.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. How to Request a Refund</h3>
                    <p>If you believe you qualify for an exception, email <a href="mailto:support@leadomation.co.uk" className="text-indigo-600 font-bold hover:underline">support@leadomation.co.uk</a> with your account details and the reason for the request. We aim to respond to all inquiries within 1 business day.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Cancellation</h3>
                    <p>You may cancel your subscription at any time directly from your account settings. After cancellation, you can continue using Leadomation until your current prepaid period ends. Your data will be kept for 30 days before being permanently deleted.</p>

                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Contact</h3>
                    <p>If you have any questions regarding this Refund Policy, please contact us at <a href="mailto:support@leadomation.co.uk" className="text-indigo-600 font-bold hover:underline">support@leadomation.co.uk</a>.</p>
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

export default RefundPolicy;
