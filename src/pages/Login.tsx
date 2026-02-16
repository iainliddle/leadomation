import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import logo from '../assets/logo-full.png';
import { supabase } from '../lib/supabase';

interface LoginProps {
    onLogin: () => void;
    onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister }) => {
    const [view, setView] = useState<'login' | 'forgot-password'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetSent, setResetSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            console.log('Login successful:', data.session);
            onLogin();
        } catch (err: any) {
            setError(err.message || 'An error occurred during sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://leadomation.co.uk',
            });

            if (resetError) throw resetError;

            setResetSent(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred sending the reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="mb-10 transform hover:scale-105 transition-transform duration-500">
                <img src={logo} alt="Leadomation" className="w-52 h-auto" />
            </div>

            <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {view === 'login' ? (
                    <>
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
                                    <button
                                        type="button"
                                        onClick={() => { setView('forgot-password'); setError(null); }}
                                        className="text-[10px] font-black text-primary hover:underline transition-all uppercase tracking-widest"
                                    >
                                        Forgot password?
                                    </button>
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

                            {error && (
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        SIGNING IN...
                                    </>
                                ) : (
                                    'SIGN IN'
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm font-bold text-[#6B7280] mt-10">
                            Don't have an account?{' '}
                            <button
                                onClick={() => {
                                    console.log('Login page: Clicked start free trial');
                                    onGoToRegister();
                                }}
                                className="text-primary hover:underline decoration-2 underline-offset-4"
                            >
                                Start free trial
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-black text-[#111827] tracking-tight">Reset password</h1>
                            <p className="text-base text-[#6B7280] font-medium mt-2">Enter your email to receive a reset link</p>
                        </div>

                        {resetSent ? (
                            <div className="space-y-6 text-center animate-in zoom-in duration-300">
                                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                    <p className="text-sm font-bold text-emerald-600">Password reset link sent! Check your email.</p>
                                </div>
                                <button
                                    onClick={() => { setView('login'); setResetSent(false); }}
                                    className="text-sm font-bold text-primary hover:underline"
                                >
                                    Back to login
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-6">
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

                                {error && (
                                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 animate-in fade-in slide-in-from-top-2">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            SENDING LINK...
                                        </>
                                    ) : (
                                        'SEND RESET LINK'
                                    )}
                                </button>

                                <div className="text-center pt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setView('login'); setError(null); }}
                                        className="text-sm font-bold text-[#6B7280] hover:text-[#111827] transition-all"
                                    >
                                        Back to login
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
