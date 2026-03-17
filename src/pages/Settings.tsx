import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, CreditCard, Upload, Trash2, Calendar, Mail, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsProps {
    onPageChange?: (page: string) => void;
}

const tabs = [
    { key: 'account', label: 'Account', icon: User },
    { key: 'store', label: 'Security', icon: Lock },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'billing', label: 'Billing', icon: CreditCard },
];

const Settings: React.FC<SettingsProps> = ({ onPageChange }) => {
    const [activeTab, setActiveTab] = useState('account');

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

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const [notifications, setNotifications] = useState({
        emailNewLead: true,
        emailCampaignComplete: true,
        emailWeeklyReport: false,
        emailSequenceReply: true,
        emailDealUpdate: true,
        browserNotifications: false,
    });

    const [currentPlan, setCurrentPlan] = useState('Trial');
    const [meetingLink, setMeetingLink] = useState('');

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
                setMeetingLink(data.meeting_link || '');
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
            window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: { url: urlWithCacheBust } }));
        } catch (err: any) {
            console.error('Avatar upload failed:', err);
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
        window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: { url: null } }));
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

    const handleSaveMeetingLink = async () => {
        if (!userId) return;
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: userId,
                meeting_link: meetingLink,
                updated_at: new Date().toISOString(),
            });
            if (error) throw error;
            alert('Meeting link saved!');
        } catch (err) {
            console.error('Failed to save meeting link:', err);
            alert('Failed to save meeting link.');
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
            setNotifications(notifications);
        }
    };

    const renderAccountSettings = () => (
        <div className="bg-white rounded-b-xl border-x border-b border-[#E5E7EB] shadow-sm p-6">
            <h3 className="text-base font-semibold text-[#111827] mb-6">Profile Information</h3>

            {/* Avatar Section */}
            <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center text-white text-xl font-bold overflow-hidden flex-shrink-0">
                    {profileImageUrl ? (
                        <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span>{userInitials}</span>
                    )}
                </div>
                <div className="flex gap-3">
                    <label className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#111827] cursor-pointer hover:bg-gray-50 transition-all flex items-center gap-2">
                        <Upload size={14} />
                        {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                    </label>
                    {profileImageUrl && (
                        <button
                            onClick={handleRemoveAvatar}
                            className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                        >
                            <Trash2 size={14} />
                            Remove
                        </button>
                    )}
                </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Email Address</label>
                    <input
                        type="email"
                        value={userEmail}
                        readOnly
                        className="w-full px-4 py-2.5 bg-gray-50 border border-[#E5E7EB] rounded-lg text-sm text-gray-400 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7XXX XXX XXX"
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Company Name</label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Job Title</label>
                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Head of Sales"
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSaveProfile}
                    disabled={saveStatus === 'saving'}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${saveStatus === 'saved'
                        ? 'bg-green-600 text-white'
                        : saveStatus === 'error'
                            ? 'bg-red-600 text-white'
                            : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                        }`}
                >
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    );

    const renderStoreSettings = () => (
        <div className="bg-white rounded-b-xl border-x border-b border-[#E5E7EB] shadow-sm p-6 space-y-6">
            {/* Change Password */}
            <div>
                <h3 className="text-base font-semibold text-[#111827] mb-2">Change Password</h3>
                <p className="text-sm text-[#6B7280] mb-4">Update your password to keep your account secure.</p>
                <div className="max-w-md space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-1.5">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-1.5">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                        />
                    </div>
                    <button
                        onClick={handleChangePassword}
                        className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all"
                    >
                        Update Password
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="p-5 rounded-xl border border-red-200 bg-red-50">
                <h3 className="text-base font-semibold text-red-700 mb-2">Danger Zone</h3>
                <p className="text-sm text-[#6B7280] mb-4">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                </p>
                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
                    >
                        Delete Account
                    </button>
                ) : (
                    <div className="p-4 bg-white rounded-lg border border-red-200">
                        <p className="text-sm text-[#111827] font-medium mb-3">Type "DELETE" to confirm:</p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Type DELETE"
                            className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE'}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Permanently Delete
                            </button>
                            <button
                                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#6B7280] hover:bg-gray-50"
                            >
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
            { key: 'emailNewLead', label: 'New lead scraped', desc: 'Get notified when new leads are added' },
            { key: 'emailCampaignComplete', label: 'Campaign completed', desc: 'Notification when a scraping campaign finishes' },
            { key: 'emailWeeklyReport', label: 'Weekly performance report', desc: 'Receive a summary every Monday' },
            { key: 'emailSequenceReply', label: 'Sequence reply received', desc: 'Get notified when a lead replies' },
            { key: 'emailDealUpdate', label: 'Deal pipeline updates', desc: 'Notifications when deals move stages' },
            { key: 'browserNotifications', label: 'Browser notifications', desc: 'Show desktop notifications' },
        ];

        return (
            <div className="bg-white rounded-b-xl border-x border-b border-[#E5E7EB] shadow-sm p-6">
                <h3 className="text-base font-semibold text-[#111827] mb-2">Notification Preferences</h3>
                <p className="text-sm text-[#6B7280] mb-6">Choose how you want to be notified about activity.</p>
                <div className="divide-y divide-gray-100">
                    {toggles.map((t) => (
                        <div key={t.key} className="py-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#111827]">{t.label}</p>
                                <p className="text-xs text-[#6B7280] mt-0.5">{t.desc}</p>
                            </div>
                            <button
                                onClick={() => handleToggleNotification(t.key)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${notifications[t.key as keyof typeof notifications] ? 'bg-[#4F46E5]' : 'bg-gray-200'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[t.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderIntegrations = () => (
        <div className="bg-white rounded-b-xl border-x border-b border-[#E5E7EB] shadow-sm p-6 space-y-4">
            {/* Meeting Link */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={24} className="text-[#4F46E5]" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#111827]">Meeting Link</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">Your Calendly or booking link for calls</p>
                </div>
                <div className="flex items-center gap-2 flex-1">
                    <input
                        type="url"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="https://calendly.com/you/meeting"
                        className="flex-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                    />
                    <button
                        onClick={handleSaveMeetingLink}
                        className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* LinkedIn & Email Side by Side */}
            <div className="grid grid-cols-2 gap-4">
                {/* LinkedIn */}
                <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">in</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-[#111827]">LinkedIn</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="text-xs text-[#6B7280]">Not Connected</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-white border border-[#4F46E5] text-[#4F46E5] rounded-lg text-sm font-medium hover:bg-[#EEF2FF] transition-all">
                        Connect LinkedIn
                    </button>
                </div>

                {/* Email */}
                <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Mail size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-[#111827]">Email Account</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="text-xs text-[#6B7280]">Not Connected</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-white border border-[#4F46E5] text-[#4F46E5] rounded-lg text-sm font-medium hover:bg-[#EEF2FF] transition-all">
                        Connect Email
                    </button>
                </div>
            </div>

            {/* Infrastructure Card */}
            <div className="bg-gradient-to-r from-[#EEF2FF] to-[#E0F2FE] border border-[#C7D2FE] rounded-xl p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center">
                        <Zap size={20} className="text-[#4F46E5]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-[#111827]">Email Infrastructure</h4>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                            Set up your sending domain and warm-up settings for optimal deliverability
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBilling = () => {
        const handleUpdatePayment = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                const response = await fetch('/api/create-portal-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id })
                });
                const { url } = await response.json();
                if (url) window.location.href = url;
            } catch (err) {
                alert('Unable to open billing portal. Please contact support.');
            }
        };

        return (
            <div className="bg-white rounded-b-xl border-x border-b border-[#E5E7EB] shadow-sm p-6 space-y-6">
                {/* Current Plan */}
                <div className="bg-gradient-to-r from-[#EEF2FF] to-[#F5F3FF] border border-[#C7D2FE] rounded-xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wide">Current Plan</p>
                            <p className="text-2xl font-bold text-[#111827] mt-1">{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Tier</p>
                            <p className="text-sm text-[#6B7280] mt-1">
                                {currentPlan === 'Pro' ? 'Unlimited access. All features included.' : 'Upgrade to unlock full access.'}
                            </p>
                        </div>
                        <button
                            onClick={() => onPageChange?.('Pricing')}
                            className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all"
                        >
                            {currentPlan === 'Pro' ? 'Manage Plan' : 'Upgrade Plan'}
                        </button>
                    </div>
                </div>

                {/* Billing History */}
                <div>
                    <h3 className="text-base font-semibold text-[#111827] mb-4">Billing History</h3>
                    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Description</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Amount</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-[#6B7280]">
                                        No billing history yet.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Method */}
                <div>
                    <h3 className="text-base font-semibold text-[#111827] mb-4">Payment Method</h3>
                    <div className="border border-[#E5E7EB] rounded-xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                                <CreditCard size={20} className="text-[#4F46E5]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#111827]">No payment method on file</p>
                                <p className="text-xs text-[#6B7280]">Add a card via the Stripe billing portal</p>
                            </div>
                        </div>
                        <button
                            onClick={handleUpdatePayment}
                            className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all"
                        >
                            Add Payment Method
                        </button>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-2">Managed securely through Stripe.</p>
                </div>
            </div>
        );
    };

    const contentMap: Record<string, () => React.ReactNode> = {
        account: renderAccountSettings,
        store: renderStoreSettings,
        notifications: renderNotifications,
        integrations: renderIntegrations,
        billing: renderBilling,
    };

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Horizontal Tabs */}
                <div className="flex border-b border-[#E5E7EB] bg-white rounded-t-xl border-x border-t shadow-sm px-4">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px transition-all ${activeTab === tab.key
                                    ? 'text-[#4F46E5] border-[#4F46E5]'
                                    : 'text-[#6B7280] border-transparent hover:text-[#111827]'
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {contentMap[activeTab]?.()}
            </div>
        </div>
    );
};

export default Settings;
