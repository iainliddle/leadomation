import React from 'react';

const campaigns = [
    { name: 'Direct Outreach Q1', type: 'Direct', color: '#2563EB', bgColor: 'bg-blue-50', textColor: 'text-[#2563EB]', rate: '14.2%', progress: 75 },
    { name: 'UK Tech Founders', type: 'Specifier', color: '#7C3AED', bgColor: 'bg-purple-50', textColor: 'text-[#7C3AED]', rate: '12.8%', progress: 62 },
    { name: 'SaaS Warm Series', type: 'Warm', color: '#D97706', bgColor: 'bg-amber-50', textColor: 'text-[#D97706]', rate: '9.5%', progress: 45 },
    { name: 'Enterprise Lead Gen', type: 'Direct', color: '#2563EB', bgColor: 'bg-blue-50', textColor: 'text-[#2563EB]', rate: '8.2%', progress: 38 },
];

const TopCampaigns: React.FC = () => {
    return (
        <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-[#111827]">Top Performing Campaigns</h3>
            </div>

            <div className="flex-1 space-y-6">
                {campaigns.map((campaign, index) => (
                    <div key={index} className="group cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-sm font-bold text-[#111827] group-hover:text-primary transition-colors">{campaign.name}</p>
                                <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${campaign.bgColor} ${campaign.textColor}`}>
                                    {campaign.type}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[#111827]">{campaign.rate}</p>
                                <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Reply Rate</p>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${campaign.progress}%`,
                                    backgroundColor: campaign.color
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-10 py-2 text-sm font-bold text-primary hover:text-blue-700 transition-colors flex items-center justify-center gap-1 border-t border-[#F3F4F6] pt-6">
                View All Campaigns
            </button>
        </div>
    );
};

export default TopCampaigns;
