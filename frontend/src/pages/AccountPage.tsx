import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Package,
    Lock,
    Bell,
    LogOut,
    Camera,
    Save,
    MapPin,
    ChevronRight,
    Loader2,
    CheckCircle,
    Edit,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUIStore, useAuthStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser, useProfileUpdate, usePasswordChange, useOrders, useAddresses, useAddressMutations } from '@/hooks/useApi';
import { toast } from 'sonner';
import { DiyaButton } from '@/components/ui-custom/DiyaButton';
import { AddressFormDialog } from '@/components/ui-custom/AddressFormDialog';
import type { Address } from '@/types';

export function AccountPage() {
    const { mode } = useUIStore();
    const { isHindi } = useLanguage();
    const { isAuthenticated, user: storeUser, setUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // Form state for profile
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [profilePhone, setProfilePhone] = useState('');

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Address form state
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);

    const isBhakti = mode === 'bhakti';

    // Fetch user profile from API
    const { data: apiUser, loading: userLoading } = useCurrentUser();
    const { updateProfile, loading: profileSaving, success: profileSuccess } = useProfileUpdate();
    const { changePassword, loading: passwordSaving, success: passwordSuccess, error: passwordError } = usePasswordChange();

    // Fetch orders and addresses (only when respective tab is active)
    const { data: orders, loading: ordersLoading } = useOrders();
    const { data: addresses, loading: addressesLoading, refetch: refetchAddresses } = useAddresses();
    const { deleteAddress } = useAddressMutations();

    // Use API user data if available, fallback to store data
    const user = apiUser || storeUser;

    useEffect(() => {
        if (user) {
            setProfileName(user.name || '');
            setProfileEmail(user.email || '');
            setProfilePhone((user as any).phone || '');
        }
    }, [user]);

    useEffect(() => {
        if (profileSuccess) {
            toast.success(isHindi ? 'प्रोफ़ाइल अपडेट हो गई' : 'Profile updated successfully');
        }
    }, [profileSuccess]);

    useEffect(() => {
        if (passwordSuccess) {
            toast.success(isHindi ? 'पासवर्ड बदल गया' : 'Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [passwordSuccess]);

    useEffect(() => {
        if (passwordError) {
            toast.error(passwordError);
        }
    }, [passwordError]);

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return (
            <div className={cn('min-h-screen pt-32', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
                <div className="container mx-auto px-4 text-center">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{isHindi ? 'कृपया लॉग इन करें' : 'Please Sign In'}</h2>
                    <p className="text-muted-foreground mb-6">
                        {isHindi ? 'अपना खाता देखने के लिए लॉग इन करें' : 'Sign in to view your account'}
                    </p>
                    <Link to="/login">
                        <DiyaButton>{isHindi ? 'लॉग इन करें' : 'Sign In'}</DiyaButton>
                    </Link>
                </div>
            </div>
        );
    }

    // Loading state
    if (userLoading && !storeUser) {
        return (
            <div className={cn('min-h-screen pt-32 flex items-center justify-center', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-saffron mx-auto" />
                    <p className="text-muted-foreground">{isHindi ? 'खाता लोड हो रहा है...' : 'Loading account...'}</p>
                </div>
            </div>
        );
    }

    const handleSaveProfile = async () => {
        const updated = await updateProfile({
            name: profileName,
            email: profileEmail,
            phone: profilePhone,
        } as any);

        if (updated) {
            // Update store
            setUser({
                ...storeUser!,
                name: profileName,
                email: profileEmail,
            });
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error(isHindi ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            toast.error(isHindi ? 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए' : 'Password must be at least 8 characters');
            return;
        }
        await changePassword({
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmPassword,
        });
    };

    const handleLogout = () => {
        logout();
        toast.success(isHindi ? 'लॉग आउट हो गए' : 'Logged out successfully');
        navigate('/');
    };

    const tabs = [
        { id: 'profile', label: isHindi ? 'प्रोफ़ाइल' : 'Profile', icon: User },
        { id: 'orders', label: isHindi ? 'ऑर्डर' : 'Orders', icon: Package },
        { id: 'addresses', label: isHindi ? 'पते' : 'Addresses', icon: MapPin },
        { id: 'security', label: isHindi ? 'सुरक्षा' : 'Security', icon: Lock },
        { id: 'notifications', label: isHindi ? 'सूचनाएं' : 'Notifications', icon: Bell },
    ];

    const displayName = user?.name || 'User';
    const displayAvatar = (user as any)?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f97316&color=fff`;
    const memberSince = (user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    return (
        <div className={cn(
            'min-h-screen pt-24 pb-12',
            isBhakti ? 'bg-background' : 'bg-steel-dark'
        )}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className={cn(
                            "text-3xl font-bold mb-2",
                            isHindi && "devanagari"
                        )}>
                            {isHindi ? 'मेरा खाता' : 'My Account'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isHindi ? 'अपनी प्रोफ़ाइल और सेटिंग प्रबंधित करें' : 'Manage your profile and settings'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="space-y-2">
                            <div className={cn(
                                "p-6 mb-6 rounded-2xl flex items-center gap-4 border",
                                isBhakti ? "bg-card border-border" : "bg-steel border-border/10"
                            )}>
                                <div className="relative">
                                    <img
                                        src={displayAvatar}
                                        alt={displayName}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-saffron"
                                    />
                                    <button className="absolute bottom-0 right-0 p-1 bg-saffron text-white rounded-full hover:bg-saffron-dark transition-colors">
                                        <Camera className="w-3 h-3" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{displayName}</h3>
                                    {memberSince && (
                                        <p className="text-xs text-muted-foreground">
                                            {isHindi ? 'सदस्य' : 'Member since'} {memberSince}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className={cn(
                                "rounded-2xl overflow-hidden border",
                                isBhakti ? "bg-card border-border" : "bg-steel border-border/10"
                            )}>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-6 py-4 transition-colors relative",
                                            activeTab === tab.id
                                                ? "text-saffron bg-saffron/5"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="accountActiveTab"
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-saffron"
                                            />
                                        )}
                                        <tab.icon className="w-5 h-5" />
                                        <span className={cn("font-medium", isHindi && "devanagari")}>{tab.label}</span>
                                        <ChevronRight className={cn(
                                            "w-4 h-4 ml-auto transition-transform",
                                            activeTab === tab.id ? "text-saffron" : "opacity-0"
                                        )} />
                                    </button>
                                ))}
                                <div className="h-px bg-border/50 my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-500/5 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className={cn("font-medium", isHindi && "devanagari")}>
                                        {isHindi ? 'लॉग आउट' : 'Log Out'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="md:col-span-3">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "rounded-2xl border p-8",
                                    isBhakti ? "bg-card border-border" : "bg-steel border-border/10"
                                )}
                            >
                                {/* PROFILE TAB */}
                                {activeTab === 'profile' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className={cn("text-xl font-semibold", isHindi && "devanagari")}>
                                                {isHindi ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
                                            </h2>
                                            <Button
                                                onClick={handleSaveProfile}
                                                disabled={profileSaving}
                                                className="bg-saffron hover:bg-saffron-dark text-white"
                                            >
                                                {profileSaving ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4 mr-2" />
                                                )}
                                                {isHindi ? 'सहेजें' : 'Save Changes'}
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>{isHindi ? 'पूरा नाम' : 'Full Name'}</Label>
                                                <Input
                                                    value={profileName}
                                                    onChange={(e) => setProfileName(e.target.value)}
                                                    className={!isBhakti ? "bg-steel-dark border-border/20" : ""}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{isHindi ? 'ईमेल' : 'Email'}</Label>
                                                <Input
                                                    value={profileEmail}
                                                    onChange={(e) => setProfileEmail(e.target.value)}
                                                    className={!isBhakti ? "bg-steel-dark border-border/20" : ""}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{isHindi ? 'फ़ोन नंबर' : 'Phone Number'}</Label>
                                                <Input
                                                    value={profilePhone}
                                                    onChange={(e) => setProfilePhone(e.target.value)}
                                                    className={!isBhakti ? "bg-steel-dark border-border/20" : ""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ORDERS TAB */}
                                {activeTab === 'orders' && (
                                    <div>
                                        <h2 className={cn("text-xl font-semibold mb-6", isHindi && "devanagari")}>
                                            {isHindi ? 'हाल के ऑर्डर' : 'Recent Orders'}
                                        </h2>
                                        {ordersLoading ? (
                                            <div className="text-center py-12">
                                                <Loader2 className="w-8 h-8 animate-spin text-saffron mx-auto" />
                                            </div>
                                        ) : orders && orders.length > 0 ? (
                                            <div className="space-y-4">
                                                {orders.slice(0, 5).map((order) => (
                                                    <div
                                                        key={order.orderNumber}
                                                        className={cn(
                                                            "p-4 rounded-xl border flex items-center justify-between",
                                                            isBhakti ? "border-border" : "border-border/20"
                                                        )}
                                                    >
                                                        <div>
                                                            <p className="font-medium">{order.orderNumber}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-saffron">₹{order.total}</p>
                                                            <p className="text-sm capitalize text-muted-foreground">{order.status}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Link to="/orders" className="block text-center text-saffron text-sm hover:underline mt-4">
                                                    {isHindi ? 'सभी ऑर्डर देखें →' : 'View All Orders →'}
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Package className="w-10 h-10 text-muted-foreground" />
                                                </div>
                                                <h3 className={cn("text-lg font-medium mb-2", isHindi && "devanagari")}>
                                                    {isHindi ? 'कोई ऑर्डर नहीं' : 'No recent orders'}
                                                </h3>
                                                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                                    {isHindi
                                                        ? 'आपने अभी तक कोई ऑर्डर नहीं दिया है। हमारी दुकान देखें!'
                                                        : 'You haven\'t placed any orders yet. Check out our collection!'}
                                                </p>
                                                <Link to="/products">
                                                    <Button className="bg-saffron hover:bg-saffron-dark text-white">
                                                        {isHindi ? 'खरीदारी शुरू करें' : 'Start Shopping'}
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ADDRESSES TAB */}
                                {activeTab === 'addresses' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className={cn("text-xl font-semibold", isHindi && "devanagari")}>
                                                {isHindi ? 'सेव किए गए पते' : 'Saved Addresses'}
                                            </h2>
                                            <Button
                                                variant="outline"
                                                className="border-saffron text-saffron hover:bg-saffron/10"
                                                onClick={() => {
                                                    setAddressToEdit(null);
                                                    setIsAddressFormOpen(true);
                                                }}
                                            >
                                                {isHindi ? 'नया पता जोड़ें' : 'Add New Address'}
                                            </Button>
                                        </div>

                                        {addressesLoading ? (
                                            <div className="text-center py-12">
                                                <Loader2 className="w-8 h-8 animate-spin text-saffron mx-auto" />
                                            </div>
                                        ) : addresses && addresses.length > 0 ? (
                                            <div className="space-y-4">
                                                {addresses.map((addr) => (
                                                    <div
                                                        key={addr.id}
                                                        className={cn(
                                                            "p-4 rounded-xl border relative group",
                                                            addr.isDefault ? "border-saffron bg-saffron/5" : (isBhakti ? "border-border" : "border-border/20")
                                                        )}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <p className="font-medium">{addr.name}</p>
                                                                    <span className="text-xs capitalize text-muted-foreground px-2 py-0.5 bg-muted rounded-full">{addr.type}</span>
                                                                    {addr.isDefault && (
                                                                        <span className="text-xs text-saffron px-2 py-0.5 bg-saffron/10 rounded-full flex items-center gap-1">
                                                                            <CheckCircle className="w-3 h-3" />
                                                                            {isHindi ? 'डिफ़ॉल्ट' : 'Default'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                                                                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                                                                <p className="text-sm text-muted-foreground">{addr.phone}</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-saffron"
                                                                    onClick={() => {
                                                                        setAddressToEdit(addr);
                                                                        setIsAddressFormOpen(true);
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                                    onClick={async () => {
                                                                        if (confirm(isHindi ? 'क्या आप इस पते को हटाना चाहते हैं?' : 'Are you sure you want to delete this address?')) {
                                                                            await deleteAddress(addr.id);
                                                                            refetchAddresses();
                                                                            toast.success(isHindi ? 'पता हटा दिया गया' : 'Address deleted');
                                                                        }
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <MapPin className="w-10 h-10 text-muted-foreground" />
                                                </div>
                                                <h3 className={cn("text-lg font-medium mb-2", isHindi && "devanagari")}>
                                                    {isHindi ? 'कोई पता सेव नहीं है' : 'No addresses saved'}
                                                </h3>
                                                <Button
                                                    variant="outline"
                                                    className="mt-4 border-saffron text-saffron hover:bg-saffron/10"
                                                    onClick={() => {
                                                        setAddressToEdit(null);
                                                        setIsAddressFormOpen(true);
                                                    }}
                                                >
                                                    {isHindi ? 'नया पता जोड़ें' : 'Add New Address'}
                                                </Button>
                                            </div>
                                        )}

                                        <AddressFormDialog
                                            open={isAddressFormOpen}
                                            onOpenChange={setIsAddressFormOpen}
                                            addressToEdit={addressToEdit}
                                            onSuccess={() => {
                                                refetchAddresses();
                                                setIsAddressFormOpen(false);
                                            }}
                                        />
                                    </div>
                                )}

                                {/* SECURITY TAB */}
                                {activeTab === 'security' && (
                                    <div className="space-y-6">
                                        <h2 className={cn("text-xl font-semibold mb-6", isHindi && "devanagari")}>
                                            {isHindi ? 'पासवर्ड बदलें' : 'Change Password'}
                                        </h2>
                                        <div className="max-w-md space-y-4">
                                            <div className="space-y-2">
                                                <Label>{isHindi ? 'वर्तमान पासवर्ड' : 'Current Password'}</Label>
                                                <Input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className={!isBhakti ? "bg-steel-dark border-border/20" : ""}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{isHindi ? 'नया पासवर्ड' : 'New Password'}</Label>
                                                <Input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className={!isBhakti ? "bg-steel-dark border-border/20" : ""}
                                                    minLength={8}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{isHindi ? 'पासवर्ड की पुष्टि करें' : 'Confirm New Password'}</Label>
                                                <Input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className={!isBhakti ? "bg-steel-dark border-border/20" : ""}
                                                    minLength={8}
                                                />
                                            </div>
                                            <Button
                                                onClick={handleChangePassword}
                                                disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                                                className="bg-saffron hover:bg-saffron-dark text-white"
                                            >
                                                {passwordSaving ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Lock className="w-4 h-4 mr-2" />
                                                )}
                                                {isHindi ? 'पासवर्ड बदलें' : 'Change Password'}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* NOTIFICATIONS TAB */}
                                {activeTab === 'notifications' && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                                        {isHindi ? 'जल्द आ रहा है...' : 'Coming soon...'}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
