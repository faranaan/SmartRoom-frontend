import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { Calendar, Clock, MapPin, XCircle, Minus, ArrowRight, Info } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/ConfirmModal"; 
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
        const baseClasses = "px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border";
        if (s === 'approved' || s === '1') return <span className={`${baseClasses} bg-green-100 text-green-700 border-green-200`}>Approved</span>
        if (s === 'rejected' || s === '2') return <span className={`${baseClasses} bg-red-100 text-red-700 border-red-200`}>Rejected</span>
        if (s === 'cancelled' || s === '3') return <span className={`${baseClasses} bg-gray-100 text-gray-500 border-gray-200`}>Cancelled</span>
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-700 border-yellow-200`}>Pending</span>
    }

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return {
            date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
        };
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
            toast.success("Booking successfully cancelled!");
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">My Booking History</h1>
                <p className="text-sm text-gray-500 font-medium">Track all your room reservation statuses here.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Loading history...</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="text-gray-300" size={32} />
                    </div>
                    <p className="text-gray-500 font-medium text-lg">No booking history.</p>
                    <p className="text-gray-400 text-sm">Your requested rooms will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:hidden">
                    {bookings.map((item) => {
                        const start = formatDateTime(item.startTime);
                        const end = formatDateTime(item.endTime);
                        return (
                            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="text-lg font-bold text-gray-900 leading-tight">{item.room.roomName}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <MapPin size={12} className="text-blue-500" /> {item.room.building}
                                        </div>
                                    </div>
                                    {getStatusBadge(item.status)}
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between gap-2 border border-gray-100">
                                    <div className="flex-1">
                                        <p className="text-[10px] uppercase font-bold text-blue-500 mb-1">Starts</p>
                                        <p className="text-xs font-bold text-gray-800">{start.date}</p>
                                        <p className="text-[11px] text-gray-500 font-medium">{start.time}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-300 shrink-0" />
                                    <div className="flex-1 text-right">
                                        <p className="text-[10px] uppercase font-bold text-red-500 mb-1">Ends</p>
                                        <p className="text-xs font-bold text-gray-800">{end.date}</p>
                                        <p className="text-[11px] text-gray-500 font-medium">{end.time}</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Purpose:</p>
                                    <p className="text-sm text-gray-600 italic line-clamp-2">"{item.description}"</p>
                                </div>

                                {(item.status === "Pending" || item.status === "0") && (
                                    <button
                                        onClick={() => openCancelModal(item)}
                                        className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:bg-red-100 transition-colors"
                                    >
                                        <XCircle size={16} /> Cancel Booking
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
            {!isLoading && bookings.length > 0 && (
                <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Room</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Schedule</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Purpose</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium text-sm">
                                {bookings.map((item) => {
                                    const start = formatDateTime(item.startTime);
                                    const end = formatDateTime(item.endTime);
                                    return (
                                        <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="p-5">
                                                <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.room.roomName}</div>
                                                <div className="text-[11px] text-gray-400 flex items-center gap-1 font-normal mt-0.5">
                                                    <MapPin size={10} /> {item.room.building}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-4 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-fit">
                                                    <div className="flex flex-col min-w-[80px]">
                                                        <span className="text-[9px] uppercase font-extrabold text-blue-500 tracking-tighter">Starts</span>
                                                        <span className="text-xs font-bold text-gray-800">{start.date}</span>
                                                        <span className="text-[10px] text-gray-500 font-bold">{start.time}</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-gray-300" />
                                                    <div className="flex flex-col min-w-[80px]">
                                                        <span className="text-[9px] uppercase font-extrabold text-red-500 tracking-tighter">Ends</span>
                                                        <span className="text-xs font-bold text-gray-800">{end.date}</span>
                                                        <span className="text-[10px] text-gray-500 font-bold">{end.time}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-gray-600 max-w-[200px] truncate italic" title={item.description}>
                                                "{item.description}"
                                            </td>
                                            <td className="p-5 text-center">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="p-5 text-right">
                                                {(item.status === "Pending" || item.status === "0") ? (
                                                    <button
                                                        onClick={() => openCancelModal(item)}
                                                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-3 py-2 rounded-lg transition-all"
                                                    >
                                                        <XCircle size={14} /> Cancel
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-300 inline-block pr-4 italic text-xs">Completed</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                variant="warning"
                title="Batalkan Booking?"
                message={
                    <div className="text-sm">
                        Apakah kamu yakin ingin membatalkan pemesanan ruangan <strong className="text-red-600">{selectedBooking?.room.roomName}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </div>
                }
                confirmText="Ya, Batalkan Sekarang"
                isLoading={isCancelling}
            />
        </div>
    );
};

export default MyBookings;