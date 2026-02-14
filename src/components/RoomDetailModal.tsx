import { X, Calendar } from "lucide-react";
import type { Room } from "../types/room";

interface RoomDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
}

const RoomDetailModal = ({ isOpen, onClose, room }: RoomDetailModalProps) => {
    if ( !isOpen || !room ) return null;

    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-fade-in-up">
                <div className={`p-6 text-white flex justify-between items-start ${room.isAvailable ? 'bg-blue-600' : 'bg-orange-500'}`}>
                    <div>
                        <h2 className="font-bold text-2xl">
                            {room.roomName}
                        </h2>
                        <p className="opacity-90 flex items-center gap-2 mt-1">
                            {room.building} | {room.type} | {room.capacity} People
                        </p>
                    </div>
                    <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="text-blue-600" /> History Booking
                    </h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-3 font-semibold text-gray-600">User</th>
                                    <th className="p-3 font-semibold text-gray-600">Date</th>
                                    <th className="p-3 font-semibold text-gray-600">Time</th>
                                    <th className="p-3 font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-gray-500">
                                        <p className="mb-2">No booking history found.</p>
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-300 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailModal;