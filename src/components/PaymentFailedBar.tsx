import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentFailedBarProps {
    stripeSubscriptionStatus: string | null;
}

const PaymentFailedBar: React.FC<PaymentFailedBarProps> = ({ stripeSubscriptionStatus }) => {
    const navigate = useNavigate();

    // Only show for past_due or unpaid status (payment failed mid-subscription)
    if (stripeSubscriptionStatus !== 'past_due' && stripeSubscriptionStatus !== 'unpaid') {
        return null;
    }

    return (
        <div className="bg-[#EEF2FF] border-b border-[#4F46E5]/20 px-6 py-2.5 flex items-center justify-between">
            <span className="text-[#4F46E5] text-sm">
                Your payment failed. Please update your payment method to keep your account active.
            </span>
            <button
                onClick={() => navigate('/settings/profile')}
                className="text-[#4F46E5] text-sm font-medium underline hover:text-[#4338CA] transition-colors"
            >
                Update payment
            </button>
        </div>
    );
};

export default PaymentFailedBar;
