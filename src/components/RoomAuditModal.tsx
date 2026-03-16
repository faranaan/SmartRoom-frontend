import { useEffect, useState } from "react";
import { X, History, User, Clock, Info } from "lucide-react";
import { api } from "../api/axios";

interface RoomAuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId?: number;
    roomName?: string; 
}

interface RoomLog {
    id: number;
    action: number | string; 
    performedBy: string; 
    timeStamp: string;   
    notes: string;       
    peminjam: string;    
}

const RoomAuditModal = ({ isOpen, onClose, roomId, roomName }: RoomAuditModalProps) => {
    const [logs, setLogs] = useState<RoomLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && roomId) {
            fetchRoomLogs();
        }
    }, [isOpen, roomId]);

    const fetchRoomLogs = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/Bookings/room/${roomId}/logs`);
            setLogs(response.data);
        } catch (error) {
            console.error("Gagal mengambil log ruangan", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getActionBadge = (action: number | string) => {
        const a = String(action).toLowerCase();
        const baseClass = "px-2 py-1 rounded text-[10px] sm:text-xs font-bold border uppercase tracking-tight";

        if (a === '0' || a === 'created') {
            return <span className={`${baseClass} text-blue-600 bg-blue-100 border-blue-200`}>Created</span>;
        }
        if (a === '1' || a === 'approved') {
            return <span className={`${baseClass} text-green-600 bg-green-100 border-green-200`}>Approved</span>;
        }
        if (a === '2' || a === 'rejected') {
            return <span className={`${baseClass} text-red-600 bg-red-100 border-red-200`}>Rejected</span>;
        }
        if (a === '3' || a === 'cancelled') {
            return <span className={`${baseClass} text-gray-600 bg-gray-100 border-gray-200`}>Cancelled</span>;
        }

        return <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-[10px]">Unknown</span>;
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', { 
            day: 'numeric', month: 'short',
            hour: '2-digit', minute: '2-digit' 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[100] backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[85vh] sm:h-auto sm:max-h-[90vh] animate-fade-in-up">
                
                <div className="bg-blue-600 text-white p-4 sm:p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="font-bold text-lg sm:text-2xl truncate max-w-[250px] sm:max-w-none">
                            {roomName || "Room Details"}
                        </h2>
                        <p className="opacity-90 flex items-center gap-2 mt-0.5 text-[10px] sm:text-sm">
                            <Info size={12} /> ID: {roomId} • Audit Trail Mode
                        </p>
                    </div>
                    <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto bg-white flex-1 custom-scrollbar">
                    <h3 className="text-md sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <History size={18} className="text-blue-600" /> Activity Logs
                    </h3>
                    
                    <div className="hidden sm:block border rounded-lg overflow-hidden border-gray-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3 font-semibold text-gray-600">Performed By</th>
                                    <th className="p-3 font-semibold text-gray-600">Notes</th>
                                    <th className="p-3 font-semibold text-gray-600">Time</th>
                                    <th className="p-3 font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-gray-400">Loading...</td></tr>
                                ) : logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition">
                                            <td className="p-3">
                                                <div className="font-medium text-gray-700 flex items-center gap-1">
                                                    <User size={14} className="text-gray-400"/> {log.performedBy}
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-1 uppercase">For: {log.peminjam}</div>
                                            </td>
                                            <td className="p-3 text-gray-600 italic">
                                                {log.notes ? `"${log.notes}"` : "-"}
                                            </td>
                                            <td className="p-3 text-gray-500 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Clock size={12} /> {formatDateTime(log.timeStamp)}
                                                </div>
                                            </td>
                                            <td className="p-3">{getActionBadge(log.action)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="p-10 text-center text-gray-400 italic">No activity recorded.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="sm:hidden space-y-3">
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-400">Loading logs...</div>
                        ) : logs.length > 0 ? (
                            logs.map((log) => (
                                <div key={log.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-white rounded-lg border border-gray-100">
                                                <User size={16} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{log.performedBy}</p>
                                                <p className="text-[10px] text-gray-500 italic">Requester: {log.peminjam}</p>
                                            </div>
                                        </div>
                                        {getActionBadge(log.action)}
                                    </div>
                                    
                                    <div className="bg-white p-2 rounded-lg border border-gray-50 text-xs text-gray-600 italic">
                                        {log.notes ? `"${log.notes}"` : "No notes provided"}
                                    </div>

                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium pt-1">
                                        <Clock size={12} /> {formatDateTime(log.timeStamp)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 italic">No activity recorded yet.</div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 flex sm:justify-end shrink-0">
                    <button 
                        onClick={onClose} 
                        className="w-full sm:w-auto px-8 py-3 sm:py-2 bg-white border border-gray-300 text-gray-700 rounded-xl sm:rounded-lg hover:bg-gray-100 font-bold sm:font-medium transition text-sm shadow-sm active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomAuditModal;