import { useEffect, useState } from "react";
import { X, Calendar, User as UserIcon, CheckCircle, AlertCircle, XCircle, ArrowRight } from "lucide-react";
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
        const baseClasses = "flex items-center gap-1 px-2 py-1 rounded text-[10px] md:text-xs font-bold border shrink-0";

        switch (normalizedStatus) {
            case 'pending': 
                return (
                    <span className={`${baseClasses} text-yellow-700 bg-yellow-100 border-yellow-200`}>
                        <AlertCircle size={12}/> Pending
                    </span>
                );
            case 'approved': 
                return (
                    <span className={`${baseClasses} text-green-700 bg-green-100 border-green-200`}>
                        <CheckCircle size={12}/> Booked
                    </span>
                );
            case 'rejected': 
                return (
                    <span className={`${baseClasses} text-red-600 bg-red-100 border-red-200`}>
                        <XCircle size={12}/> Rejected
                    </span>
                );
            case 'cancelled': 
                return (
                    <span className={`${baseClasses} text-gray-600 bg-gray-100 border-gray-200`}>
                        <XCircle size={12}/> Cancelled
                    </span>
                );
            default: 
                return <span className="bg-gray-100 px-2 py-1 rounded text-xs">{status}</span>;
        }
    };

    const formatDateTime = (dateString: string) => {
        const d = new Date(dateString);
        return {
            date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
        };
    };

    if (!isOpen || !room) return null;

    const buildingName = typeof room.building === 'object' ? room.building?.name : room.building;
    const typeName = typeof room.roomType === 'object' ? room.roomType?.name : (room as any).type;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[100] backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up flex flex-col h-[85vh] sm:h-auto max-h-[90vh]">
                
                <div className={`p-5 md:p-6 text-white flex justify-between items-start shrink-0 ${room.isAvailable ? 'bg-blue-600' : 'bg-orange-500'}`}>
                    <div className="space-y-1">
                        <h2 className="font-bold text-xl md:text-2xl leading-tight">{room.roomName}</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] md:text-sm">
                            <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">{buildingName}</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">{typeName}</span>
                            <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">
                                <UserIcon size={14} /> {room.capacity} Cap.
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all active:scale-90">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto bg-gray-50 flex-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="text-blue-600" size={20} /> Jadwal Penggunaan Ruangan
                    </h3>

                    {isLoading ? (
                        <div className="py-20 text-center space-y-3">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
                            <p className="text-gray-500 font-medium">Memuat jadwal...</p>
                        </div>
                    ) : schedule.length > 0 ? (
                        <>
                            <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-[10px]">Peminjam</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-[10px]">Tujuan</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-[10px]">Mulai</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-[10px]">Selesai</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-[10px] text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {schedule.map((book) => {
                                            const start = formatDateTime(book.startTime);
                                            const end = formatDateTime(book.endTime);
                                            return (
                                                <tr key={book.id} className="hover:bg-blue-50/30 transition-colors">
                                                    <td className="p-4 align-top">
                                                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                                                            <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px]">
                                                                {book.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            {book.username}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-600 align-top italic max-w-[180px]">
                                                        "{book.purpose || 'Tanpa keterangan'}"
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="text-gray-800 font-bold text-xs">{start.date}</div>
                                                        <div className="text-gray-500 text-[11px] font-medium">{start.time}</div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="text-gray-800 font-bold text-xs">{end.date}</div>
                                                        <div className="text-gray-500 text-[11px] font-medium">{end.time}</div>
                                                    </td>
                                                    <td className="p-4 align-top flex justify-center">
                                                        {getStatusBadge(book.status)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden space-y-3">
                                {schedule.map((book) => {
                                    const start = formatDateTime(book.startTime);
                                    const end = formatDateTime(book.endTime);

                                    return (
                                        <div key={book.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex items-center gap-2 font-bold text-gray-800">
                                                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px]">
                                                        {book.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    {book.username}
                                                </div>
                                                {getStatusBadge(book.status)}
                                            </div>
                                            
                                            <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between gap-2 border border-gray-100 text-[11px]">
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-blue-600 uppercase text-[9px]">Mulai</p>
                                                    <p className="font-bold text-gray-700">{start.date}</p>
                                                    <p className="text-gray-500">{start.time}</p>
                                                </div>
                                                <ArrowRight size={14} className="text-gray-300" />
                                                <div className="space-y-0.5 text-right">
                                                    <p className="font-bold text-red-600 uppercase text-[9px]">Selesai</p>
                                                    <p className="font-bold text-gray-700">{end.date}</p>
                                                    <p className="text-gray-500">{end.time}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Keperluan</p>
                                                <p className="text-xs text-gray-600 italic">"{book.purpose || 'Tanpa keterangan'}"</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <Calendar size={48} className="mx-auto text-gray-200 mb-3" />
                            <p className="font-bold text-gray-600">Jadwal Kosong</p>
                            <p className="text-sm text-gray-400">Belum ada pemesanan untuk ruangan ini.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-gray-100 flex justify-end shrink-0">
                    <button 
                        onClick={onClose} 
                        className="w-full sm:w-auto px-8 py-3 sm:py-2 bg-gray-900 text-white rounded-xl sm:rounded-lg font-bold text-sm transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomScheduleModal;