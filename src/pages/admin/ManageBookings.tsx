import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { CheckCircle, XCircle, Clock, Search, AlertTriangle } from "lucide-react";

interface Booking {
    id: number;
    user: {
        username: string;
        email: string;
    };
    room: {
        roomName: string;
        building: string;
    };
    startTime: string;
    endTime: string;
    description: string;
    status: number | string;
    notes?: string;
}

const ManageBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/Bookings');
            setBookings(response.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        if (!window.confirm("Approve this booking request?")) return;

        try {
            await api.put(`/Bookings/${id}/status`, { status: 1 });
            alert("Booking Approved!");
            fetchBookings();
        } catch (error) {
            console.error("Error approving:", error);
            alert("Failed to approve booking.");
        }
    };

    const openRejectModal = (id: number) => {
        setSelectedBookingId(id);
        setRejectReason("");
        setIsRejectModalOpen(true);
    }
    
    const handleRejectSubmit = async () => {
        if (!selectedBookingId || !rejectReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }

        try {
            await api.put(`/Bookings/${selectedBookingId}/status`, {
                status: 2,
                notes: rejectReason
            });

            alert("Booking Rejected!");
            setIsRejectModalOpen(false);
            fetchBookings();
        } catch (error) {
            console.error("Error rejecting:", error);
            alert("Failed to reject booking.");
        }
    };

    const getStatusBadge = (status: string | number) => {
        const s = String(status).toLowerCase();
        if (s === 'approved' || s === '1') return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">Approved</span>
        if (s === 'rejected' || s === '2') return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">Rejected</span>
        if (s === 'cancelled' || s === '3') return <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200">Cancelled</span>
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">Pending</span>
    };

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search user..." className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-400">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Requester</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Room & Time</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Purpose</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{item.user?.username || "Unknown"}</div>
                                    <div className="text-xs text-gray-500">{item.user?.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-800">{item.room.roomName}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <Clock size={12}/> {formatDateTime(item.startTime)} - {formatDateTime(item.endTime)}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{item.description}</td>
                                <td className="p-4 text-center">{getStatusBadge(item.status)}</td>
                                <td className="p-4 text-center">
                                    {(item.status === 0 || item.status === "Pending") ? (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleApprove(item.id)}
                                                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition"
                                                title="Approve"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => openRejectModal(item.id)}
                                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                title="Reject"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">Processed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && !isLoading && (
                    <div className="p-8 text-center text-gray-500">No Booking requests found.</div>
                )}
            </div>
            {isRejectModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-fade-in-up">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" /> Reject Booking
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Please provide a reason why this booking is being rejected.</p>
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none mb-4"
                            rows={3}
                            placeholder="Example: The room is under maintenance..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleRejectSubmit} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">
                                Reject Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;