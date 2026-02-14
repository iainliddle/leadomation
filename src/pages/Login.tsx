import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo-full.png';

interface LoginProps {
    onLogin: () => void;
    onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login submitted:', { email, password });
        onLogin();
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="mb-10 transform hover:scale-105 transition-transform duration-500">
                <img src={logo} alt="Leadomation" className="w-52 h-auto" />
            </div>

            <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-[#111827] tracking-tight">Welcome back</h1>
                    <p className="text-base text-[#6B7280] font-medium mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block pl-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3.5 bg-gray-50/50 border border-[#E5E7EB] rounded-2xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div className="relative">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block">Password</label>
                            <button type="button" className="text-[10px] font-black text-primary hover:underline transition-all uppercase tracking-widest">Forgot password?</button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 bg-gray-50/50 border border-[#E5E7EB] rounded-2xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-gray-300"
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

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-[0.98] mt-4"
                    >
                        SIGN IN
                    </button>
                </form>

                <p className="text-center text-sm font-bold text-[#6B7280] mt-10">
                    Don't have an account?{' '}
                    <button
                        onClick={onGoToRegister}
                        className="text-primary hover:underline decoration-2 underline-offset-4"
                    >
                        Start free trial
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
