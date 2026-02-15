import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { CheckCircle, XCircle, Clock, Search, AlertTriangle, Trash2, Filter, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";
import DeleteBookingModal from "../../components/DeleteBookingModal";

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
            await api.put(`/Bookings/${targetId}/status`, { status: 1 });
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
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">Approved</span>;
            case '2': case 'rejected':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">Rejected</span>;
            case '3': case 'cancelled':
                return <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200">Cancelled</span>;
            default:
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">Pending</span>;
        }
    };

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
                    <p className="text-gray-500 text-sm">Review and manage all room reservation requests.</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search user..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm w-full lg:w-48 bg-white" 
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-9 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none cursor-pointer"
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
                            className="pl-9 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none cursor-pointer"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                                <div className="font-medium text-gray-800">{item.room.roomName}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <Clock size={12}/> {formatDateTime(item.startTime)}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 max-w-xs truncate" title={item.description}>{item.description}</td>
                                            <td className="p-4 text-center">{getStatusBadge(item.status)}</td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    {isPending ? (
                                                        <>
                                                            <button
                                                                onClick={() => openApproveConfirm(item.id)}
                                                                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => openRejectModal(item.id)}
                                                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                                title="Reject"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => openDeleteModal(item)}
                                                            className="p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                                                            title="Delete Permanently"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-500 italic">No bookings found matching filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleApprove}
                title="Approve Booking?"
                message="Are you sure you want to approve this request?"
                confirmText="Yes, Approve"
                isLoading={isLoading}
            />

            <DeleteBookingModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                userName={bookingToDelete?.user?.username || ""}
                roomName={bookingToDelete?.room?.roomName || ""}
                isLoading={isLoading}
            />

            {isRejectModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-fade-in-up">
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
                        <div className="flex justify-end gap-2 text-sm">
                            <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                            <button onClick={handleRejectSubmit} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Reject Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;