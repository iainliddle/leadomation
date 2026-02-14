import React from 'react';
import { Users, Mail, MessageCircle, Linkedin } from 'lucide-react';
import StatCard from '../components/StatCard';
import CampaignPerformance from '../components/CampaignPerformance';
import TopCampaigns from '../components/TopCampaigns';
import RecentActivity from '../components/RecentActivity';

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Leads"
                    value="2,847"
                    change="+12.5%"
                    isPositive={true}
                    subtitle="vs last month"
                    icon={Users}
                    iconColor="text-primary"
                />
                <StatCard
                    label="Emails Sent"
                    value="1,234"
                    change="+8.3%"
                    isPositive={true}
                    subtitle="vs last month"
                    icon={Mail}
                    iconColor="text-primary"
                />
                <StatCard
                    label="Reply Rate"
                    value="11.2%"
                    change="+2.1%"
                    isPositive={true}
                    subtitle="vs last month"
                    icon={MessageCircle}
                    iconColor="text-success"
                />
                <StatCard
                    label="LinkedIn Connections"
                    value="156"
                    change="-3.4%"
                    isPositive={false}
                    subtitle="vs last month"
                    icon={Linkedin}
                    iconColor="text-accent"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6">
                    <CampaignPerformance />
                </div>
                <div className="lg:col-span-4">
                    <TopCampaigns />
                </div>
            </div>

            {/* Activity Row */}
            <div className="grid grid-cols-1 gap-6">
                <RecentActivity />
            </div>
        </div>
    );
};

export default Dashboard;
