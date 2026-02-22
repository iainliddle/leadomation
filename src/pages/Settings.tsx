import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, CreditCard, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsProps {
    onPageChange?: (page: string) => void;
}

const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'account', label: 'Account', icon: Lock },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'billing', label: 'Billing', icon: CreditCard },
];

const Settings: React.FC<SettingsProps> = ({ onPageChange }) => {
    const [activeTab, setActiveTab] = useState('profile');

    // Profile state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Account state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Notifications state
    const [notifications, setNotifications] = useState({
        emailNewLead: true,
        emailCampaignComplete: true,
        emailWeeklyReport: false,
        emailSequenceReply: true,
        emailDealUpdate: true,
        browserNotifications: false,
    });

    // Billing
    const [currentPlan, setCurrentPlan] = useState('Trial');

    // ────── Load profile on mount ──────
    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);
            setUserEmail(user.email || '');

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code === 'PGRST116') {
                // No profile row — create one
                await supabase.from('profiles').insert({
                    id: user.id,
                    first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || '',
                    last_name: user.user_metadata?.last_name || '',
                });
                setFirstName(user.user_metadata?.first_name || user.email?.split('@')[0] || '');
                setLastName(user.user_metadata?.last_name || '');
                return;
            }

            if (data) {
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setPhone(data.phone || '');
                setCompany(data.company || '');
                setJobTitle(data.job_title || '');
                setProfileImageUrl(data.avatar_url || null);
                setCurrentPlan(data.plan || 'Trial');
                // Load notification preferences if stored
                if (data.notification_new_lead !== undefined) {
                    setNotifications({
                        emailNewLead: data.notification_new_lead ?? true,
                        emailCampaignComplete: data.notification_campaign_complete ?? true,
                        emailWeeklyReport: data.notification_weekly_report ?? false,
                        emailSequenceReply: data.notification_sequence_reply ?? true,
                        emailDealUpdate: data.notification_deal_update ?? true,
                        browserNotifications: data.notification_browser ?? false,
                    });
                }
            }
        };
        loadProfile();
    }, []);

    const userInitials = `${(firstName?.[0] || userEmail?.[0] || 'U').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}`;

    // ────── Handlers ──────

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;
        if (file.size > 2 * 1024 * 1024) { alert('File must be under 2MB'); return; }

        setUploadingAvatar(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${userId}/avatar.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                // Fallback to base64 if storage bucket isn't set up
                console.warn('Storage upload failed, using base64 fallback:', uploadError.message);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProfileImageUrl(reader.result as string);
                    setUploadingAvatar(false);
                };
                reader.readAsDataURL(file);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

            await supabase.from('profiles').upsert({
                id: userId,
                avatar_url: urlWithCacheBust,
                updated_at: new Date().toISOString(),
            });

            setProfileImageUrl(urlWithCacheBust);
        } catch (err: any) {
            console.error('Avatar upload failed:', err);
            // base64 fallback
            const reader = new FileReader();
            reader.onloadend = () => setProfileImageUrl(reader.result as string);
            reader.readAsDataURL(file);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!userId) return;
        try {
            for (const ext of ['jpg', 'jpeg', 'png', 'gif', 'webp']) {
                await supabase.storage.from('avatars').remove([`${userId}/avatar.${ext}`]);
            }
            await supabase.from('profiles').upsert({
                id: userId,
                avatar_url: null,
                updated_at: new Date().toISOString(),
            });
        } catch (err) {
            console.error('Failed to remove avatar from storage:', err);
        }
        setProfileImageUrl(null);
    };

    const handleSaveProfile = async () => {
        if (!userId) return;
        setSaveStatus('saving');
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: userId,
                first_name: firstName,
                last_name: lastName,
                phone,
                company,
                job_title: jobTitle,
                avatar_url: profileImageUrl,
                updated_at: new Date().toISOString(),
            });
            if (error) throw error;
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (err: any) {
            console.error('Save failed:', err);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) { alert('Passwords do not match'); return; }
        if (newPassword.length < 8) { alert('Password must be at least 8 characters'); return; }
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            alert('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            alert(err.message || 'Failed to update password');
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE' || !userId) return;
        try {
            await supabase.from('profiles').delete().eq('id', userId);
            for (const ext of ['jpg', 'jpeg', 'png', 'gif', 'webp']) {
                await supabase.storage.from('avatars').remove([`${userId}/avatar.${ext}`]);
            }
            await supabase.auth.signOut();
            alert('Your profile data has been deleted and you have been signed out.');
        } catch (err: any) {
            alert(err.message || 'Failed to delete account');
        }
    };

    const handleToggleNotification = async (key: string) => {
        const newNotifications = { ...notifications, [key]: !notifications[key as keyof typeof notifications] };
        setNotifications(newNotifications);

        if (!userId) return;
        try {
            await supabase.from('profiles').upsert({
                id: userId,
                notification_new_lead: newNotifications.emailNewLead,
                notification_campaign_complete: newNotifications.emailCampaignComplete,
                notification_weekly_report: newNotifications.emailWeeklyReport,
                notification_sequence_reply: newNotifications.emailSequenceReply,
                notification_deal_update: newNotifications.emailDealUpdate,
                notification_browser: newNotifications.browserNotifications,
                updated_at: new Date().toISOString(),
            });
        } catch (err) {
            console.error('Failed to save notification preference:', err);
            setNotifications(notifications); // revert on failure
        }
    };

    // ────── Reusable styles ──────
    const cardStyle: React.CSSProperties = {
        background: 'white', border: '1px solid #E2E4ED', borderRadius: '12px', padding: '28px',
    };
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B',
        textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
    };
    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px', border: '1px solid #E2E4ED', borderRadius: '8px',
        fontSize: '14px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
        background: 'white', color: '#0F172A', boxSizing: 'border-box',
    };
    const primaryBtnStyle: React.CSSProperties = {
        padding: '10px 24px', borderRadius: '8px', background: '#4F46E5', color: 'white',
        border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.2s',
    };

    // ────── TAB CONTENT ──────

    const renderProfile = () => (
        <div style={cardStyle}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Profile Information</h3>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: profileImageUrl ? 'transparent' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '28px', fontWeight: 800,
                    overflow: 'hidden', flexShrink: 0,
                }}>
                    {profileImageUrl
                        ? <img src={profileImageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span>{userInitials}</span>}
                </div>
                <div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <label htmlFor="avatar-upload" style={{
                            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                            background: '#4F46E5', color: 'white',
                            cursor: uploadingAvatar ? 'wait' : 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            opacity: uploadingAvatar ? 0.7 : 1,
                        }}>
                            <Upload size={14} /> {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                        </label>
                        <input id="avatar-upload" type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                        {profileImageUrl && (
                            <button onClick={handleRemoveAvatar} style={{
                                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                                background: 'transparent', color: '#EF4444', cursor: 'pointer',
                                border: '1px solid #FCA5A5', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '6px',
                            }}>
                                <Trash2 size={14} /> Remove
                            </button>
                        )}
                    </div>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>JPG, PNG or GIF. Max 2MB.</p>
                </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={labelStyle}>First Name</label>
                    <input style={inputStyle} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Iain"
                        onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E4ED'} />
                </div>
                <div>
                    <label style={labelStyle}>Last Name</label>
                    <input style={inputStyle} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="L"
                        onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E4ED'} />
                </div>
                <div>
                    <label style={labelStyle}>Email Address</label>
                    <input style={{ ...inputStyle, background: '#F8FAFC', color: '#94A3B8', cursor: 'not-allowed' }} type="email" value={userEmail} readOnly />
                </div>
                <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input style={inputStyle} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7XXX XXX XXX"
                        onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E4ED'} />
                </div>
                <div>
                    <label style={labelStyle}>Company Name</label>
                    <input style={inputStyle} type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company"
                        onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E4ED'} />
                </div>
                <div>
                    <label style={labelStyle}>Job Title</label>
                    <input style={inputStyle} type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Head of Sales"
                        onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E4ED'} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button onClick={handleSaveProfile} disabled={saveStatus === 'saving'} style={{
                    ...primaryBtnStyle,
                    background: saveStatus === 'saved' ? '#059669' : saveStatus === 'error' ? '#DC2626' : '#4F46E5',
                    cursor: saveStatus === 'saving' ? 'wait' : 'pointer',
                    minWidth: '140px',
                }}>
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved!' : saveStatus === 'error' ? 'Failed — Retry' : 'Save Changes'}
                </button>
            </div>
        </div>
    );

    const renderAccount = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Change Password */}
            <div style={cardStyle}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Change Password</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Update your password to keep your account secure.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                    <div>
                        <label style={labelStyle}>New Password</label>
                        <input style={inputStyle} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password"
                            onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E4ED'} />
                    </div>
                    <div>
                        <label style={labelStyle}>Confirm New Password</label>
                        <input style={inputStyle} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
                            onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E4ED'} />
                    </div>
                    <button onClick={handleChangePassword} style={{ ...primaryBtnStyle, alignSelf: 'flex-start' }}>Update Password</button>
                </div>
            </div>

            {/* Danger Zone */}
            <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #FCA5A5', background: '#FEF2F2' }}>
                <h3 style={{ color: '#DC2626', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Danger Zone</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                    Once you delete your account, there is no going back. All your data, campaigns, leads, and sequences will be permanently removed.
                </p>
                {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)} style={{
                        padding: '10px 20px', borderRadius: '8px', background: '#DC2626', color: 'white',
                        border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                        Delete Account
                    </button>
                ) : (
                    <div style={{ marginTop: '4px', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                        <p style={{ fontSize: '13px', color: '#0F172A', marginBottom: '12px', fontWeight: 600 }}>Type "DELETE" to confirm:</p>
                        <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="Type DELETE"
                            style={{ ...inputStyle, marginBottom: '12px', borderColor: '#FCA5A5' }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#DC2626'} onBlur={(e) => e.currentTarget.style.borderColor = '#FCA5A5'} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleDeleteAccount} disabled={deleteConfirmText !== 'DELETE'} style={{
                                padding: '8px 16px', borderRadius: '8px',
                                background: deleteConfirmText === 'DELETE' ? '#DC2626' : '#E5E7EB',
                                color: deleteConfirmText === 'DELETE' ? 'white' : '#94A3B8',
                                border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                            }}>
                                Permanently Delete
                            </button>
                            <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }} style={{
                                padding: '8px 16px', borderRadius: '8px', background: 'transparent',
                                color: '#64748B', border: '1px solid #E2E4ED', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderNotifications = () => {
        const toggles = [
            { key: 'emailNewLead', label: 'New lead scraped', desc: 'Get notified when new leads are added to your database' },
            { key: 'emailCampaignComplete', label: 'Campaign completed', desc: 'Notification when a scraping campaign finishes' },
            { key: 'emailWeeklyReport', label: 'Weekly performance report', desc: 'Receive a summary of your outreach performance every Monday' },
            { key: 'emailSequenceReply', label: 'Sequence reply received', desc: 'Get notified when a lead replies to your outreach' },
            { key: 'emailDealUpdate', label: 'Deal pipeline updates', desc: 'Notifications when deals move stages or are updated' },
            { key: 'browserNotifications', label: 'Browser notifications', desc: 'Show desktop notifications for real-time events' },
        ];

        return (
            <div style={cardStyle}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Notification Preferences</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Choose how you want to be notified about activity in your account.</p>
                {toggles.map((t, i) => (
                    <div key={t.key} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '16px 0', borderBottom: i < toggles.length - 1 ? '1px solid #F1F5F9' : 'none',
                    }}>
                        <div style={{ marginRight: '16px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{t.label}</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{t.desc}</div>
                        </div>
                        <div
                            onClick={() => handleToggleNotification(t.key)}
                            style={{
                                width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
                                background: notifications[t.key as keyof typeof notifications] ? '#4F46E5' : '#E2E4ED',
                                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                            }}
                        >
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                                position: 'absolute', top: '2px',
                                left: notifications[t.key as keyof typeof notifications] ? '22px' : '2px',
                                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderBilling = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Current Plan */}
            <div style={{
                padding: '24px', borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(79,70,229,0.04), rgba(124,58,237,0.03))',
                border: '1px solid rgba(79,70,229,0.12)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Plan</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{currentPlan} Tier</div>
                        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                            {currentPlan === 'Pro' ? 'Unlimited keyword searches' : '50 keyword searches/month'}
                        </div>
                    </div>
                    <button onClick={() => onPageChange?.('Pricing')} style={primaryBtnStyle}>
                        {currentPlan === 'Pro' ? 'Change Plan' : 'Upgrade Plan'}
                    </button>
                </div>
            </div>

            {/* Billing History */}
            <div style={cardStyle}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Billing History</h3>
                <div style={{ border: '1px solid #E2E4ED', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC' }}>
                                {['Date', 'Description', 'Amount', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={4} style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontStyle: 'italic' }}>
                                    No billing history yet.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Method */}
            <div style={cardStyle}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Payment Method</h3>
                <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E4ED', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '28px', borderRadius: '4px', background: '#1A1F36',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '10px', fontWeight: 700, flexShrink: 0,
                        }}>
                            VISA
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>•••• •••• •••• 4242</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Expires 12/26</div>
                        </div>
                    </div>
                    <button style={{
                        padding: '8px 16px', borderRadius: '8px', background: 'transparent',
                        color: '#4F46E5', border: '1px solid #E2E4ED', fontSize: '13px',
                        fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                        Update
                    </button>
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
                    Managed securely through Stripe. We never store your card details.
                </p>
            </div>
        </div>
    );

    const contentMap: Record<string, () => React.ReactNode> = {
        profile: renderProfile,
        account: renderAccount,
        notifications: renderNotifications,
        billing: renderBilling,
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-[#111827] mb-6">Settings</h1>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Tab Navigation */}
                <div style={{
                    width: '200px', flexShrink: 0, background: 'white', border: '1px solid #E2E4ED',
                    borderRadius: '12px', padding: '8px', position: 'sticky', top: '100px',
                }}>
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                                padding: '10px 14px', borderRadius: '8px', border: 'none',
                                background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                                color: isActive ? '#4F46E5' : '#64748B',
                                fontSize: '13px', fontWeight: isActive ? 700 : 600, cursor: 'pointer',
                                fontFamily: 'inherit', transition: 'all 0.15s', marginBottom: '2px',
                                textAlign: 'left',
                            }}
                                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#F8FAFC'; }}
                                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {contentMap[activeTab]?.()}
                </div>
            </div>
        </div>
    );
};

export default Settings;
