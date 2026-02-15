import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { Calendar, Clock, MapPin, XCircle, Minus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import CancelConfirmationModal from "../../components/CancelConfirmationModal";
import toast from "react-hot-toast";

interface Booking {
    id: number;
    room: {
        roomName: string;
        building: string;
    };
    startTime: string;
    endTime: string;
    description: string;
    status: string;
}

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const response = await api.get('/Bookings/my-bookings');
            setBookings(response.data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string | number) => {
        const s = String(status).toLowerCase();
        if (s === 'approved' || s === '1') return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">Approved</span>
        if (s === 'rejected' || s === '2') return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">Rejected</span>
        if (s === 'cancelled' || s === '3') return <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200">Cancelled</span>
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">Pending</span>
    }

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: false
        });
    };

    const openCancelModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsCancelModalOpen(true);
    }

    const handleConfirmCancel = async () => {
        if (!selectedBooking) return;

        setIsCancelling(true);
        try {
            const userRole = user?.role || user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
            const roleLabel = userRole === "Dosen" ? "Dosen" : "Mahasiswa";

            await api.put(`/Bookings/${selectedBooking.id}/status`, {
                status: 3,
                notes: `Cancelled by ${roleLabel}`
            });
            toast.success("Booking successfully cancelled!.");
            setIsCancelModalOpen(false);
            fetchMyBookings();
        } catch (error) {
            console.error("Failed to cancel:", error);
            toast.error("Failed to cancel booking.");
        } finally {
            setIsCancelling(false);
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Booking History</h1>
            {isLoading ? (
                <div className="text-center py-10">Loading data...</div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No booking history found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600">Room</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Schedule</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Purpose</th>
                                <th className="p-4 pl-7 text-sm font-semibold text-gray-600">Status</th>
                                <th className="p-4 pl-7 text-sm font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{item.room.roomName}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <MapPin size={10} /> {item.room.building}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Calendar size={14} className="text-blue-500" />
                                            {formatDate(item.startTime)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            <Clock size={14} className="text-orange-500" />
                                            {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                        {item.description}
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {(item.status === "Pending" || item.status === "0") ? (
                                            <button
                                                onClick={() => openCancelModal(item)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center justify-start gap-1 w-full"
                                            >
                                                <XCircle size={16} /> Cancel
                                            </button>
                                        ) : (
                                            <div className="text-gray-500 pl-6">
                                                <Minus size={16} />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <CancelConfirmationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                roomName={selectedBooking?.room.roomName || ""}
                isLoading={isCancelling}
            />
        </div>
    );
};

export default MyBookings;