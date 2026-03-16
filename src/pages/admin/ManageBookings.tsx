import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { CheckCircle, XCircle, Clock, Search, AlertTriangle, Trash2, Filter, Calendar, User, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";

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
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/Bookings');
            setBookings(response.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to fetch bookings.");
        } finally {
            setIsLoading(false);
        }
    };

    const openApproveConfirm = (id: number) => {
        setTargetId(id);
        setIsConfirmOpen(true);
    };

    const handleApprove = async () => {
        if (!targetId) return;
        setIsLoading(true);
        try {
            await api.put(`/Bookings/${targetId}/status`, { status: 1 }, {
                headers: { 'Content-Type': 'application/json' }
            });
            setIsConfirmOpen(false);
            toast.success("Booking Approved!");
            fetchBookings();
        } catch (error) {
            toast.error("Failed to approve booking.");
        } finally {
            setIsLoading(false);
        }
    };

    const openRejectModal = (id: number) => {
        setSelectedBookingId(id);
        setRejectReason("");
        setIsRejectModalOpen(true);
    };

    const handleRejectSubmit = async () => {
        if (!selectedBookingId || !rejectReason.trim()) {
            toast.error("Please provide a reason for rejection.");
            return;
        }
        try {
            await api.put(`/Bookings/${selectedBookingId}/status`, {
                status: 2,
                notes: rejectReason
            });
            toast.success("Booking Rejected!");
            setIsRejectModalOpen(false);
            fetchBookings();
        } catch (error) {
            toast.error("Failed to reject booking.");
        }
    };

    const openDeleteModal = (booking: Booking) => {
        setBookingToDelete(booking);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!bookingToDelete) return;
        setIsLoading(true);
        try {
            await api.delete(`/Bookings/${bookingToDelete.id}`);
            toast.success("Booking deleted permanently.");
            setBookings(prev => prev.filter(b => b.id !== bookingToDelete.id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Failed to delete booking.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBookings = bookings
        .filter((item) => {
            const username = item.user?.username || "";
            const matchesSearch = username.toLowerCase().includes(searchTerm.toLowerCase());
            
            const s = String(item.status).toLowerCase();
            let matchesStatus = true;
            if (filterStatus === 'Pending') matchesStatus = (s === '0' || s === 'pending');
            else if (filterStatus === 'Approved') matchesStatus = (s === '1' || s === 'approved');
            else if (filterStatus === 'Rejected') matchesStatus = (s === '2' || s === 'rejected');
            else if (filterStatus === 'Cancelled') matchesStatus = (s === '3' || s === 'cancelled');
            
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const dateA = new Date(a.startTime).getTime();
            const dateB = new Date(b.startTime).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    const getStatusBadge = (status: number | string) => {
        const s = String(status).toLowerCase();
        switch (s) {
            case '1': case 'approved':
                return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[10px] sm:text-xs font-bold border border-green-200 uppercase tracking-wider">Approved</span>;
            case '2': case 'rejected':
                return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-[10px] sm:text-xs font-bold border border-red-200 uppercase tracking-wider">Rejected</span>;
            case '3': case 'cancelled':
                return <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] sm:text-xs font-bold border border-gray-200 uppercase tracking-wider">Cancelled</span>;
            default:
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-[10px] sm:text-xs font-bold border border-yellow-200 uppercase tracking-wider">Pending</span>;
        }
    };

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-full overflow-hidden space-y-4 sm:space-y-6 px-1 sm:px-0">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Bookings</h1>
                    <p className="text-gray-500 text-xs sm:text-sm">Review and manage all room reservation requests.</p>
                </div>

                <div className="grid grid-cols-1 md:flex md:flex-wrap gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search user..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" 
                        />
                    </div>
                    <div className="grid grid-cols-2 md:flex gap-2">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select 
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                className="w-full pl-9 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none cursor-pointer"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-600 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Requester</th>
                                <th className="p-4 font-semibold">Room & Time</th>
                                <th className="p-4 font-semibold">Purpose</th>
                                <th className="p-4 font-semibold text-center">Status</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {isLoading && bookings.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading bookings...</td></tr>
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((item) => {
                                    const s = String(item.status).toLowerCase();
                                    const isPending = s === '0' || s === 'pending';
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">{item.user?.username || "Unknown"}</div>
                                                <div className="text-xs text-gray-500">{item.user?.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-gray-800">{item.room?.roomName}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <Clock size={12}/> {formatDateTime(item.startTime)}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 max-w-[150px] lg:max-w-xs truncate" title={item.description}>{item.description}</td>
                                            <td className="p-4 text-center">{getStatusBadge(item.status)}</td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    {isPending ? (
                                                        <>
                                                            <button onClick={() => openApproveConfirm(item.id)} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition" title="Approve"><CheckCircle size={18} /></button>
                                                            <button onClick={() => openRejectModal(item.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition" title="Reject"><XCircle size={18} /></button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => openDeleteModal(item)} className="p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-500 italic">No bookings found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="md:hidden space-y-3">
                {isLoading && bookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 bg-white rounded-xl border">Loading bookings...</div>
                ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((item) => {
                        const s = String(item.status).toLowerCase();
                        const isPending = s === '0' || s === 'pending';
                        return (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{item.user?.username || "Unknown"}</div>
                                            <div className="text-[10px] text-gray-500">{item.user?.email}</div>
                                        </div>
                                    </div>
                                    {getStatusBadge(item.status)}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-50 text-xs">
                                    <div className="space-y-1">
                                        <span className="text-gray-400 block uppercase text-[9px] font-semibold">Room</span>
                                        <div className="flex items-center gap-1 text-gray-700 font-medium">
                                            <MapPin size={12} className="text-gray-400"/> {item.room?.roomName}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-gray-400 block uppercase text-[9px] font-semibold">Schedule</span>
                                        <div className="flex items-center gap-1 text-gray-700 font-medium">
                                            <Clock size={12} className="text-gray-400"/> {formatDateTime(item.startTime)}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg italic">
                                    "{item.description}"
                                </div>

                                <div className="flex gap-2 pt-1">
                                    {isPending ? (
                                        <>
                                            <button onClick={() => openApproveConfirm(item.id)} className="flex-1 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold shadow-sm shadow-green-100 active:scale-95 transition">
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button onClick={() => openRejectModal(item.id)} className="flex-1 py-2 bg-white text-red-600 border border-red-200 rounded-lg flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition">
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => openDeleteModal(item)} className="w-full py-2 bg-gray-50 text-gray-500 rounded-lg flex items-center justify-center gap-2 text-xs font-medium hover:bg-red-50 hover:text-red-600 transition">
                                            <Trash2 size={14} /> Delete Record
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-12 text-center text-gray-500 italic bg-white rounded-xl border">No bookings found.</div>
                )}
            </div>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleApprove}
                variant="info"
                title="Approve Booking?"
                message="Are you sure you want to approve this room reservation request?"
                confirmText="Yes, Approve"
                isLoading={isLoading}
            />

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="danger"
                title="Delete Booking?"
                message={
                    <span className="text-sm">
                        Are you sure you want to delete the booking for <strong>{bookingToDelete?.room?.roomName}</strong> by <strong>{bookingToDelete?.user?.username}</strong>? This action is permanent.
                    </span>
                }
                confirmText="Delete Now"
                isLoading={isLoading}
            />

            {isRejectModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 backdrop-blur-sm p-0 sm:p-4">
                    <div className="bg-white p-6 rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:w-96 animate-fade-in-up">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" onClick={() => setIsRejectModalOpen(false)}></div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={20} /> Reject Booking
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this booking.</p>
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none mb-4 text-sm"
                            rows={3}
                            placeholder="Example: Room under maintenance..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 text-sm">
                            <button onClick={() => setIsRejectModalOpen(false)} className="order-2 sm:order-1 px-4 py-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Cancel</button>
                            <button onClick={handleRejectSubmit} className="order-1 sm:order-2 px-4 py-3 sm:py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg shadow-red-100 transition">Reject Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;