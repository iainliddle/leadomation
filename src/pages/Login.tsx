import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import logo from '../assets/logo-full.png';
import { supabase } from '../lib/supabase';
import './Login.css';

interface LoginProps {
    onLogin: () => void;
    onGoToRegister: () => void;
    onGoToTerms: () => void;
    onGoToPrivacy: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister, onGoToTerms, onGoToPrivacy }) => {
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
        <div className="login-page">
            <img src={logo} alt="Leadomation" className="login-logo" />

            <div className="login-card">
                {view === 'login' ? (
                    <>
                        <div className="login-title">Welcome back</div>
                        <div className="login-subtitle">Sign in to your account</div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div>
                                <label className="login-label">Email Address</label>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="login-input" />
                            </div>
                            <div>
                                <div className="login-label-row">
                                    <label className="login-label" style={{ marginBottom: 0 }}>Password</label>
                                    <button type="button" onClick={() => { setView('forgot-password'); setError(null); }} className="login-forgot-link">Forgot password?</button>
                                </div>
                                <div className="login-input-wrap">
                                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="login-input" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-eye-btn">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && <div className="login-error">{error}</div>}

                            <button type="submit" disabled={isLoading} className="login-submit">
                                {isLoading ? (<><Loader2 size={18} className="animate-spin" /> SIGNING IN...</>) : ('SIGN IN')}
                            </button>
                        </form>

                        <div className="login-register-link">
                            Don't have an account? <button onClick={onGoToRegister}>Start free trial</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="login-title">Reset password</div>
                        <div className="login-subtitle">Enter your email to receive a reset link</div>

                        {resetSent ? (
                            <div className="login-reset-success">
                                <div className="login-reset-success-box">Password reset link sent! Check your email.</div>
                                <button onClick={() => { setView('login'); setResetSent(false); }} className="login-back-link">Back to login</button>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="login-form">
                                <div>
                                    <label className="login-label">Email Address</label>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="login-input" />
                                </div>

                                {error && <div className="login-error">{error}</div>}

                                <button type="submit" disabled={isLoading} className="login-submit">
                                    {isLoading ? (<><Loader2 size={18} className="animate-spin" /> SENDING LINK...</>) : ('SEND RESET LINK')}
                                </button>

                                <div className="login-back-text">
                                    <button type="button" onClick={() => { setView('login'); setError(null); }}>Back to login</button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </div>

            <div className="login-footer-links">
                <button onClick={onGoToTerms} className="login-footer-link">Terms of Service</button>
                <button onClick={onGoToPrivacy} className="login-footer-link">Privacy Policy</button>
            </div>
        </div>
    );
};

export default Login;
