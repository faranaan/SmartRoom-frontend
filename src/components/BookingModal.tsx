import { useState } from "react";
import { api } from "../api/axios";
import { X, Calendar, Clock, FileText, CheckCircle } from "lucide-react";
import type { Room } from "../types/room";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
    onSuccess: () => void;
}

const BookingModal = ({ isOpen, onClose, room, onSuccess }: BookingModalProps) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        purpose: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !room) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'startDate' && (!prev.endDate || prev.endDate < value)) {
                newData.endDate = value;
            }
            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
            if (startDateTime < new Date()) {
                toast.error("Waktu mulai tidak bisa di masa lalu!");
                setIsLoading(false);
                return;
            }
            if (startDateTime >= endDateTime) {
                toast.error("Waktu selesai harus lebih besar dari waktu mulai.");
                setIsLoading(false);
                return;
            }

            const rawId = user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const payload = {
                userId: rawId ? parseInt(rawId) : 0,
                roomId: room.id,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                description: formData.purpose,
                status: "Pending"
            };

            await api.post('/Bookings', payload);
            setFormData({ startDate: '', endDate: '', startTime: '', endTime: '', purpose: ''});
            onSuccess();
            toast.success("Booking request sent!");
            onClose();
        } catch (err: any) {
            setError(err.response?.data || 'Failed to submit booking request.');
        } finally {
            setIsLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden font-sans">
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <div>
                        <h2 className="font-bold text-lg leading-tight">Room Booking Form</h2>
                        <p className="text-blue-100 text-xs mt-1">{room.roomName} | Capacity: {room.capacity} People</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                                        <Calendar size={13} className="text-blue-500" /> Start Date
                                    </label>
                                    <input 
                                        type="date" 
                                        name="startDate"
                                        min={today}
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                                        <Calendar size={13} className="text-red-400" /> End Date
                                    </label>
                                    <input 
                                        type="date" 
                                        name="endDate"
                                        min={formData.startDate || today}
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                                        <Clock size={13} className="text-blue-500" /> Start Time
                                    </label>
                                    <input 
                                        type="time" 
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                                        <Clock size={13} className="text-red-400" /> End Time
                                    </label>
                                    <input 
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                                <FileText size={13} className="text-blue-500" /> Purpose of Use
                            </label>
                            <textarea 
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                placeholder="Example: Meeting for final project..."
                                rows={3}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                required    
                            ></textarea>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95 transition-all"
                            >
                                {isLoading ? 'Sending...' : <><CheckCircle size={16} /> Book Now</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;