import { useEffect, useState } from "react";
import { X, History, User, Clock } from "lucide-react";
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

    // Menggunakan logika IF untuk Badge agar lebih fleksibel
    const getActionBadge = (action: number | string) => {
        const a = String(action).toLowerCase();

        if (a === '0' || a === 'created') {
            return <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs font-bold border border-blue-200">Created</span>;
        }
        if (a === '1' || a === 'approved') {
            return <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold border border-green-200">Approved</span>;
        }
        if (a === '2' || a === 'rejected') {
            return <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold border border-red-200">Rejected</span>;
        }
        if (a === '3' || a === 'cancelled') {
            return <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-bold border border-gray-200">Cancelled</span>;
        }

        return <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">Unknown ({a})</span>;
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', { 
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit' 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
                
                {/* Header - Styled like RoomDetailModal */}
                <div className="bg-blue-600 text-white p-6 flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="font-bold text-2xl">
                            {roomName || "Room Details"}
                        </h2>
                        <p className="opacity-90 flex items-center gap-2 mt-1 text-sm">
                            Room ID: {roomId} | Audit Trail Mode
                        </p>
                    </div>
                    <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto bg-white flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <History className="text-blue-600" /> Activity Logs
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-3 font-semibold text-gray-600">Performed By</th>
                                    <th className="p-3 font-semibold text-gray-600">Notes</th>
                                    <th className="p-3 font-semibold text-gray-600">Time</th>
                                    <th className="p-3 font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="animate-spin h-6 w-6 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                                                <p>Fetching logs...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-white transition bg-gray-50/30">
                                            <td className="p-3 align-top">
                                                <div className="font-medium text-gray-600 flex items-center gap-1">
                                                    <User size={14} className="text-gray-400"/> {log.performedBy}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Requester: <span className="font-semibold">{log.peminjam}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-600 italic align-top">
                                                {log.notes ? `"${log.notes}"` : "-"}
                                            </td>
                                            <td className="p-3 text-gray-500 whitespace-nowrap align-top">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-gray-400" /> 
                                                    {formatDateTime(log.timeStamp)}
                                                </div>
                                            </td>
                                            <td className="p-3 align-top">
                                                {getActionBadge(log.action)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-500">
                                            <p className="mb-1 italic">No activity history recorded yet.</p>
                                            <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">Empty State</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-300 flex justify-end shrink-0">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition text-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomAuditModal;