import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Zap } from 'lucide-react';
import logo from '../assets/logo-full.png';

interface RegisterProps {
    onRegister: () => void;
    onGoToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onGoToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Register submitted:', { name, email, password, confirmPassword, agreed });
        onRegister();
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 transform hover:scale-105 transition-transform duration-500">
                <img src={logo} alt="Leadomation" className="w-52 h-auto" />
            </div>

            <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-[#111827] tracking-tight">Start your 7-day free trial</h1>
                    <p className="text-base text-[#6B7280] font-medium mt-2">Full Pro access. No credit card required.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block pl-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-[#E5E7EB] rounded-2xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block pl-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-[#E5E7EB] rounded-2xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div className="relative">
                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block pl-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-gray-50/50 border border-[#E5E7EB] rounded-2xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block pl-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-gray-50/50 border border-[#E5E7EB] rounded-2xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group mt-6 pl-1">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={() => setAgreed(!agreed)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-gray-200 transition-all checked:border-primary checked:bg-primary"
                            />
                            <CheckIcon className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                        </div>
                        <span className="text-xs font-bold text-[#6B7280] group-hover:text-[#4B5563] transition-colors">
                            I agree to the <button type="button" className="text-primary hover:underline underline-offset-2">Terms of Service</button> and <button type="button" className="text-primary hover:underline underline-offset-2">Privacy Policy</button>
                        </span>
                    </label>

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-[0.98] mt-6"
                    >
                        CREATE ACCOUNT
                    </button>
                </form>

                <div className="flex items-center justify-center gap-6 mt-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-tight">Secure signup</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" />
                        <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-tight">Pro access for 7 days</span>
                    </div>
                </div>

                <p className="text-center text-sm font-bold text-[#6B7280] mt-8">
                    Already have an account?{' '}
                    <button
                        onClick={onGoToLogin}
                        className="text-primary hover:underline decoration-2 underline-offset-4"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
};

// Internal Helper
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default Register;
