import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Zap, Loader2, CheckCircle2, Lock } from 'lucide-react';
import logo from '../assets/logo-full.png';
import { supabase } from '../lib/supabase';
import './Register.css';

interface RegisterProps {
    onGoToLogin: () => void;
    onGoToTerms: () => void;
    onGoToPrivacy: () => void;
    onGoToRefund: () => void;
}

const Register: React.FC<RegisterProps> = ({ onGoToLogin, onGoToTerms, onGoToPrivacy, onGoToRefund }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');
        setError(null);
        setSuccess(false);

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (!agreed) {
            setError("You must agree to the Terms of Service and Privacy Policy");
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            console.log('Signup result:', data, authError);

            if (authError) throw authError;

            console.log('Registration successful:', data.user);

            // Split full name into first and last name and save to profiles
            if (data.user) {
                const nameParts = name.trim().split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert(
                        {
                            id: data.user.id,
                            first_name: firstName,
                            last_name: lastName,
                            full_name: name.trim(),
                        },
                        { onConflict: 'id' }
                    );

                if (profileError) {
                    console.error('Profile upsert error:', profileError);
                } else {
                    console.log('Profile saved successfully:', { firstName, lastName, fullName: name.trim() });
                }
            }

            setSuccess(true);
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <img src={logo} alt="Leadomation" className="register-logo" />

            <div className="register-card">
                <div className="register-title">Start your 7-day free trial</div>
                <div className="register-subtitle">Full Pro access. Secure your trial with a card. Cancel anytime before day 7.</div>

                {success ? (
                    <div className="register-success">
                        <div className="register-success-icon"><CheckCircle2 size={32} /></div>
                        <h2>Account created!</h2>
                        <p>Please check your email to confirm your account and start your trial.</p>
                        <button onClick={onGoToLogin} className="register-submit">RETURN TO SIGN IN</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="register-form">
                        <div>
                            <label className="register-label">Full Name</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="register-input" />
                        </div>
                        <div>
                            <label className="register-label">Email Address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="register-input" />
                        </div>
                        <div>
                            <label className="register-label">Password</label>
                            <div className="register-input-wrap">
                                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="register-input" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="register-eye-btn">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="register-label">Confirm Password</label>
                            <div className="register-input-wrap">
                                <input type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="register-input" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="register-eye-btn">
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="register-checkbox-row">
                            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="register-checkbox" />
                            <span className="register-terms-text">
                                I agree to the <button onClick={onGoToTerms} type="button" className="register-terms-link">Terms of Service</button> and <button onClick={onGoToPrivacy} type="button" className="register-terms-link">Privacy Policy</button>
                            </span>
                        </div>

                        {error && <div className="register-error">{error}</div>}

                        <button type="submit" disabled={isLoading} className="register-submit">
                            {isLoading ? (<><Loader2 size={18} className="animate-spin" /> CREATING ACCOUNT...</>) : ('CREATE ACCOUNT')}
                        </button>
                    </form>
                )}

                {!success && (
                    <>
                        <div className="register-trust-bar">
                            <div className="register-trust-item"><ShieldCheck size={14} className="text-emerald-500" /> Secure signup</div>
                            <div className="register-trust-item"><Zap size={14} className="text-amber-500" /> Pro access (inc. AI Voice Agent)</div>
                            <div className="register-trust-item"><Lock size={14} className="text-gray-400" /> 🔒 Card required. You won't be charged for 7 days.</div>
                        </div>
                        <div className="register-signin-link">
                            Already have an account? <button onClick={onGoToLogin}>Sign in</button>
                        </div>
                    </>
                )}
            </div>

            <div className="register-footer-links" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                <button onClick={onGoToTerms} className="register-footer-link" style={{ color: '#9CA3AF', fontSize: '13px' }}>Terms of Service</button>
                <button onClick={onGoToPrivacy} className="register-footer-link" style={{ color: '#9CA3AF', fontSize: '13px' }}>Privacy Policy</button>
                <button onClick={onGoToRefund} className="register-footer-link" style={{ color: '#9CA3AF', fontSize: '13px' }}>Refund Policy</button>
            </div>
        </div>
    );
};

export default Register;
