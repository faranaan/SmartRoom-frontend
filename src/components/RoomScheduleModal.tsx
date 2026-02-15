import { useEffect, useState } from "react";
import { X, Calendar, Clock, User as UserIcon, CheckCircle, AlertCircle, XCircle, AlignLeft } from "lucide-react";
import type { Room } from "../types/room";
import { api } from "../api/axios";

interface RoomScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
}

interface RoomBooking {
    id: number;
    username: string;
    startTime: string;
    endTime: string;
    status: string; 
    purpose: string;
}

const RoomScheduleModal = ({ isOpen, onClose, room }: RoomScheduleModalProps) => {
    const [schedule, setSchedule] = useState<RoomBooking[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && room) {
            fetchRoomSchedule();
        }
    }, [isOpen, room]);

    const fetchRoomSchedule = async () => {
        if (!room) return;
        setIsLoading(true);
        try {
            const response = await api.get(`/Bookings/room/${room.id}`);
            setSchedule(response.data);
        } catch (error) {
            console.error("Failed to fetch room schedule", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const normalizedStatus = status ? status.toLowerCase() : "";

        switch (normalizedStatus) {
            case 'pending': 
                return (
                    <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-xs font-bold border border-yellow-200">
                        <AlertCircle size={12}/> Pending
                    </span>
                );
            case 'approved': 
                return (
                    <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-bold border border-green-200">
                        <CheckCircle size={12}/> Booked
                    </span>
                );
            case 'rejected': 
                return (
                    <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold border border-red-200">
                        <XCircle size={12}/> Rejected
                    </span>
                );
            case 'cancelled': 
                return (
                    <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                        <XCircle size={12}/> Cancelled
                    </span>
                );
            default: 
                return (
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' 
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    if (!isOpen || !room) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className={`p-6 text-white flex justify-between items-start shrink-0 ${room.isAvailable ? 'bg-blue-600' : 'bg-orange-500'}`}>
                    <div>
                        <h2 className="font-bold text-2xl">{room.roomName}</h2>
                        <div className="opacity-90 flex items-center gap-3 mt-2 text-sm">
                            <span className="bg-white/20 px-2 py-1 rounded">{room.building}</span>
                            <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                                <UserIcon size={14} /> {room.capacity} Capacity
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="text-blue-600" /> Room Usage Schedule
                    </h3>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="p-3 font-semibold text-gray-600">User</th>
                                    <th className="p-3 font-semibold text-gray-600">Purpose</th>
                                    <th className="p-3 font-semibold text-gray-600">Date</th>
                                    <th className="p-3 font-semibold text-gray-600">Time</th>
                                    <th className="p-3 font-semibold text-gray-600 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-gray-400">
                                            <div className="flex flex-col justify-center items-center gap-2">
                                                <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                                <span>Fetching schedule...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : schedule.length > 0 ? (
                                    schedule.map((book) => (
                                        <tr key={book.id} className="hover:bg-gray-50 transition">
                                            <td className="p-3 align-top font-medium text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon size={14} className="text-gray-400"/> {book.username}
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-600 whitespace-nowrap align-top">
                                                <div className="flex items-start text-gray-600">
                                                    {book.purpose || 'No purpose provided'}
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-600 whitespace-nowrap align-top">
                                                {formatDate(book.startTime)}
                                            </td>
                                            <td className="p-3 text-gray-700 font-medium align-top">
                                                <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded w-fit whitespace-nowrap">
                                                    <Clock size={14} className="text-gray-400"/>
                                                    {formatTime(book.startTime)} - {formatTime(book.endTime)}
                                                </div>
                                            </td>
                                            <td className="p-3 align-top text-center">
                                                <div className="flex justify-center">
                                                    {getStatusBadge(book.status)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-gray-500">
                                            <Calendar size={40} className="mx-auto text-gray-200 mb-2" />
                                            <p className="font-medium text-gray-600">No booking schedule found.</p>
                                            <p className="text-xs text-gray-400">This room is currently available for your request.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition shadow-sm active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomScheduleModal;