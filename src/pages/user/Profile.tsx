import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import toast from "react-hot-toast";
import { User, Mail, Building, ShieldCheck, Save } from "lucide-react";

const Profile = () => {
    const [profile, setProfile] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getUserProfile();
            setProfile(data);
            setEmail(data.email || '');
        } catch (error) {
            toast.error("Failed to fetch profile data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUserProfile(email);
            toast.success("Email updated successfully!");
            fetchProfile();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update email.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 font-medium">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto"> 
            <div className="mb-8 text-center"> 
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account information and notification settings.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white flex flex-col items-center text-center">
                    <div className="bg-white/20 p-5 rounded-full mb-4 backdrop-blur-sm border border-white/30 shadow-xl">
                        <User size={50} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{profile?.username}</h2>
                        <div className="flex items-center justify-center gap-2 mt-2 bg-black/10 px-4 py-1 rounded-full text-sm">
                            <ShieldCheck size={16} />
                            <span className="font-medium uppercase tracking-wider text-xs">Role: {profile?.role}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="mb-10">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Building className="text-blue-500" size={20} />
                            Affiliation Information
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 group transition hover:border-blue-200">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered Institution / Campus</p>
                            <p className="font-bold text-gray-800 mt-1 text-xl">
                                {profile?.campusName || "No campus affiliation (SuperAdmin)"}
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full mb-10" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Mail className="text-blue-500" size={20} />
                            Email Settings
                        </h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            Add your email address to receive notifications when your room booking status is approved or rejected.
                        </p>
                        <form onSubmit={handleSaveEmail} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="email"
                                        className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none"
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-200 ${
                                        isSaving 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                                    } w-full md:w-auto`}
                                >
                                    {isSaving ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    {isSaving ? "Saving..." : "Update Email"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;