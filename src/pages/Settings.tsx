import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Lock,
    Bell,
    CreditCard,
    Upload,
    Trash2,
    Save,
    Eye,
    EyeOff,
    Info,
    X,
    Download,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Invoice {
    id: string;
    number: string | null;
    date: number;
    amount: number;
    currency: string;
    status: string | null;
    pdfUrl: string | null;
}

interface SettingsProps {
  onPageChange?: (page: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onPageChange }) => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Settings | Leadomation';
        return () => { document.title = 'Leadomation'; };
    }, []);

    const [activeTab, setActiveTab] = useState('account');

    // Account state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [saveMessage, setSaveMessage] = useState('');

    // Security state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Notifications state
    const [notifications, setNotifications] = useState({
        campaignStarted: true,
        emailReply: true,
        callCompleted: false,
        weeklyReport: true,
        productUpdates: false,
    });
    const [notificationSaveStatus, setNotificationSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Billing state
    const [invoicesModalOpen, setInvoicesModalOpen] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoicesLoading, setInvoicesLoading] = useState(false);
    const [invoicesError, setInvoicesError] = useState<string | null>(null);
    const [portalLoading, setPortalLoading] = useState(false);

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
                // Build full_name from metadata or email prefix
                const metaFirstName = user.user_metadata?.first_name || user.user_metadata?.full_name?.split(/\s+/)[0] || '';
                const metaLastName = user.user_metadata?.last_name || user.user_metadata?.full_name?.split(/\s+/).slice(1).join(' ') || '';
                const fullName = metaFirstName || metaLastName
                    ? `${metaFirstName} ${metaLastName}`.trim()
                    : user.email?.split('@')[0] || '';
                await supabase.from('profiles').insert({
                    id: user.id,
                    full_name: fullName,
                });
                setFirstName(metaFirstName || user.email?.split('@')[0] || '');
                setLastName(metaLastName);
                return;
            }

            if (data) {
                // Use first_name/last_name columns if available, otherwise split full_name
                if (data.first_name !== undefined && data.first_name !== null) {
                    setFirstName(data.first_name || '');
                    setLastName(data.last_name || '');
                } else {
                    // Fallback: split full_name into first and last name for display
                    const fullName = data.full_name || '';
                    const parts = fullName.trim().split(/\s+/);
                    setFirstName(parts[0] || '');
                    setLastName(parts.slice(1).join(' ') || '');
                }
                setPhone(data.phone || '');
                setCompany(data.company_name || '');
                setJobTitle(data.job_title || '');
                setProfileImageUrl(data.avatar_url || null);

                // Load notification preferences if they exist
                if (data.notification_preferences) {
                    setNotifications(prev => ({
                        ...prev,
                        ...data.notification_preferences
                    }));
                }
            }
        };
        loadProfile();
    }, []);

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
        } catch (err) {
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
        if (!userId) {
            setSaveStatus('error');
            setSaveMessage('Not authenticated. Please sign in again.');
            return;
        }

        setSaveStatus('saving');
        setSaveMessage('');

        try {
            // Combine firstName and lastName into full_name for backward compatibility
            const fullName = `${firstName} ${lastName}`.trim();

            const { error } = await supabase.from('profiles').upsert({
                id: userId,
                full_name: fullName,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone: phone.trim(),
                company_name: company.trim(),
                job_title: jobTitle.trim(),
                avatar_url: profileImageUrl,
                updated_at: new Date().toISOString(),
            });

            if (error) {
                throw error;
            }

            setSaveStatus('success');
            setSaveMessage('Profile saved successfully!');

            // Dispatch event to update TopBar with new name
            window.dispatchEvent(new CustomEvent('profileUpdated', {
                detail: { firstName: firstName.trim(), lastName: lastName.trim(), fullName }
            }));

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSaveStatus('idle');
                setSaveMessage('');
            }, 3000);
        } catch (err: any) {
            console.error('Save failed:', err);
            setSaveStatus('error');
            setSaveMessage(err.message || 'Failed to save profile. Please try again.');
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) { alert('Passwords do not match'); return; }
        if (newPassword.length < 8) { alert('Password must be at least 8 characters'); return; }
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            alert('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            alert(err.message || 'Failed to update password');
        }
    };

    const handleToggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveNotifications = async () => {
        if (!userId) return;

        setNotificationSaveStatus('saving');
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    notification_preferences: notifications,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (error) throw error;

            setNotificationSaveStatus('success');
            setTimeout(() => setNotificationSaveStatus('idle'), 3000);
        } catch (err: any) {
            console.error('Failed to save notifications:', err);
            setNotificationSaveStatus('error');
            setTimeout(() => setNotificationSaveStatus('idle'), 3000);
        }
    };

    const handleOpenPortal = async () => {
        setPortalLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                alert('Please sign in again to access billing settings.');
                return;
            }

            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to open billing portal');
            }

            window.location.href = data.url;
        } catch (err: any) {
            console.error('Portal error:', err);
            alert(err.message || 'Failed to open billing portal');
        } finally {
            setPortalLoading(false);
        }
    };

    const handleFetchInvoices = async () => {
        setInvoicesModalOpen(true);
        setInvoicesLoading(true);
        setInvoicesError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                throw new Error('Please sign in again to view invoices.');
            }

            const response = await fetch('/api/get-invoices', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch invoices');
            }

            setInvoices(data.invoices || []);
        } catch (err: any) {
            console.error('Invoices error:', err);
            setInvoicesError(err.message || 'Failed to load invoices');
        } finally {
            setInvoicesLoading(false);
        }
    };

    const formatInvoiceDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    };

    const tabs = [
        { key: 'account', label: 'Account', icon: User },
        { key: 'security', label: 'Security', icon: Lock },
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'billing', label: 'Billing', icon: CreditCard },
    ];

    const notificationItems = [
        { key: 'campaignStarted', label: 'Campaign started', desc: 'When a new campaign begins scraping leads' },
        { key: 'emailReply', label: 'Email reply received', desc: 'When a lead replies to your outreach' },
        { key: 'callCompleted', label: 'Call completed', desc: 'When an AI call agent finishes a call' },
        { key: 'weeklyReport', label: 'Weekly performance report', desc: 'Summary of campaigns, opens, and replies' },
        { key: 'productUpdates', label: 'Product updates', desc: 'New features and improvements to Leadomation' },
    ];

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className="flex gap-6">

                {/* Left Nav Panel */}
                <div className="w-52 shrink-0">
                    <div className="sticky top-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {tabs.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all border-l-2 ${
                                    activeTab === key
                                        ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-medium'
                                        : 'text-[#6B7280] border-transparent hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={16} className="shrink-0" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content Panel */}
                <div className="flex-1">

                    {/* Account Tab */}
                    {activeTab === 'account' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="mb-6">
                                <h2 className="text-base font-semibold text-[#111827]">Profile Information</h2>
                                <p className="text-sm text-[#6B7280]">Update your personal details</p>
                            </div>

                            {/* Avatar Row */}
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {profileImageUrl ? (
                                        <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} className="text-[#4F46E5]" />
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <label className="px-4 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                                        <Upload size={14} />
                                        {uploadingAvatar ? 'Uploading...' : 'Upload photo'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                                    </label>
                                    {profileImageUrl && (
                                        <button
                                            onClick={handleRemoveAvatar}
                                            className="px-4 py-2 border border-red-200 bg-white text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 size={14} />
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Form Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">First name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Last name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Email address</label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        disabled
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-gray-50 text-[#9CA3AF] cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Phone number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+44 7XXX XXX XXX"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Company name</label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Job title</label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        placeholder="e.g. Head of Sales"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                {saveMessage && (
                                    <span className={`text-sm font-medium ${saveStatus === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {saveMessage}
                                    </span>
                                )}
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saveStatus === 'saving'}
                                    className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {saveStatus === 'saving' ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={14} />
                                            Save changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="mb-6">
                                <h2 className="text-base font-semibold text-[#111827]">Security</h2>
                                <p className="text-sm text-[#6B7280]">Update your password and security settings</p>
                            </div>

                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Current password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]"
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">New password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Confirm new password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleUpdatePassword}
                                    className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] flex items-center gap-2"
                                >
                                    <Save size={14} />
                                    Update password
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="mb-6">
                                <h2 className="text-base font-semibold text-[#111827]">Notifications</h2>
                                <p className="text-sm text-[#6B7280]">Choose what you want to be notified about</p>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {notificationItems.map((item) => (
                                    <div key={item.key} className="py-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-[#111827]">{item.label}</p>
                                            <p className="text-xs text-[#6B7280]">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggleNotification(item.key as keyof typeof notifications)}
                                            className={`relative h-5 w-9 rounded-full transition-colors ${
                                                notifications[item.key as keyof typeof notifications] ? 'bg-[#4F46E5]' : 'bg-gray-200'
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                                                    notifications[item.key as keyof typeof notifications] ? 'translate-x-4' : 'translate-x-0.5'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6">
                                {notificationSaveStatus === 'success' && (
                                    <span className="text-sm font-medium text-emerald-600">
                                        Preferences saved!
                                    </span>
                                )}
                                {notificationSaveStatus === 'error' && (
                                    <span className="text-sm font-medium text-red-500">
                                        Failed to save
                                    </span>
                                )}
                                <button
                                    onClick={handleSaveNotifications}
                                    disabled={notificationSaveStatus === 'saving'}
                                    className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {notificationSaveStatus === 'saving' ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={14} />
                                            Save preferences
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === 'billing' && (
                        <div className="space-y-4">
                            {/* Plan Card */}
                            <div className="bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#F0F4FF] border border-indigo-100 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Current plan</p>
                                        <p className="text-2xl font-bold text-[#111827] mt-1">Pro</p>
                                        <p className="text-sm text-[#6B7280]">£159 / month</p>
                                    </div>
                                    <button
                                        onClick={() => onPageChange?.('Pricing')}
                                        className="px-4 py-2 border border-[#4F46E5] text-[#4F46E5] rounded-lg text-sm font-medium hover:bg-[#EEF2FF]"
                                    >
                                        Change plan
                                    </button>
                                </div>
                            </div>

                            {/* Billing Details Card */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                <div className="space-y-0">
                                    <div className="flex justify-between py-3 border-b border-gray-50">
                                        <span className="text-sm text-[#6B7280]">Next billing date</span>
                                        <span className="text-sm font-medium text-[#111827]">1 April 2026</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-50">
                                        <span className="text-sm text-[#6B7280]">Payment method</span>
                                        <span className="text-sm font-medium text-[#111827]">Visa ending 4242</span>
                                    </div>
                                    <div className="flex justify-between py-3">
                                        <span className="text-sm text-[#6B7280]">Billing email</span>
                                        <span className="text-sm font-medium text-[#111827]">{userEmail || 'Not set'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleOpenPortal}
                                        disabled={portalLoading}
                                        className="px-4 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {portalLoading ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Opening...
                                            </>
                                        ) : (
                                            <>
                                                <ExternalLink size={14} />
                                                Update payment method
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleFetchInvoices}
                                        className="px-4 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        Download invoices
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl mt-4">
                        <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                        <p className="text-xs font-medium text-[#374151] leading-relaxed">
                            Changes to your profile are saved immediately. For billing changes, you will be redirected to our secure Stripe portal.
                        </p>
                    </div>
                </div>
            </div>

            {/* Invoices Modal */}
            {invoicesModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-base font-semibold text-[#111827]">Invoices</h3>
                            <button
                                onClick={() => setInvoicesModalOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={18} className="text-[#6B7280]" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {invoicesLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 size={24} className="animate-spin text-[#4F46E5]" />
                                </div>
                            ) : invoicesError ? (
                                <div className="text-center py-12">
                                    <p className="text-sm text-red-500">{invoicesError}</p>
                                </div>
                            ) : invoices.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-sm text-[#6B7280]">No invoices found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {invoices.map((invoice) => (
                                        <div key={invoice.id} className="py-3 flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[#111827]">
                                                    {invoice.number || 'Draft'}
                                                </p>
                                                <p className="text-xs text-[#6B7280]">
                                                    {formatInvoiceDate(invoice.date)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-[#111827]">
                                                    {formatAmount(invoice.amount, invoice.currency)}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    invoice.status === 'paid'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : invoice.status === 'open'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {invoice.status === 'paid' ? 'Paid' : invoice.status === 'open' ? 'Open' : invoice.status || 'Draft'}
                                                </span>
                                                {invoice.pdfUrl && (
                                                    <a
                                                        href={invoice.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Download PDF"
                                                    >
                                                        <Download size={14} className="text-[#4F46E5]" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setInvoicesModalOpen(false)}
                                className="px-4 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
