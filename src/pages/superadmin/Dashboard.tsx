import { useState, useEffect } from "react";
import { getCampuses, createCampus, generateAdminToken } from "../../services/campusService";
import toast from "react-hot-toast";
import { Building2, Plus, Key, Copy, RefreshCw, ShieldAlert, AlertTriangle } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

const SuperAdminDashboard = () => {
    const [campuses, setCampuses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCampusName, setNewCampusName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedCampusId, setSelectedCampusId] = useState<number | null>(null);
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        fetchCampuses();
    }, []);

    const fetchCampuses = async () => {
        try {
            const data = await getCampuses();
            setCampuses(data);
        } catch (error) {
            toast.error("Failed to fetch campus data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCampus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCampusName.trim()) return;

        setIsCreating(true);
        try {
            await createCampus(newCampusName);
            toast.success("New campus successfully registered!");
            setNewCampusName('');
            fetchCampuses();
        } catch (error: any) {
            toast.error(error.response?.data || "Failed to create campus.");
        } finally {
            setIsCreating(false);
        }
    };

    const triggerRegenerateConfirm = (campusId: number) => {
        setSelectedCampusId(campusId);
        setIsConfirmOpen(true);
    };

    const handleRegenerateAdminToken = async () => {
        if (!selectedCampusId) return;

        setIsRegenerating(true);
        try {
            await generateAdminToken(selectedCampusId);
            toast.success("Admin Token successfully updated!");
            setIsConfirmOpen(false);
            fetchCampuses();
        } catch (error) {
            toast.error("Failed to update token");
        } finally {
            setIsRegenerating(false);
            setSelectedCampusId(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Token copied!");
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500 font-medium">Loading data...</div>;

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
            <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <ShieldAlert className="text-red-500" size={32} />
                        SuperAdmin Panel
                    </h1>
                    <p className="text-gray-500 text-sm">Manage institution registration and master access tokens.</p>
                </div>

                <form onSubmit={handleCreateCampus} className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <input 
                        type="text"
                        placeholder="New Campus Name..."
                        className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none flex-1 lg:w-64 text-sm shadow-sm"
                        value={newCampusName}
                        onChange={(e) => setNewCampusName(e.target.value)}
                        required 
                    />
                    <button 
                        type="submit"
                        disabled={isCreating}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:bg-gray-400 text-sm active:scale-95 shadow-sm">
                        <Plus size={18} />
                        {isCreating ? 'Saving...' : 'Add Campus'}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campuses.map((campus) => (
                    <div key={campus.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden transition-all hover:shadow-md">
                        <div className="p-5 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                                        <Building2 size={24} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-gray-900 truncate" title={campus.name}>{campus.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-mono tracking-wider">ID: #{campus.id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Admin Token</label>
                                    <TokenBadge token={campus.adminRegistrationToken} type="admin" onCopy={copyToClipboard} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Member Token</label>
                                    <TokenBadge token={campus.memberRegistrationToken} type="member" onCopy={copyToClipboard} />
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
                            <button
                                onClick={() => triggerRegenerateConfirm(campus.id)}
                                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all group"
                            >
                                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                                Regenerate Admin Token
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {campuses.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">No campuses registered yet.</p>
                </div>
            )}

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleRegenerateAdminToken}
                variant="warning"
                title="Security Alert"
                message="Regenerating the Admin Token will invalidate the current one immediately. Future admins must use the new token to register."
                confirmText="Yes, Regenerate"
                isLoading={isRegenerating}
            />
        </div>
    );
};

const TokenBadge = ({ token, type, onCopy }: { token: string, type: 'admin' | 'member', onCopy: (t: string) => void }) => {
    const isAdmin = type === 'admin';
    return (
        <div 
            onClick={() => onCopy(token)}
            className={`
                flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all active:scale-95 group
                ${isAdmin ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100/50' : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100/50'}
                w-full
            `}
        >
            <div className="flex items-center gap-2 overflow-hidden">
                <Key size={14} className="shrink-0 opacity-70" />
                <span className="font-mono text-xs truncate font-medium">{token}</span>
            </div>
            <Copy size={14} className="shrink-0 opacity-40 group-hover:opacity-100" />
        </div>
    );
};

export default SuperAdminDashboard;