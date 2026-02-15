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
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !room) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const startDateTime = new Date(`${formData.bookingDate}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.bookingDate}T${formData.endTime}`);
            const now = new Date();

            if (startDateTime < now) {
                toast.error("Cannot book in the past!");
                setIsLoading(false);
                return;
            }

            if (startDateTime >= endDateTime) {
                toast.error("End time must be later than start time.");
                setIsLoading(false);
                return;
            }

            const rawId = user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

            const payload = {
                userId: rawId ? parseInt(rawId) : 0,
                roomId: room.id,
                bookingDate: formData.bookingDate,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                description: formData.purpose,
                status: "Pending"
            };

            await api.post('/Bookings', payload);

            setFormData({ bookingDate: '', startTime: '', endTime: '', purpose: ''});
            onSuccess();
            toast.success("Booking request sent!");
            onClose();
        } catch (err: any) {
            const backendMessage = err.response?.data || 'Failed to submit booking request.';
            setError(backendMessage);
            toast.error(backendMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <div>
                        <h2 className="font-bold text-lg">Room Booking Form</h2>
                        <p className="text-blue-100 text-sm">{room.roomName} | Capacity: {room.capacity} People</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 flex items-center gap-2">
                            <X size={16} /> {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="nlock text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Calendar size={14} /> Booking Date
                            </label>
                            <input 
                                type="date" 
                                name="bookingDate"
                                value={formData.bookingDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Clock size={14} /> Start Time
                                </label>
                                <input 
                                    type="time" 
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Clock size={14} /> End Time
                                </label>
                                <input 
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <FileText size={14} /> Purpose of Use
                            </label>
                            <textarea 
                                name="purpose"
                                value={formData.purpose}
                                onChange={ handleChange }
                                placeholder="e.h., Student Organization Meeting, Replacement Class..."
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required    
                            ></textarea>
                        </div>
                        <div className="pt-4 mt-2 border-t border-gray-300 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hober:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-blue-500/30 transition-all active-scale-95 disabled:opacity-50"   
                            >
                                {isLoading ? 'Submitting...' : <><CheckCircle size={18} /> Book Now</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;