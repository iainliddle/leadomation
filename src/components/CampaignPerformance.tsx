import React from 'react';
import { ChevronDown } from 'lucide-react';

const CampaignPerformance: React.FC = () => {
    return (
        <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-lg font-bold text-[#111827]">Campaign Performance</h3>
                    <p className="text-xs text-[#9CA3AF]">Weekly interaction overview</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#374151] cursor-pointer hover:bg-gray-100 transition-colors">
                    Last 7 days
                    <ChevronDown size={14} className="text-[#9CA3AF]" />
                </div>
            </div>

            <div className="flex-1 min-h-[220px] relative">
                <svg className="w-full h-full overflow-visible px-2" viewBox="0 0 700 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((tick) => (
                        <line
                            key={tick}
                            x1="0"
                            y1={200 - (tick * 2)}
                            x2="700"
                            y2={200 - (tick * 2)}
                            stroke="#F3F4F6"
                            strokeWidth="1"
                            strokeDasharray="5 5"
                        />
                    ))}

                    {/* Area gradient */}
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Data Path Area (The Fill) */}
                    <path
                        d="M 0 150 C 50 145, 100 165, 100 160 C 150 155, 180 125, 200 120 C 250 115, 280 145, 300 140 C 350 135, 380 85, 400 80 C 450 75, 480 105, 500 100 C 550 95, 580 45, 600 40 C 650 35, 680 65, 700 60 V 200 H 0 Z"
                        fill="url(#chartGradient)"
                    />

                    {/* Main Line */}
                    <path
                        d="M 0 150 C 50 145, 100 165, 100 160 C 150 155, 180 125, 200 120 C 250 115, 280 145, 300 140 C 350 135, 380 85, 400 80 C 450 75, 480 105, 500 100 C 550 95, 580 45, 600 40 C 650 35, 680 65, 700 60"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Points */}
                    {[0, 100, 200, 300, 400, 500, 600, 700].map((x, i) => {
                        const points = [150, 160, 120, 140, 80, 100, 40, 60];
                        return (
                            <g key={i}>
                                <circle
                                    cx={x}
                                    cy={points[i]}
                                    r="5.5"
                                    fill="white"
                                    className="shadow-sm"
                                />
                                <circle
                                    cx={x}
                                    cy={points[i]}
                                    r="3.5"
                                    fill="#2563EB"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* X-Axis labels */}
                <div className="flex justify-between mt-8 px-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>
            </div>
        </div>
    );
};

export default CampaignPerformance;
